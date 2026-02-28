import { SYSTEM } from "../config/system.mjs";
export default class ConanNpc extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = ["CONAN.Source"];
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    // Attributes
    const attributeField = (label) =>
      new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 }),
        dice: new fields.StringField({ required: true, nullable: true, choices: SYSTEM.DICE, initial: "d6" }),
        label: new fields.StringField({ initial: label }),
      });

    schema.attributes = new fields.SchemaField(
      Object.values(SYSTEM.ATTRIBUTES).reduce((obj, attribute) => {
        obj[attribute.id] = attributeField(attribute.label);
        return obj;
      }, {})
    );

    // Life Points
    schema.life = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 22 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 22 }),
    });

    // Defence
    schema.defence = new fields.SchemaField({
      physical: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 7 }),
      }),
      sorcery: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 7 }),
      }),
    });
    (schema.ar = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
    })),
      (schema.threshold = new fields.NumberField({ ...requiredInteger, initial: 4 }));
    schema.ennemyType = new fields.StringField({ required: true, nullable: false, choices: SYSTEM.ENNEMIES, initial: "minion" });
    schema.classification = new fields.StringField({ required: true, nullable: true, choices: SYSTEM.CLASSIFICATION, initial: "human" });

    schema.armorRating = new fields.SchemaField({
      min: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
    });

    schema.description = new fields.HTMLField({ required: true, blank: true });

    return schema;
  }
}