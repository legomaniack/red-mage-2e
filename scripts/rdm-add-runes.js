import runes from "./runes.js"

async function create_messages(message, active_runes, type, healing=false) {
    if (!active_runes) return;
    
    let appended_message = "";
    let insert_pos = 0;
    let message_attr = "flavor";
    let notes = [];
    if (['damage-roll', 'spell-attack-roll'].includes(type)) {
        const existing_notes = message.flavor.match(/<section class="roll-note">.*<\/section>/s);
        insert_pos = message.flavor.length;
        if (existing_notes) {
            insert_pos = existing_notes.index + existing_notes[0].length;
            appended_message += "<br>";
        }
    } else if (type === 'spell-cast') {
        message_attr = "content";
        const content = message.content.match(/<section class="card-content">.*?<\/section>/s);
        insert_pos = content.index + content[0].length;
    }

    for (let i = 0; i < active_runes.length; i++) {
        label = active_runes[i].label;
        note = healing ? active_runes[i].healing : active_runes[i].message;
        if (!note) continue;
        notes.push(`<section class="roll-note"><strong>${label}</strong> ${await TextEditor.enrichHTML(note, {rollData: message.getRollData()})}</section>`);
        
    }

    appended_message += notes.join("<br>");

    message[message_attr] = message[message_attr].slice(0, insert_pos) + appended_message + message[message_attr].slice(insert_pos);

    await ui.chat.updateMessage(message);
}

Hooks.on("renderChatMessage", async function(message) {
    const traits = message.item?.system?.traits?.value;
    if (!traits?.includes('hb_red-mage') || !("context" in message?.flags?.pf2e)) return;
    const domains = message.flags.pf2e.context.domains;
    const rollOptions = message.flags.pf2e.context.options;
    const type = message.flags.pf2e.type;
    if (!type || !(
       (type == 'spell-attack-roll') 
    || (type == 'spell-cast' && domains.includes('spell-dc'))
    || (type == 'damage-roll' && domains.includes('spell-damage')))){
        return;
    }

    let activeRuneRules = runes.filter(x => rollOptions.includes(`focus-rune:${x.name}`));
    

    if ( rollOptions.includes('feature:chirurgeon') && rollOptions.includes('healing') && type == 'damage-roll' && domains.includes('spell-damage') ){
        await create_messages(message, activeRuneRules, 'damage', healing=true);
        return;
    }

    activeRuneRules = activeRuneRules.filter(x => (x.selector === "attack" && ['spell-cast', 'spell-attack-roll'].includes(type)) 
                                               || (x.selector === "damage" && ['damage-roll'].includes(type)));
    activeRuneRules = activeRuneRules.filter(x => !(x.predicate) || (x.predicate.every(p => rollOptions.includes(p))));
    activeRuneRules = activeRuneRules.filter(x => !(x.outcome) || !(rollOptions.includes('target')) || (x.outcome.includes(message.flags.pf2e.context.outcome)));
    
    await create_messages(message, activeRuneRules, type);
});