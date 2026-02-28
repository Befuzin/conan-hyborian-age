import { SYSTEM } from "../config/system.mjs";
export default class ConanWeapon extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = [
    "CONAN.Source"
  ];
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.damage = new fields.StringField({ required: true, initial: "1d4" });
    schema.description = new fields.HTMLField({ required: true, blank: true });
    schema.range = new fields.StringField({ required: true, choices: SYSTEM.RANGES, initial: "touch" });
    schema.weaponType = new fields.StringField({ required: true, choices: SYSTEM.WEAPON_TYPES, initial: "melee" });
    schema.weaponWeight = new fields.StringField({ required: true, choices: SYSTEM.WEAPON_WEIGHTS, initial: "light" });
    schema.zones = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });

    return schema;
  }
}