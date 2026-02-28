import ConanActorSheet from "./actor.mjs";
const { api, sheets } = foundry.applications;
import { SYSTEM } from "../../config/system.mjs";

/**
 * Represents a character sheet for a Non Player Character.
 * Extends the conan-hyborian-ageActorSheet class.
 */
 export default class NpcSheet extends ConanActorSheet {
  static DEFAULT_OPTIONS = {
    classes: ["npc-sheet"],
    position: {
      width: 460,
      height: 500,
    },
    window: {
      title: "npcSheet.form.title",
    },
  };
  static PARTS = {
    header: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/npc-header.hbs`,
    },
    skills: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/npc-skills.hbs`,
    },
    description: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/player-description.hbs`,
    },
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.npcabilities = this.actor.items.filter((item) => item.type == "npcability");
    context.spells = this.actor.items.filter((item) => item.type == "spell");
    context.weapons = this.actor.items.filter((item) => item.type == "weapon");

    // Render-only values (do not mutate system data)
    const TE = foundry.applications.ux.TextEditor.implementation;
    context.enrichedItemDescriptions = {};

    const enrich = async (doc) => {
      const id = doc?._id ?? doc?.id;
      if (!id) return;
      const raw = doc.system?.description ?? "";
      context.enrichedItemDescriptions[id] = await TE.enrichHTML(raw, {
        secrets: this.actor.isOwner,
        rollData: this.actor.getRollData?.() ?? {},
        relativeTo: this.actor,
      });
    };

    for (const element of context.npcabilities) await enrich(element);
    for (const element of context.spells) await enrich(element);
    for (const element of context.weapons) await enrich(element);
    context.tabs = this._getTabs(["skills", "description"]);
    return context;
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
    if (["armor", "originBonus", "skill"].includes(item.type)) return false
    else return super._onDropItem(event, data)
  }
}
