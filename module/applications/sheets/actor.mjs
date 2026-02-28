import { SYSTEM } from "../../config/system.mjs";
const { api, sheets } = foundry.applications;

export default class ConanActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: [SYSTEM.id, "sheet", "actor", "actor-sheet", "conan-scrollable"],

    actions: {
      toggleLockMode: this._toggleLockMode,
      newItem: this._newItem,
      editHTML: this._editHTML,
    },
    form: {
      submitOnChange: true,
    },

    tag: "form", // The default is "div"
    window: {
      resizable: true,
      icon: "fas fa-person", // You can now add an icon to the header
    },
  };
  get title() {
    return `${game.i18n.localize("TYPES.Actor." + this.actor.type)}`;
  }
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.editable = true;
    context.document = this.document;
    context.actor = this.actor;
    context.system = this.document.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.attributes = this._getAttributes();

    // Enrich actor fields asynchronously to support @UUID links, inline rolls, etc.
    const TE = foundry.applications.ux.TextEditor.implementation;
    const rollData = this.actor.getRollData?.() ?? {};
    context.descriptionHTML = await TE.enrichHTML(this.actor.system.description ?? "", {
      secrets: this.actor.isOwner,
      rollData,
      relativeTo: this.actor,
    });
    context.equipementHTML = await TE.enrichHTML(this.actor.system.equipement ?? "", {
      secrets: this.actor.isOwner,
      rollData,
      relativeTo: this.actor,
    });
    context.unlocked = this.actor.isUnlocked;
    context.locked = !this.actor.isUnlocked;
    return context;
  }

  /**
   * Constructs a record of the attributes and their associated field
   * @returns {Record<string, {valueField: NumberField, value: number,diceField: StringField, dice: String}>}
   * @protected
   */
  _getAttributes() {
    const data = this.actor;
    return Object.keys(SYSTEM.ATTRIBUTES).reduce((obj, chc) => {
      const value = foundry.utils.getProperty(data, `system.attributes.${chc}.value`);
      const dice = foundry.utils.getProperty(data, `system.attributes.${chc}.dice`);
      obj[chc] = {
        label: game.i18n.localize(foundry.utils.getProperty(data, `system.attributes.${chc}.label`)),
        valueField: this.actor.system.schema.getField(["attributes", chc, "value"]),
        value: foundry.utils.getProperty(data, `system.attributes.${chc}.value`),
        diceField: this.actor.system.schema.getField(["attributes", chc, "dice"]),
        dice: foundry.utils.getProperty(data, `system.attributes.${chc}.dice`),
        dicelabel: game.i18n.localize("CONAN.DICE."+foundry.utils.getProperty(data, `system.attributes.${chc}.dice`)+".label"),
      };
      return obj;
    }, {});
  }

  /* -------------------------------------------------- */
  /*   Actions                                          */
  /* -------------------------------------------------- */

  /**
   * Toggle Lock vs. Unlock sheet
   *
   * @this ActorSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   */
  static async _toggleLockMode(event, target) {
    let flagData = await this.actor.getFlag(game.system.id, "SheetUnlocked");
    if (flagData) await this.actor.unsetFlag(game.system.id, "SheetUnlocked");
    else await this.actor.setFlag(game.system.id, "SheetUnlocked", "SheetUnlocked");
    this.render();
  }

  /**
   * Create a new embedded item
   *
   * @this ActorSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   */
  static async _newItem(event, target) {
    const itemType = target.dataset.field;
    const items = [{
      name: game.i18n.localize("CONAN.NEW." + itemType),
      type:itemType
    }];
    let controlDoc = await this.actor.createEmbeddedDocuments("Item", items);
    this.render();
  }

  /**
   * Actions performed after a first render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param {ApplicationRenderContext} context      Prepared context data
   * @param {RenderOptions} options                 Provided render options
   * @protected
   */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    this._createContextMenus();
  }

  /* right-click context menus */
  _createContextMenus() {
    /** @fires {hookEvents:_getItemEntryContextOptions} */
    this._createContextMenu(this._getItemEntryContextOptions, ".item-contextmenu", {
      fixed: true,
      hookName: "ItemEntryContext",
      parentClassHooks: false,
    });
    this._createContextMenu(this._getStdContextOptions, ".std-contextmenu", {
      fixed: true,
      hookName: "StdContext",
      parentClassHooks: false,
    });
  }

  /* Context menu standard*/
  _getStdContextOptions() {
    return [
      {
        name: game.i18n.localize("CONAN.CONTEXT.showPortrait"),
        icon: `<i class="fa-regular fa-image-portrait"></i>`,
        condition: (li) => {
          return li.dataset.group === "portrait";
        },
        callback: (li) => {
          return this.actor.showPortrait();
        },
      },
      {
        name: game.i18n.localize("CONAN.CONTEXT.stdCheck"),
        icon: `<i class="fa-solid fa-dice-d8"></i>`,
        condition: (li) => {
          return ["stats"].includes(li.dataset.group);
        },
        callback: async (li) => {
          const statname = li.dataset.statname;
          const statlabel = SYSTEM.ATTRIBUTES[statname].label;
          const introText = game.i18n.format("CONAN.CHATMESSAGE.introStdCheck", { actingCharName: this.actor.name, statlabel: statlabel });
          let data = {
            checkType: SYSTEM.ROLLTYPE.check,
            statname: statname,
            askDialog: true,
            introText: introText,
          };
          return this.actor.rollCheck(data);
        },
      },
      {
        name: game.i18n.localize("CONAN.CONTEXT.setToMax"),
        icon: `<i class="fa-solid fa-gauge-max"></i>`,
        condition: (li) => {
          return ["life"].includes(li.dataset.group);
        },
        callback: async (li) => {
          const group = li.dataset.group;
          return this.actor.setToMax(group);
        },
      },
      {
        name: game.i18n.localize("CONAN.CONTEXT.resetStamina"),
        icon: `<i class="fa-solid fa-gauge-max"></i>`,
        condition: (li) => {
          return ["stamina"].includes(li.dataset.group);
        },
        callback: async (li) => {
          return this.actor.resetStamina();
        },
      },
    ];
  }
  /**
   * context options for embedded items
   * @returns {object[]}
   * @private
   */
  _getItemEntryContextOptions() {
    return [
      {
        name: game.i18n.localize("CONAN.CONTEXT.attackCheck"),
        icon: `<i class="fa-regular fa-sword"></i>`,
        condition: (li) => {
          const itemId = li.dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return item.type === "weapon";
        },
        callback: (li) => {
          const itemId = li.dataset.itemId;
          this.actor.useWeapon(itemId);
        },
      },
      {
        name: game.i18n.localize("CONAN.CONTEXT.open"),
        icon: `<i class="fa-regular fa-cogs"></i>`,
        condition: true,
        callback: (li) => {
          const itemId = li.dataset.itemId;
          this._openItem(itemId);
        },
      },
      {
        name: game.i18n.localize("CONAN.CONTEXT.delete"),
        icon: `<i class="fa-solid fa-trash"></i>`,
        condition: true,
        callback: (li) => {
          const itemId = li.dataset.itemId;
          this._deleteItem(itemId);
        },
      },
    ];
  }

  /**
   * Embedded Items handlers
   * @param {itemId} itemId - The ID of the item
   */
  _openItem(itemId) {
    const item = this.actor.items.get(itemId);
    if (item) item.sheet.render(true);
  }

  async _deleteItem(itemId) {
    let item = this.actor.items.get(itemId);
    if (item === null) {
      return;
    }
    let flagData = await this.actor.getFlag(game.system.id, itemId);
    if (flagData) await this.actor.unsetFlag(game.system.id, itemId);
    await this.actor.deleteEmbeddedDocuments("Item", [item.id], { render: true });
  }
}
