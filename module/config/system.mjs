export const SYSTEM_ID = "conan-hyborian-age";

export const ATTRIBUTES = Object.freeze({
  might: {
    id: "might",
    label: "CONAN.ATTRIBUTES.might.label",
  },
  edge: {
    id: "edge",
    label: "CONAN.ATTRIBUTES.edge.label",
  },
  grit: {
    id: "grit",
    label: "CONAN.ATTRIBUTES.grit.label",
  },
  wits: {
    id: "wits",
    label: "CONAN.ATTRIBUTES.wits.label",
  },
});

export const ARMOR_TYPES = Object.freeze({
  light: {
    id: "light",
    label: "CONAN.ARMOR_TYPES.light.label",
  },
  medium: {
    id: "medium",
    label: "CONAN.ARMOR_TYPES.medium.label",
  },
  heavy: {
    id: "heavy",
    label: "CONAN.ARMOR_TYPES.heavy.label",
  },
  shield: {
    id: "shield",
    label: "CONAN.ARMOR_TYPES.shield.label",
  },
});

export const CLASSIFICATION = Object.freeze({
  beast: {
    id: "human",
    label: "CONAN.CLASSIFICATION.beast.label",
  },
  demon: {
    id: "demon",
    label: "CONAN.CLASSIFICATION.demon.label",
  },
  human: {
    id: "human",
    label: "CONAN.CLASSIFICATION.human.label",
  },
  monstrosity: {
    id: "monstrosity",
    label: "CONAN.CLASSIFICATION.monstrosity.label",
  },
  object: {
    id: "object",
    label: "CONAN.CLASSIFICATION.object.label",
  },
  undead: {
    id: "undead",
    label: "CONAN.CLASSIFICATION.undead.label",
  },
});

export const DICE = Object.freeze({
  d4: {
    id: "d4",
    label: "CONAN.DICE.d4.label",
    max: 4,
  },
  d6: {
    id: "d6",
    label: "CONAN.DICE.d6.label",
    max: 6,
  },
  d8: {
    id: "d8",
    label: "CONAN.DICE.d8.label",
    max: 8,
  },
  d10: {
    id: "d10",
    label: "CONAN.DICE.d10.label",
    max: 10,
  },
  d12: {
    id: "d12",
    label: "CONAN.DICE.d12.label",
    max: 12,
  },
});

export const DISCIPLINES = Object.freeze({
  alchemy: {
    id: "alchemy",
    label: "CONAN.DISCIPLINES.alchemy.label",
  },
  blackmagic: {
    id: "blackmagic",
    label: "CONAN.DISCIPLINES.blackmagic.label",
  },
  demonology: {
    id: "demonology",
    label: "CONAN.DISCIPLINES.demonology.label",
  },
  necromancy: {
    id: "necromancy",
    label: "CONAN.DISCIPLINES.necromancy.label",
  },
  whitemagic: {
    id: "whitemagic",
    label: "CONAN.DISCIPLINES.whitemagic.label",
  },
});

export const ENNEMIES = Object.freeze({
  minion: {
    id: "minion",
    label: "CONAN.ENNEMIES.minion.label",
  },
  antagonist: {
    id: "antagonist",
    label: "CONAN.ENNEMIES.antagonist.label",
  },
});

export const FIGHTING_STYLES = Object.freeze({
  none: {
    id: "none",
    icon:"fas fa-border-none",
    label: "CONAN.FIGHTING_STYLES.none.label",
    weapons: "CONAN.FIGHTING_STYLES.none.weapons",
    bonus: "CONAN.FIGHTING_STYLES.none.bonus",
    hindrance: "CONAN.FIGHTING_STYLES.none.hindrance",
  },
  deadeyeShooter: {
    id: "deadeyeShooter",
    icon:"far fa-bullseye-arrow",
    label: "CONAN.FIGHTING_STYLES.deadeyeShooter.label",
    weapons: "CONAN.FIGHTING_STYLES.deadeyeShooter.weapons",
    bonus: "CONAN.FIGHTING_STYLES.deadeyeShooter.bonus",
    hindrance: "CONAN.FIGHTING_STYLES.deadeyeShooter.hindrance",
  },
  defensiveFighter: {
    id: "defensiveFighter",
    icon:"fas fa-shield",
    label: "CONAN.FIGHTING_STYLES.defensiveFighter.label",
    weapons: "CONAN.FIGHTING_STYLES.defensiveFighter.weapons",
    bonus: "CONAN.FIGHTING_STYLES.defensiveFighter.bonus",
    hindrance: "CONAN.FIGHTING_STYLES.defensiveFighter.hindrance",
  },
  dualWielder: {
    id: "dualWielder",
    icon:"fas fa-swords",
    label: "CONAN.FIGHTING_STYLES.dualWielder.label",
    weapons: "CONAN.FIGHTING_STYLES.dualWielder.weapons",
    bonus: "CONAN.FIGHTING_STYLES.dualWielder.bonus",
    hindrance: "CONAN.FIGHTING_STYLES.dualWielder.hindrance",
  },
  flexibleFighter: {
    id: "flexibleFighter",
    icon:"fas fa-sword",
    label: "CONAN.FIGHTING_STYLES.flexibleFighter.label",
    weapons: "CONAN.FIGHTING_STYLES.flexibleFighter.weapons",
    bonus: "CONAN.FIGHTING_STYLES.flexibleFighter.bonus",
    hindrance: "CONAN.FIGHTING_STYLES.flexibleFighter.hindrance",
  },
  greatWeaponFighter: {
    id: "greatWeaponFighter",
    icon:"fas fa-hammer-war",
    label: "CONAN.FIGHTING_STYLES.greatWeaponFighter.label",
    weapons: "CONAN.FIGHTING_STYLES.greatWeaponFighter.weapons",
    bonus: "CONAN.FIGHTING_STYLES.greatWeaponFighter.bonus",
    hindrance: "CONAN.FIGHTING_STYLES.greatWeaponFighter.hindrance",
  },
  phalanxFighter: {
    id: "phalanxFighter",
    icon:"fas fa-scythe",
    label: "CONAN.FIGHTING_STYLES.phalanxFighter.label",
    weapons: "CONAN.FIGHTING_STYLES.phalanxFighter.weapons",
    bonus: "CONAN.FIGHTING_STYLES.phalanxFighter.bonus",
    hindrance: "CONAN.FIGHTING_STYLES.phalanxFighter.hindrance",
  },
});

export const RANGES = Object.freeze({
  touch: {
    id: "touch",
    label: "CONAN.RANGES.touch.label",
  },
  close: {
    id: "close",
    label: "CONAN.RANGES.close.label",
  },
  medium: {
    id: "medium",
    label: "CONAN.RANGES.medium.label",
  },
  long: {
    id: "long",
    label: "CONAN.RANGES.long.label",
  },
  distant: {
    id: "distant",
    label: "CONAN.RANGES.distant.label",
  },
});

export const ROLLTYPE = Object.freeze({
  check: "check",
  attackCheck: "attackCheck",
});

export const WEAPON_TYPES = Object.freeze({
  unarmed: {
    id: "unarmed",
    label: "CONAN.WEAPON_TYPES.unarmed.label",
    carac: "might",
  },
  melee: {
    id: "melee",
    label: "CONAN.WEAPON_TYPES.melee.label",
    carac: "might",
  },
  thrown: {
    id: "thrown",
    label: "CONAN.WEAPON_TYPES.thrown.label",
    carac: "edge",
  },
  ranged: {
    id: "ranged",
    label: "CONAN.WEAPON_TYPES.ranged.label",
    carac: "edge",
  },
  sorcery: {
    id: "sorcery",
    label: "CONAN.WEAPON_TYPES.sorcery.label",
    carac: "wits",
  },
});

export const WEAPON_WEIGHTS = Object.freeze({
  unarmed: {
    id: "unarmed",
    label: "CONAN.WEAPON_WEIGHTS.unarmed.label",
  },
  light: {
    id: "light",
    label: "CONAN.WEAPON_WEIGHTS.light.label",
  },
  medium: {
    id: "medium",
    label: "CONAN.WEAPON_WEIGHTS.medium.label",
  },
  heavy: {
    id: "heavy",
    label: "CONAN.WEAPON_WEIGHTS.heavy.label",
  },
});

/**
 * Include all constant definitions within the SYSTEM global export
 * @type {Object}
 */
export const SYSTEM = {
  id: SYSTEM_ID,
  ATTRIBUTES,
  ARMOR_TYPES,
  CLASSIFICATION,
  DICE,
  DISCIPLINES,
  ENNEMIES,
  FIGHTING_STYLES,
  RANGES,
  ROLLTYPE,
  WEAPON_TYPES,
  WEAPON_WEIGHTS,
};
