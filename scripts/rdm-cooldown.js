async function roll_1d4_cooldown(item, actor) {

    const overrides = [
        {
            slug: "corps-a-corps",
            img: "modules/red-mage/icons/abilities/corps-a-corps.png",
        },
        {
            slug: "displacement",
            img: "modules/red-mage/icons/abilities/displacement.png"
        }
    ]

    const buff_item = await fromUuid("Compendium.red-mage.red-mage-class-spells.rMSnzkVEXstLOzxg");

    const slug = item.slug;
    const name = item.name;

    const override = overrides.find(x => x.slug == slug);

    const red = actor ?? game.user.character;

    const existing_buff = red.items.find(x => x.slug === `${slug}-recharge` && x.type === 'effect' && !x.isExpired)

    if (existing_buff) {
        ui.notifications.warn(`${name} is still recharging!`);
        return;
    }

    let roll = await new Roll(`1d4`);

    await roll.toMessage(messageData={flavor:`${name} recharge`, speaker: {actor:red}});

    
    const new_buff = (await red.createEmbeddedDocuments("Item", [buff_item]))[0];

    const updates = { 
        name: `${name} Cooldown`,
        system: { 
            duration: { value:  roll.result }, 
            slug: `${slug}-recharge` 
        }
    };

    const icon = override?.img ?? item.img;
    if (icon) {
        updates.img = icon;
    }

    await new_buff.update(updates);
}

Hooks.on("ready", async function() {
    $(document).on('click', '.red-mage-cooldown', async function () {
        const message = game.messages.get($(this).parents('.chat-message').data('message-id'));
        
        const item = message?.item;
        if (!item) return;

        const actor = message?.actor;
        
        await roll_1d4_cooldown(item, actor);
    });
});
