export default class ConanSkill extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = [
    "CONAN.Source"
  ];
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.xpCost = new fields.NumberField({ ...requiredInteger, initial: 1 });
    schema.description = new fields.HTMLField({ required: true, blank: true });

    return schema;
  }
}