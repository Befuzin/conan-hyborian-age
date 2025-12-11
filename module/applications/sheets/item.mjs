import { SYSTEM } from "../../config/system.mjs";
const { api, sheets } = foundry.applications;

export default class ConanItemSheet extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["conan-scrollable", "item-background", "item-sheet"],
    actions: {
      toggleLockMode: this._toggleLockMode,
      editHTML: this._editHTML,
    },
    form: {
      submitOnChange: true,
    },
    position: {
      width: 400,
      height: 500,
    },
    tag: "form",
    window: {
      resizable: true,
      icon: "fas fa-gear",
    },
  };
  get title() {
    return `${game.i18n.localize("TYPES.Item." + this.item.type)}`;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    // Add the item document.
    context.document = this.document;
    context.item = this.item;
    context.system = this.item.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.unlocked = this.item.isUnlocked;
    context.locked = !this.item.isUnlocked;
    context.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description, { async: false });
    return context;
  }
  /* -------------------------------------------------- */
  /*   Actions                                          */
  /* -------------------------------------------------- */

  /**
   * Toggle Lock vs. Unlock sheet
   *
   * @this ItemSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   */
  static async _toggleLockMode(event, target) {
    let flagData = await this.item.getFlag(game.system.id, "SheetUnlocked");
    if (flagData) await this.item.unsetFlag(game.system.id, "SheetUnlocked");
    else await this.item.setFlag(game.system.id, "SheetUnlocked", "SheetUnlocked");
    this.render();
  }
}
