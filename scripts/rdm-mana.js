async function add_mana(amount, type='both', ignore_buffs=false, ignore_inbalance=false, enchanted=false) {

    const buffs = {
        white: {
            slug: 'white-mana',
            uuid: 'Compendium.red-mage.red-mage-class.xqjHZpiHbzzP81ix',
        },
        black: {
            slug: 'black-mana',
            uuid: 'Compendium.red-mage.red-mage-class.KSIeH0scnMZq4mP2',
        },
        unbalanced: {
            slug: 'mana-unbalanced',
            uuid: 'Compendium.red-mage.red-mage-class.k391A3lF1Gc8Ayef',
        },
        mana_boost: {
            slug: 'mana-boost',
        },
        acceleration: {
            slug: 'acceleration',
        },
    }

    let log_messages = [];
    const red = game.user.character;
    const feat = red.items.find(item => item.slug === 'aetherial-balance' && item.type === 'feat');
    if (!feat) {
        ui.notifications.warn(`${red.name} does not have the Aetherial Balance class feature!`);
        return;
    }

    for (const name in buffs) {
        buffs[name].item = red.items.find(item => item.slug === buffs[name].slug && item.type === 'effect');
        buffs[name].value = buffs[name].item?.badge?.value ?? 0;
    }

    // Check mana inbalance
    const is_unbalanced = (Math.abs(buffs.white.value - buffs.black.value) >= 11);

    let value = amount;

    if (amount === "double") {

    } else if (amount > 0) {
        if (buffs.mana_boost.value && !ignore_buffs) {
            value = Math.floor(value * 1.5);
            const charges_left = buffs.mana_boost.item.badge.value - 1;
            if (charges_left < 1) {
                await buffs.mana_boost.item.delete();
            } else {
                await buffs.mana_boost.item.update({ system: { badge: { value:  charges_left } } });
            }
        }
        if (is_unbalanced && !ignore_inbalance) {
            value = Math.floor(value * 0.5);
        }
        if (buffs.acceleration.value && !ignore_buffs) {
            value = Math.floor(value * 2);
            const charges_left = buffs.acceleration.item.badge.value - 1;
            if (charges_left < 1) {
                await buffs.acceleration.item.delete();
            } else {
                await buffs.acceleration.item.update({ system: { badge: { value:  charges_left } } });
            }
        }
    } else if (amount < 0) {
        if (enchanted) {
            const skirm1 = red.items.find(item => item.slug === 'skirmisher' && item.type === 'feat');
            const skirm2 = red.items.find(item => item.slug === 'skirmisher-13' && item.type === 'feat');
            if (skirm1) value += 2;
            if (skirm2) value += 1;
        }

        if (
            ((type === 'white' || type == 'both') && Math.abs(value) > buffs.white.value)  
         || ((type === 'black' || type == 'both') && Math.abs(value) > buffs.black.value) 
        ) {
            const type_string =  type != 'both' ? `${type} mana` : 'of both colors of mana';
            ui.notifications.warn(`${red.name} does not have enough mana to spend ${Math.abs(value)} ${type_string}!`);
            return;
        }
    }
    

    for (const name of ['white', 'black']) {
        if (type != name && type != 'both'){
            continue;
        }
        
        let mana = buffs[name].item;

        let added = value;

        // Cap mana at limit
        if (value === 'double') {
            added = buffs[name].value;
        }

        const old = buffs[name].value;

        const verb = added > 0 ? "gained" : "spent";

        buffs[name].value = Math.min(buffs[name].value + added, red.system.redMage.maxMana);

        const actual_change = Math.abs(old - buffs[name].value)

        if (actual_change > 0) {
            log_messages.push(`${red.name} ${verb} ${actual_change} ${name} mana`);
        }
        

        if (buffs[name].value == red.system.redMage.maxMana) {
            log_messages.push(`${name.capitalize()} mana has reached its maximum!`);
        } 

        if (!mana) {
            const mana_obj = await fromUuid(buffs[name].uuid);
            mana_obj.system.badge.value = buffs[name].value;
            const new_mana = await red.createEmbeddedDocuments("Item", [mana_obj]);
            mana = new_mana[0];
        } 

        await mana.update({ system: { badge: { value:  buffs[name].value } } });
        
        
        if (buffs[name].value < 1) {
            await mana.delete();
        }
    }

    // Check inbalance again after modifying, and apply a buff icon
    const now_unbalanced = (Math.abs(buffs.white.value - buffs.black.value) >= 11)
    if (now_unbalanced) {
        if (!buffs.unbalanced.item) {
            const unbalanced = await fromUuid(buffs.unbalanced.uuid);
            await red.createEmbeddedDocuments("Item", [unbalanced]);
        }
    } else {
        if (buffs.unbalanced.item) {
            await buffs.unbalanced.item.delete();
        }
    }

    if (!is_unbalanced && now_unbalanced) {
        log_messages.push(`Mana has become unbalanced!`);
    } else if (is_unbalanced && !now_unbalanced) {
        log_messages.push(`Mana is no longer unbalanced!`);
    }
    

    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({token: red}),
        content: log_messages.join("<br>")
    });
}

// Add buttons to spell casts
Hooks.on("renderChatMessage", async function(message, html, options) {
    const traits = message.item?.system?.traits?.value;
    if (!traits?.includes('hb_red-mage') || !("casting" in message.flags.pf2e)) return;
    let spell_trait = traits.find(x => x.startsWith('hb_red-magic') || x.startsWith('hb_black-magic') || x.startsWith('hb_white-magic') || x.startsWith('hb_colorless'))?.slice(3);
    if (!spell_trait) return;

    // Swap Vercure to give jolt-like mana for chirurgeon
    if (message.item.slug === 'vercure' && ('feature:chirurgeon' in message.actor.flags.pf2e.rollOptions.all)) {
        spell_trait = 'red-magic';
    }

    const tokens = spell_trait.split('-');
    let trait_value = Number(tokens.pop());
    let spell_type;
    if (trait_value) {
        spell_type = tokens.join('-');
    } else {
        spell_type = spell_trait;
        switch(spell_type) {
            case 'red-magic':
                trait_value = 2;
                break;
            case 'black-magic':
            case 'white-magic':
                trait_value = 5;
                break;
            default:
                return;
        }
    }

    let mana_color = "both";
    switch(spell_type) {
        case 'black-magic':
            mana_color = "black";
            break;
        case 'white-magic':
            mana_color = "white";
            break;
    }

    let verb = 'Gain';
    let amount = trait_value;

    if (spell_type === 'colorless') {
        amount = -trait_value;
        verb = 'Spend';
    }

    let words = `${mana_color.capitalize()} Mana`;
    if (mana_color === 'both') {
        words = 'of Both Colors of Mana';
    }
    let phrase = `${verb} ${trait_value} ${words}`
    

    // Double check the tags visually on varient spells to stop weirdness
    if (message.item.isVariant) {
        const text_traits = html.find('.tag').toArray().map(x => $(x).text());
        const trait_labels = {
            'white-magic': 'White Magic',
            'black-magic': 'Black Magic',
            'red-magic': 'Red Magic',
            'colorless': 'Colorless',
        }
        const trait_label =  trait_labels[spell_type];
        const real_tag = text_traits.find(x => x.startsWith(trait_label));
        if (!real_tag) {
            return;
        }
    }

    let anchor = html.find('.owner-buttons')

    if (anchor.length === 0) {
        anchor = html.find('.card-content').after('<hr><section class="card-buttons"><section class="owner-buttons"></section></section>')
    }

    anchor = html.find('.owner-buttons')

    // Special cases
    if (message.item.slug === 'verflare-verholy') {
        html.find('.owner-buttons').append(`<div class="spell-button"><button class="red-mage-mana" data-mana-amount="-15" data-mana-color="${mana_color}">Spend 15 ${mana_color.capitalize()} Mana</button></div>`)
    }

    html.find('.owner-buttons').append(`<div class="spell-button"><button class="red-mage-mana" data-mana-amount="${amount}" data-mana-color="${mana_color}">${phrase}</button></div>`)
});

// Add buttons to enchanted strikes
Hooks.on("renderChatMessage", async function(message, html, options) {
    const context = message.flags?.pf2e?.context;
    if (!(context?.type == 'attack-roll') || !(context?.options?.includes("enchanted")) || !(context?.domains?.includes("weapon-attack-roll"))) return;

    let cost = -10;
    if (context.options.includes("enchanted-redoublement")) cost = -20;

    const phrase = `Spend ${Math.abs(cost)} of Both Colors of Mana`
    html.find('.message-content').prepend(`<button class="red-mage-mana" style="margin: 0 0 0.35em;" data-mana-amount="${cost}" data-mana-color="both" data-enchanted="true">${phrase}</button>`)
});

// Attach functionality to buttons
Hooks.on("ready", async function() {
    $(document).on('click', '.red-mage-mana', async function () {
        const value = $(this).data('mana-amount');
        const color = $(this).data('mana-color');
        const ignore_buffs = $(this).data('ignore-buffs');
        const ignore_inbalance = $(this).data('ignore-inbalance');
        const enchanted = $(this).data('enchanted');
        await add_mana(value, color, ignore_buffs, ignore_inbalance, enchanted);
    });
});
