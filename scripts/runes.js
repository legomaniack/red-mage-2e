export default [
    {
        label: "Crushing Rune", // What the bonus effect is labeled as in the message
        name: "crushing",       // camelCase name of the rune
        selector: "attack",     // "attack" or "damage" - determines whether the effect should show up before or 
                                //      after damage is rolled. (Most runes show up on damage, even for "on-hit" effects. 
                                //      However, due to the way spells work, if you want to have the effect show up only 
                                //      on certain outcomes, it needs to be "attack")
        predicate: ["item:damage:type:bludgeoning"],    // Optional - make the effect only appear if all listed rollOptions are present
        outcome: ["criticalSuccess"],                   // Optional - make the effect only appear on certain results (can list multiple inside the brackets)
        // The message that is posted on damaging spells if the above conditions are met
        message: "When you critically hit a target with this weapon, your target becomes @UUID[Compendium.pf2e.conditionitems.i3OJZU2nk64Df3xm]{Clumsy 1} and @UUID[Compendium.pf2e.conditionitems.MIRkyAjyBeXivMa7]{Enfeebled 1} until the end of your next turn.",
        // The message for healing spell. Healing spells ignore all of the above conditions and always add the note.
        healing: "Make a @Check[type:flat|dc:20] whenever you heal. If you succeed, double the healing dealt.",
    },
    {
        label: "Greater Crushing Rune",
        name: "greaterCrushing",
        selector: "attack",
        predicate: ["item:damage:type:bludgeoning"],
        outcome: ["criticalSuccess"],
        message: "When you critically hit a target with this weapon, your target becomes @UUID[Compendium.pf2e.conditionitems.i3OJZU2nk64Df3xm]{Clumsy 2} and @UUID[Compendium.pf2e.conditionitems.MIRkyAjyBeXivMa7]{Enfeebled 2} until the end of your next turn.",
        healing: "Make a @Check[type:flat|dc:19] whenever you heal. If you succeed, double the healing dealt.",
    },
    {
        label: "Fearsome Rune",
        name: "fearsome",
        selector: "attack",
        outcome: ["criticalSuccess"],
        message: "When you critically hit a target with this weapon, your target becomes @UUID[Compendium.pf2e.conditionitems.TBSHQspnbcqxsmjL]{Frightened 1}.",
        healing: "You give an additional [[/r 2d6]] healing to frightened targets.",
    },
    {
        label: "GreaterFearsome Rune",
        name: "greaterFearsome",
        selector: "attack",
        outcome: ["criticalSuccess"],
        message: "When you critically hit a target with this weapon, your target becomes @UUID[Compendium.pf2e.conditionitems.TBSHQspnbcqxsmjL]{Frightened 2}.",
        healing: "You give an additional [[/r 4d6]] healing to frightened targets.",
    },
    {
        label: "Deathdrinking Rune",
        name: "deathdrinking",
        selector: "attack",
        outcome: ["criticalSuccess"],
        message: "When you critically hit a target with this weapon, you you inflict an additional 1d6 points of positive or negative damage to the creature— whichever type of damage would harm the creature. You may trigger the Deathdrinking Reaction",
        healing: "The first time each combat that you slay a creature, you may spend your reaction to cast Vercure.",
    },
    {
        label: "Energizing Rune",
        name: "energizing",
        selector: "attack",
        outcome: ["criticalSuccess"],
        message: "The damage from you energizing reaction applies",
        healing: "If your previous action was to cast a spell that did elemental damage, you give an additional [[/r 2d6]] healing.",
    },
    {
        label: "Keen Rune",
        name: "keen",
        selector: "attack",
        message: "If your attack hit on a natural 19, or the target failed on a natural 2, you critically succeed/they critically fail.",
        healing: "Make a @Check[type:flat|dc:18] whenever you heal. If you succeed, double the healing dealt.",
    },
    {
        label: "Bloodthirsty Rune",
        name: "bloodthirsty",
        selector: "attack",
        outcome: ["criticalSuccess"],
        message: "When you critically hit a target that's taking persistent bleed damage, your target becomes @UUID[Compendium.pf2e.conditionitems.4D2KBtexWXa6oUMR]{Drained 1}",
        healing: "The first three times each combat that you slay a creature, you may spend your reaction to cast Vercure.",
    },
    {
        label: "Impossible Rune",
        name: "impossible",
        selector: "attack",
        message: "The range of your spells are doubled. The Impossible activation makes an Enchanted Redoublement strike, in addition to the normal text.",
        healing: "You may use the activation to toss your weapon into the air whilst stylishly posing. Your weapon casts three healing spells known to you, chosen at random, on valid targets that would benefit your party. If a spell would have no effect, it is instead cast as Vercure.",
    },
    {
        label: "Ghost Touch Rune",
        name: "ghostTouch",
        selector: "attack",
        message: "Your spells trigger weaknesses to Ghost Touch",
        healing: "You give an additional [[/r 2d6]] healing to ghosts.",
    },
    {
        label: "Fanged Rune",
        name: "fanged",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing to animals.",
    },
    {
        label: "Kin-Warding Rune",
        name: "kinWarding",
        selector: "attack",
        message: "",
        healing: "Your weapon gains the parry trait(ignoring the usual restrictions on weapons having traits). You give an additional [[/r 2d6]] healing while parrying.",
    },
    {
        label: "Returning Rune",
        name: "returning",
        selector: "attack",
        message: "",
        healing: "When you heal, if your next action also heals, you give an additional [[/r 1d6]] healing.",
    },
    {
        label: "Cunning Rune",
        name: "cunning",
        selector: "attack",
        message: "",
        healing: "When you heal, if your next action also heals, you give an additional [[/r 1d6]] healing.",
    },
    {
        label: "Merciful Rune",
        name: "merciful",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing to unconscious targets.",
    },
    {
        label: "Pacifying Rune",
        name: "pacifying",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing to unconscious targets.",
    },
    {
        label: "Bane Rune",
        name: "bane",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing to the type of creature named by the rune",
    },
    {
        label: "Hooked Rune",
        name: "hooked",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing to prone targets.",
    },
    {
        label: "Disrupting Rune",
        name: "disrupting",
        selector: "attack",
        message: "",
        healing: "Your healing spells may damage undead at a 1:1 healing to damage ratio.",
    },
    {
        label: "Demolishing Rune",
        name: "demolishing",
        selector: "attack",
        message: "",
        healing: "Your healing spells may heal constructs.",
    },
    {
        label: "Hauling Rune",
        name: "hauling",
        selector: "attack",
        message: "",
        healing: "Your target may spend their reaction to step 5 feet.",
    },
    {
        label: "Shifting Rune",
        name: "shifting",
        selector: "attack",
        message: "",
        healing: "If you target a different creature than your previous healing spell, [[/r 2d6]] healing.",
    },
    {
        label: "Conducting Rune",
        name: "conducting",
        selector: "attack",
        message: "",
        healing: "When you heal, if your next action Strikes, increase the damage dealt by [[\r 1d6]].",
    },
    {
        label: "Wounding Rune",
        name: "wounding",
        selector: "attack",
        message: "",
        healing: "When you heal in combat, the target gains fast healing equal to 1/2 your charsima modifier for 1 minute.",
    },
    {
        label: "Flurrying Rune",
        name: "flurrying",
        selector: "attack",
        message: "",
        healing: "You may use the activation to instead cast three Vercures, ignoring the usual limit.",
    },
    {
        label: "Greater Fanged Rune",
        name: "greaterFanged",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 4d6]] healing to animals.",
    },
    {
        label: "Giant-Killing Rune",
        name: "giantKilling",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 3d6]] healing to Giant targets.",
    },
    {
        label: "Bloodbane Rune",
        name: "bloodbane",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 5d6]] healing to targets damaged by enemies of the clan this combat.",
    },
    {
        label: "Grievous Rune",
        name: "grievous",
        selector: "attack",
        message: "",
        healing: "Make a @Check[type:flat|dc:19] whenever you heal. If you succeed, double the healing dealt.",
    },
    {
        label: "Coating Rune",
        name: "coating",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 4d6]] healing on the first healing spell cast after activating the rune.",
    },
    {
        label: "Extending Rune",
        name: "extending",
        selector: "attack",
        message: "",
        healing: "Increase the reach or radius of your healing spells by 10 feet.",
    },
    {
        label: "Swarming Rune",
        name: "swarming",
        selector: "attack",
        message: "",
        healing: "You may use the activation to instead cast Vercure on each ally in the area.",
    },
    {
        label: "Anchoring Rune",
        name: "anchoring",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 4d6]] healing to targets who teleported within the previous round.",
    },
    {
        label: "Impactful Rune",
        name: "impactful",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 1d6]] healing.",
    },
    {
        label: "Serrating Rune",
        name: "serrating",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 1d6]] healing.",
    },
    {
        label: "Hopeful Rune",
        name: "hopeful",
        selector: "attack",
        message: "",
        healing: "If your healing is doubled, affected allies gain a {+2 circumstance bonus} to their next attack.",
    },
    {
        label: "Greater Hauling Rune",
        name: "greaterHauling",
        selector: "attack",
        message: "",
        healing: "Your target may step 5 feet.",
    },
    {
        label: "Anarchic Rune",
        name: "anarchic",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing to targets who would receive more damage.",
    },
    {
        label: "Axiomatic Rune",
        name: "axiomatic",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing to targets who would receive more damage.",
    },
    {
        label: "Holy Rune",
        name: "holy",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing to targets who would receive more damage.",
    },
    {
        label: "Unholy Rune",
        name: "unholy",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing to targets who would receive more damage.",
    },
    {
        label: "Brilliant Rune",
        name: "brilliant",
        selector: "attack",
        message: "",
        healing: "Your healing may not be reduced for any reason.",
    },
    {
        label: "Dancing Rune",
        name: "dancing",
        selector: "attack",
        message: "",
        healing: "You may use the activation to instead increase your quickened condition by 1 for three turns. The extra action may only be used to cast healing spells.",
    },
    {
        label: "Spell-Storing Rune",
        name: "spellStoring",
        selector: "attack",
        message: "",
        healing: "You may expend the stored spell for +d6 healing to one target equal to double the stored spell's level.",
    },
    {
        label: "Greater Bloodbane Rune",
        name: "greaterBloodbane",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 8d6]] healing to targets damaged by enemies of the clan this combat.",
    },
    {
        label: "Greater Extending Rune",
        name: "greaterExtending",
        selector: "attack",
        message: "",
        healing: "Increase the reach or radius of your healing spells by 20 feet.",
    },
    {
        label: "Greater Disrupting Rune",
        name: "greaterDisrupting",
        selector: "attack",
        message: "",
        healing: "You may use healing spells to damage undead, at a 1:1 ratio of healing to damage. You give an additional [[/r 2d6]] healing when damaging undead in this way.",
    },
    {
        label: "Major Fanged Rune",
        name: "majorFanged",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 6d6]] healing to animals.",
    },
    {
        label: "Greater Giant-Killing Rune",
        name: "greaterGiantKilling",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 6d6]] healing to giants.",
    },
    {
        label: "Ancestral Echoing Rune",
        name: "ancestralEchoing",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing while benefitting from this rune.",
    },
    {
        label: "Speed Rune",
        name: "speed",
        selector: "attack",
        message: "",
        healing: "Once per combat, you may reduce of the cost of any healing spell to 1 action.",
    },
    {
        label: "GreaterImpactful Rune",
        name: "greaterImpactful",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 2d6]] healing.",
    },
    {
        label: "Greater Anchoring Rune",
        name: "greaterAnchoring",
        selector: "attack",
        message: "",
        healing: "You give an additional [[/r 8d6]] healing to targets who teleported within the last round.",
    },
    {
        label: "Greater Brilliant Rune",
        name: "greaterBrilliant",
        selector: "attack",
        message: "",
        healing: "Your healing may not be reduced for any reason. You may target healing through solid matter.",
    },
];