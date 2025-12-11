import ConanItemSheet from "./item.mjs";
import { SYSTEM } from "../../config/system.mjs";

export default class WeaponSheet extends ConanItemSheet {
    static DEFAULT_OPTIONS = {
    position: {
      height: 600,
      width: 400,
    },
  };
  /**
   * the type of the item
   * @type {string}
   */
  static itemType = "weapon";
  
    static PARTS = {
      header: {
        template: `systems/${SYSTEM.id}/templates/sheets/partials/item-header.hbs`,
      },
      body: {
        template: `systems/${SYSTEM.id}/templates/sheets/weapon.hbs`,
      },
      description: {
        template: `systems/${SYSTEM.id}/templates/sheets/partials/item-description.hbs`,
      },
    };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.weaponTypes = SYSTEM.WEAPON_TYPES;
    context.weaponWeights = SYSTEM.WEAPON_WEIGHTS;
    context.ranges = SYSTEM.RANGES;
    return context;
  }
}