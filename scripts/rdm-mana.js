async function add_mana(amount, type='both', ignore_buffs=false, ignore_inbalance=true) {

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

    const red = game.user.character;
    let feat = red.items.find(item => item.slug === 'aetherial-balance' && item.type === 'feat');
    if (!feat) {
        ui.notifications.warn(`${red.name} does not have the Aetherial Balance class feature!`);
        return;
    }

    for (const name in buffs) {
        buffs[name].item = red.items.find(item => item.slug === buffs[name].slug && item.type === 'effect');
        buffs[name].value = buffs[name].item?.badge?.value ?? 0;
    }

    // Check mana inbalance
    let is_unbalanced = (Math.abs(buffs.white.value - buffs.black.value) >= 11);

    let value = amount;

    if (amount > 0) {
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
        if (
            ((type === 'white' || type == 'both') && Math.abs(value) > buffs.white.value)  
         || ((type === 'black' || type == 'both') && Math.abs(value) > buffs.black.value) 
        ) {
            type_string =  type != 'both' ? `${type} mana` : 'of both colors of mana';
            ui.notifications.warn(`${red.name} does not have enough mana to spend ${Math.abs(value)} ${type_string}!`);
            return;
        }
    }

    for (const name of ['white', 'black']) {
        if (type != name && type != 'both'){
            continue;
        }
        
        mana = buffs[name].item;

        // Cap mana at limit
        buffs[name].value = Math.min(buffs[name].value + value, red.maxMana);

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
    is_unbalanced = (Math.abs(buffs.white.value - buffs.black.value) >= 11)
    if (is_unbalanced) {
        if (!buffs.unbalanced.item) {
            const unbalanced = await fromUuid(buffs.unbalanced.uuid);
            await red.createEmbeddedDocuments("Item", [unbalanced]);
        }
    } else {
        if (buffs.unbalanced.item) {
            await buffs.unbalanced.item.delete();
        }
    }
}