const data = {
    name: "Red Mage Spells",
    type: "spellcastingEntry",
    slug: "red-mage-spells",
    system: {
        ability: { value: "cha" },
        spelldc: { value: 0, dc: 0 },
        tradition: { value: "arcane" },
        prepared: { value: "focus" },
        proficiency: {slug: "red-mage"},
    }
}

Hooks.on('createItem', async function(item, options) {
    if (!(item.type === 'spell') || !(item.traits.has('hb_red-mage'))) return;

    if (item.spellcasting) return;

    const actor = item.actor;
    const sheet = actor.spellcasting.find(x => x.name === 'Red Mage Spells' || (x.system.prepared.value === 'focus' && x.system.proficiency.slug === 'red-mage'));
    if (!sheet) return;

    sheet.addSpell(item);

});

Hooks.on('createItem', async function(item, options) {
    if (!(item.type === 'feat') || !(item.slug === 'way-of-the-red')) return;

    const actor = item.actor;
    const sheet = actor.spellcasting.find(x => x.name === 'Red Mage Spells' || (x.system.prepared.value === 'focus' && x.system.proficiency.slug === 'red-mage'));
    if (sheet) return;

    actor.createEmbeddedDocuments("Item", [data]);
});