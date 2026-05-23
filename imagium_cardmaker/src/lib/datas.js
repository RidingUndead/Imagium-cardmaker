import { writable } from "svelte/store";

import dark from "../assets/elements/dark.png";
import earth from "../assets/elements/earth.png";
import fire from "../assets/elements/fire.png";
import light from "../assets/elements/light.png";
import water from "../assets/elements/water.png";
import wind from "../assets/elements/wind.png";

import normal from "../assets/enchantments/normal.jpg";
import character from "../assets/enchantments/character.jpg";
import magic from "../assets/enchantments/magic.jpg";
import curse from "../assets/enchantments/curse.jpg";
import land from "../assets/enchantments/land.jpg";

export const title = writable("");
export const level = writable(1);
export const creatureType = writable("Melee");
export const enchantment = writable("Normal");
export const familyName = writable("");
export const activeImage = writable(null);
export const atk = writable(0);
export const dmg = writable(-1);
export const def = writable(0);
export const effects = writable("");
export const cardelement = writable(dark);
export const selectingElement = writable(false);
export const cardEnchantment = writable(normal);

export const elements = [dark, earth, fire, light, water, wind];
export const cardTypes = {
    "Normal": normal,
    "Character": character,
    "Magic": magic,
    "Curse": curse,
    "Land": land
}
export const creatureTypes = [
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
    "Simple": ["Normal", "Instant"],
    "Continuous": ["None", "Repeatable", "Connector"],
    "Other": ["None", "Mimic"]
}

export const curseTypes = {
    "Simple": ["Normal", "Instant"],
    "Continuous": ["None", "Repeatable"]
}

export const landTypes = {
    "Normal": true,
    "Replacable": false,
    "Merging": false,
    "Shared": false
}

export const chooseIf = {
    "Normal": ["Normal", "Character"],
    "Magic": ["Magic"],
    "Curse": ["Curse"],
    "Land": ["Land"]
}

export function changeCardType(type) {
    cardEnchantment.set(cardTypes[type]);
    enchantment.set(type);
}

export const snapshot = writable(false);
