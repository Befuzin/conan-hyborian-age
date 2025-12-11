import ConanItemSheet from "./item.mjs";
import { SYSTEM } from "../../config/system.mjs";

export default class ArmorSheet extends ConanItemSheet {
  static DEFAULT_OPTIONS = {
      classes: ["armor-sheet"],
    position: {
      height: 600,
      width: 400,
    },
  };
  /**
   * the type of the item
   * @type {string}
   */
  static itemType = "armor";

  static PARTS = {
    header: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/item-header.hbs`,
    },
    body: {
      template: `systems/${SYSTEM.id}/templates/sheets/armor.hbs`,
    },
    description: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/item-description.hbs`,
    },
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.armorTypes = SYSTEM.ARMOR_TYPES;
    return context;
  }
}