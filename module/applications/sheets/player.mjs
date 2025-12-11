import ConanActorSheet from "./actor.mjs";
const { api, sheets } = foundry.applications;
import { SYSTEM } from "../../config/system.mjs";

/**
 * Represents a character sheet for a player character (PJ).
 * Extends the conan-hyborian-ageActorSheet class.
 */
export default class PlayerSheet extends ConanActorSheet {
  static DEFAULT_OPTIONS = {
    classes: ["player-sheet"],
    position: {
      width: 704,
      height: 900,
    },
    window: {
      title: "PjSheet.form.title",
    },
    actions: {
      changeFightingStyle: this._changeFightingStyle,
    },
  };
  static PARTS = {
    header: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/player-header.hbs`,
    },
    skills: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/player-skills.hbs`,
    },
    description: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/player-description.hbs`,
    },
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.armors = this.actor.items.filter((item) => item.type == "armor");
    context.skills = this.actor.items.filter((item) => item.type == "skill");
    context.originBonuses = this.actor.items.filter((item) => item.type == "originBonus");
    context.spells = this.actor.items.filter((item) => item.type == "spell");
    context.weapons = this.actor.items.filter((item) => item.type == "weapon");
    context.originBonus = context.originBonuses[0]?.name;

    for (let element of context.armors) {
      element.system.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(element.system.description, { async: false });
    }
    for (let element of context.spells) {
      element.system.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(element.system.description, { async: false });
    }
    for (let element of context.skills) {
      element.system.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(element.system.description, { async: false });
    }
    for (let element of context.originBonuses) {
      element.system.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(element.system.description, { async: false });
    }
    for (let element of context.weapons) {
      element.system.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(element.system.description, { async: false });
      element.system.damageFormula = await this.actor.getWeaponDamageFormula(element._id);
    }
    context.tabs = this._getTabs(["skills", "description"]);

    context.advancedRules = game.settings.get(`${SYSTEM.id}`, "advancedRules");
    if (context.advancedRules) context.fightingStyles = await this.#formatFightingStyles();
    return context;
  }

  /**
   * Format fighting styles
   * @param {object}
   * @return {object[]}
   */
  async #formatFightingStyles() {
    const fightingStyles = await foundry.utils.deepClone(SYSTEM.FIGHTING_STYLES);
    let fightingStyle = await this.actor.fightingStyle();
    fightingStyles[fightingStyle].isActive = true;
    return fightingStyles;
  }

  /**
   * Generates the data for the generic tab navigation template
   * @param {string[]} parts An array of named template parts to render
   * @returns {Record<string, Partial<ApplicationTab>>}
   * @protected
   */
  _getTabs(parts) {
    // If you have sub-tabs this is necessary to change
    const tabGroup = "primary";
    // Default tab for first time it's rendered this session
    if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = "skills";
    return parts.reduce((tabs, partId) => {
      const tab = {
        cssClass: "tablist",
        group: tabGroup,
        // Matches tab property to
        id: "",
        // FontAwesome Icon, if you so choose
        icon: "",
        // Run through localization
        tooltip: "CONAN.LABEL.",
        active: false,
      };
      switch (partId) {
        case "header":
        case "tabs":
          return tabs;
        case "skills":
          tab.id = "skills";
          tab.tooltip += "skills";
          tab.icon = "fa-solid fa-chart-simple";
          break;
        case "description":
          tab.id = "description";
          tab.tooltip += "description";
          tab.icon = "fa-regular fa-clipboard";
          break;
      }
      if (this.tabGroups[tabGroup] === tab.id) {
        tab.cssClass += " active";
        tab.active = true;
      }
      tabs[partId] = tab;
      return tabs;
    }, {});
  }

  /** @override */
  async _preparePartContext(partId, context, options) {
    await super._preparePartContext(partId, context, options);
    switch (partId) {
      case "skills":
        context.tab = context.tabs[partId];
        break;
      case "description":
        context.tab = context.tabs[partId];
        break;
    }
    return context;
  }

  /** @override */
  async _onDropItem(event, data) {
    if (!this.actor.isUnlocked) return false;
    const item = await fromUuid(data.uuid);
    // Forbidden item types for the actor type
    if (["npcability"].includes(item.type)) return false;
    // Only 1 Origin bonus allowed
    if (["originBonus"].includes(item.type)) {
      if (this.actor.items.filter((item) => item.type == "originBonus").length) {
        ui.notifications.error("Character already have an origin bonus. Delete it first.");
        return false;
      }
    }
    return super._onDropItem(event, data);
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
  static async _changeFightingStyle(event, target) {
    this.actor.setFightingStyle(target.dataset.field);
    this.render();
  }
}
