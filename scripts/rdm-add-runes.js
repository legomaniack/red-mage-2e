import runes from "./runes.js"

async function create_messages(message, html, active_runes, type, healing=false) {
    if (!active_runes) return;
    
    let appended_message = "";
    let insert_pos = 0;
    let anchor;
    let note_class;
    let message_attr = "flavor";
    let notes = [];
    if (['damage-roll', 'spell-attack-roll', 'damage'].includes(type)) {
        anchor = html.find('span.flavor-text').children(':last-child');
        const existing_notes = anchor?.hasClass('roll-note');
        note_class = 'roll-note';
        if (existing_notes) {
            appended_message += "<br>";
        }
    } else if (type === 'spell-cast') {
        anchor = html.find('section.card-content');
        appended_message += "<hr>";
        note_class = 'red-mage-spell-note';
    } else {
        return;
    }

    for (let i = 0; i < active_runes.length; i++) {
        const label = active_runes[i].label;
        const note = healing ? active_runes[i].healing : active_runes[i].message;
        if (!note) continue;
        notes.push(`<section class="${note_class}"><strong>${label}</strong> ${await TextEditor.enrichHTML(note, {rollData: message.getRollData(), async: true})}</section>`);
    }

    appended_message += notes.join("<br>");

    anchor.after(appended_message);
}

Hooks.on("renderChatMessage", async function(message, html) {
    const traits = message.item?.system?.traits?.value;
    if (!traits?.includes('hb_red-mage') || !("context" in message?.flags?.pf2e)) return;
    const domains = message.flags.pf2e.context.domains;
    const rollOptions = message.flags.pf2e.context.options;
    const type = message.flags.pf2e.context.type;
    if (!type || !(
       (type == 'spell-attack-roll') 
    || (type == 'spell-cast' && domains.includes('spell-dc'))
    || (type == 'damage-roll' && domains.includes('spell-damage')))){
        return;
    }

    let activeRuneRules = runes.filter(x => rollOptions.includes(`focus-rune:${x.name}`));
    

    if ( rollOptions.includes('feature:chirurgeon') && rollOptions.includes('healing') && type == 'damage-roll' && domains.includes('spell-damage') ){
        await create_messages(message, html, activeRuneRules, 'damage-roll', true);
        return;
    }

    activeRuneRules = activeRuneRules.filter(x => (x.selector === "attack" && ['spell-cast', 'spell-attack-roll'].includes(type)) 
                                               || (x.selector === "damage" && ['damage-roll'].includes(type)));
    activeRuneRules = activeRuneRules.filter(x => !(x.predicate) || (x.predicate.every(p => rollOptions.includes(p))));
    activeRuneRules = activeRuneRules.filter(x => !(x.outcome) || !(rollOptions.includes('target')) || (x.outcome.includes(message.flags.pf2e.context.outcome)));
    
    await create_messages(message, html, activeRuneRules, type);
});