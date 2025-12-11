import ConanItemSheet from "./item.mjs";
import { SYSTEM } from "../../config/system.mjs";

export default class NpcabilitySheet extends ConanItemSheet {
  static DEFAULT_OPTIONS = {
    classes: ["npcability-sheet"],
    position: {
      height: 300,
      width: 400,
    },
  };
  /**
   * the type of the item
   * @type {string}
   */
  static itemType = "npcability";

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
