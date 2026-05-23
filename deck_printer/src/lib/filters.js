export const selectableCardTypes = [
    "--",
    "Normal",
    "Character",
    "Magic",
    "Curse",
    "Land"
]

export const selectableElements = [
    "--",
    "Dark",
    "Earth",
    "Fire",
    "Light",
    "Water",
    "Wind"
]

export const selectableCreatureTypes = [
    "--",
    "Angel",        // Angyal típus: Szent harcosnak is mondható
    "Aquatic",      // Aquatikus: Vízilény, erős elemi erővel
    "Bird",         // Madár
    "Bug",          // Rovar
    "Burst",        // Gyújtó: Tűz alkotta lény
    "Demon",        // Démon
    "Dino",         // Dinoszauruszok
    "Dragon",       // Sárkány
    "Dream",        // Álom típus: Képzelgést okozó, érzelmekhez köthető típus
    "Fish",         // Hal
    "Golem",        // Gólem: Életre keltett szobor
    "Hurricane",    // Hurrikán: Szél alkotta lény
    "Lightning",    // Villámló lény: Elektromos erővel bíró lények
    "Machine",      // Gép
    "Mage",         // Mágus
    "Mammal",       // Emlős
    "Melee",        // Közelharci
    "Plant",        // Növény
    "Ranged",       // Lövész
    "Reptile",      // Hüllő
    "Undead",       // Élőholt
    "Virtual",      // Virtuális: Számítógépek alkotta lények
    "Weapon",       // Fegyver: Életre keltett fegyverek, vagy fegyverként használt lények
].sort();

export const magicTypes = {
    "Simple": ["--","Normal", "Instant"],
    "Continuous": ["--","Connector", "Repeatable", "None"],
    "Other": ["--","Mimic", "None"]
}


export const curseTypes = {
    "Simple": ["--","Normal", "Instant"],
    "Continuous": ["--","Repeatable", "None"],
    "Other": ["--","Mimic", "None"]
}

export const landTypes = [
    "Clear Filters",
    "Normal",
    "Merging",
    "Replacable",
    "Shared"
]