import ConanItemSheet from "./item.mjs";
import { SYSTEM } from "../../config/system.mjs";

export default class OriginBonusSheet extends ConanItemSheet {
  static DEFAULT_OPTIONS = {
      classes: ["originBonus-sheet"],
    position: {
      height: 600,
      width: 400,
    },
  };
  /**
   * the type of the item
   * @type {string}
   */
  static itemType = "originBonus";

  static PARTS = {
    header: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/item-header.hbs`,
    },
    description: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/item-description.hbs`,
    },
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return context;
  }
}