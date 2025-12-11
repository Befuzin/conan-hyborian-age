export default class ConanArmor extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = [
    "CONAN.Source"
  ];
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.armorRating = new fields.NumberField({ ...requiredInteger, initial: 3, min: 0});
    schema.armorType = new fields.StringField({ required: true, choices: SYSTEM.ARMOR_TYPES, initial: "light" });
    schema.description = new fields.HTMLField({ required: true, blank: true });
    schema.encombrement = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });

    return schema;
  }
}
