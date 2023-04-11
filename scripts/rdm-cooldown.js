async function roll_1d4_cooldown(name) {

    const recharge_spells = [
        {
            slug: "corps-a-corps",
            name: "Corps a Corps",
        },
        {
            slug: "bio",
            name: "Bio",
        },
        {
            slug: "contre-sixte",
            name: "Contre Sixte",
        },
        {
            slug: "dark",
            name: "Dark",
        },
        {
            slug: "fleche",
            name: "Fleche",
        },
        {
            slug: "slow-haste",
            name: "Slow Haste",
        },
        {
            slug: "stop",
            name: "Stop",
        },
        {
            slug: "verafflatus",
            name: "Verafflatus",
        },
        {
            slug: "verassize",
            name: "Verassize",
        },
        {
            slug: "verblizzard",
            name: "Verblizzard",
        },
        {
            slug: "vermedica",
            name: "Vermedica",
        }
    ]

    let slug = name.toLowerCase().replaceAll(" ", "-");
    const fancy_name = recharge_spells.find(x => x.slug == name.toLowerCase() || x.name.toLowerCase() == name.toLowerCase());
    
    if (fancy_name) {
        slug = fancy_name.slug;
        name = fancy_name.name;
    }

    const buff = "Compendium.red-mage.red-mage-class-spells.rMSnzkVEXstLOzxg";

    const red = game.user.character;

    const existing_buff = red.items.find(x => x.slug === `${slug}-recharge` && x.type === 'effect' && !x.isExpired)

    if (existing_buff) {
        ui.notitifications.warn(`${name} is still recharging!`);
        return;
    }

    let roll = await new Roll(`1d4`);

    await roll.toMessage(messageData={flavor:`${name} recharge`, speaker: {actor:red}});

    const buff_item = await fromUuid(buff);
    const new_buff = (await red.createEmbeddedDocuments("Item", [buff_item]))[0];

    const updates = { 
        name: `${name} Cooldown`,
        system: { 
            duration: { value:  roll.result }, 
            slug: `${slug}-recharge` 
        }
    };

    const icon = red.items.find(x => x.slug === slug)?.img;
    if (icon) {
        updates.img = icon;
    }

    await new_buff.update(updates);
}