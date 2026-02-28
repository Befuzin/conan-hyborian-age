import { SYSTEM } from "../config/system.mjs";
export default class ConanSpell extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = [
    "CONAN.Source"
  ];
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.description = new fields.HTMLField({ required: true, blank: true });
    schema.staminaCost = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.lifeCost = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.discipline = new fields.StringField({ required: true, nullable: true, choices: SYSTEM.DISCIPLINES, initial: "alchemy" });
    schema.xpCost = new fields.NumberField({ ...requiredInteger, initial: 1 });

    return schema;
  }
}