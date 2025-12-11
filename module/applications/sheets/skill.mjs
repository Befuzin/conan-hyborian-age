import ConanItemSheet from "./item.mjs";
import { SYSTEM } from "../../config/system.mjs";

export default class SkillSheet extends ConanItemSheet {
    static DEFAULT_OPTIONS = {
    position: {
      height: 400,
      width: 400,
    },
  };
  /**
   * the type of the item
   * @type {string}
   */
  static itemType = "skill";
  
    static PARTS = {
      header: {
        template: `systems/${SYSTEM.id}/templates/sheets/partials/item-header.hbs`,
      },
      body: {
        template: `systems/${SYSTEM.id}/templates/sheets/skill.hbs`,
      },
      description: {
        template: `systems/${SYSTEM.id}/templates/sheets/partials/item-description.hbs`,
      },
    };
}