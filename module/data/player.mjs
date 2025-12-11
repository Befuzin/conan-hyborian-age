export default class ConanPlayer extends foundry.abstract.TypeDataModel {  /** @override */
  static LOCALIZATION_PREFIXES = [
    "CONAN.Source"
  ];
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    // Attributes
    const attributeField = (label) =>
      new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 }),
        dice: new fields.StringField({ required: true, nullable: false, choices: SYSTEM.DICE, initial: "d6" }),
        label: new fields.StringField({ initial: label }),
      });

    schema.attributes = new fields.SchemaField(
      Object.values(SYSTEM.ATTRIBUTES).reduce((obj, attribute) => {
        obj[attribute.id] = attributeField(attribute.label);
        return obj;
      }, {})
    );

    // XP
    schema.xp = new fields.SchemaField({
      current: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      total: new fields.NumberField({ ...requiredInteger, initial: 0 }),
    });

    // Life Points
    schema.life = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 22 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 22 }),
    });

    // Stamina
    schema.stamina = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 4 }),
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

    //Flex die
    schema.flexDie = new fields.StringField({ required: true, nullable: true, choices: SYSTEM.DICE, initial: "d10" }),

    schema.description = new fields.HTMLField({ required: true, blank: true });

    return schema;
  }
}
