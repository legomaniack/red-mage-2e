async function add_mana(amount, type='both') {

    const buffs = {
        white: {
            slug: 'white-mana',
            uuid: 'Item.IdYfqd8b3ebphG9p',
        },
        black: {
            slug: 'black-mana',
            uuid: 'Item.X9KxfHo21BezGEsn',
        },
        unbalanced: {
            slug: 'mana-unbalanced',
            uuid: 'Item.f51I1WcHo6syF94v',
        },
        mana_boost: {
            slug: 'mana-unbalanced',
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
        buffs[name].value = buffs[name].item?.badge?.value ?? 0
    }

    // Check mana inbalance
    const is_unbalanced = (Math.abs(buffs.white.value - buffs.black.value) >= 11);

    let value = amount;

    if (amount > 0) {
        if (buffs.mana_boost.value) {
            value = Math.floor(value * 1.5);
            const charges_left = buffs.mana_boost.item.badge.value - 1;
            if (charges_left < 1) {
                await buffs.mana_boost.item.delete();
            } else {
                await buffs.mana_boost.item.update({ system: { badge: { value:  charges_left } } });
            }
        }
        if (is_unbalanced) {
            value = Math.floor(value * 0.5);
        }
        if (buffs.acceleration.value) {
            value = Math.floor(value * 2);
            const charges_left = buffs.acceleration.item.badge.value - 1;
            if (charges_left < 1) {
                await buffs.acceleration.item.delete();
            } else {
                await buffs.acceleration.item.update({ system: { badge: { value:  charges_left } } });
            }
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
    if ((Math.abs(buffs.white.value - buffs.black.value) >= 11) && !buffs.unbalanced.item) {
        const unbalanced = await fromUuid(buffs.unbalanced.uuid);
        await red.createEmbeddedDocuments("Item", [unbalanced]);
    } else {
        if (buffs.unbalanced.item) {
            await buffs.unbalanced.item.delete();
        }
    }

}