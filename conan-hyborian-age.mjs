import { SYSTEM } from "./module/config/system.mjs";
import { registerHandlebarsHelpers } from "./module/helpers.mjs";
import { registerSettings } from './module/config/register-settings.mjs'

globalThis.CONAN ??= {};
globalThis.CONAN.SYSTEM = SYSTEM;

// Import modules
import * as applications from "./module/applications/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as models from "./module/data/_module.mjs";
import * as rolls from "./module/applications/rolls/_module.mjs";

Hooks.once("init", async function () {
  console.log(`conan-hyborian-age - starting system...`);
  game.system.CONST = SYSTEM;

  CONFIG.Actor.documentClass = documents.ConanActor;
  CONFIG.Actor.dataModels = {
    player: models.ConanPlayer,
    npc: models.ConanNpc,
  };
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet(SYSTEM.id, applications.PlayerSheet, { types: ["player"], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet(SYSTEM.id, applications.NpcSheet, { types: ["npc"], makeDefault: true });

  // Configuration document Item
  CONFIG.Item.documentClass = documents.ConanItem;
  CONFIG.Item.dataModels = {
    armor: models.ConanArmor,
    npcability: models.ConanNpcability,
    originBonus: models.ConanOriginBonus,
    skill: models.ConanSkill,
    spell: models.ConanSpell,
    weapon: models.ConanWeapon,
  };

  CONFIG.ChatMessage.documentClass = rolls.ConanChatMessage;

  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet(SYSTEM.id, applications.ArmorSheet, { types: ["armor"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(SYSTEM.id, applications.NpcabilitySheet, { types: ["npcability"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(SYSTEM.id, applications.OriginBonusSheet, { types: ["originBonus"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(SYSTEM.id, applications.SkillSheet, { types: ["skill"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(SYSTEM.id, applications.SpellSheet, { types: ["spell"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(SYSTEM.id, applications.WeaponSheet, { types: ["weapon"], makeDefault: true });

  // Dice system configuration
  CONFIG.Dice.rolls.push(rolls.CheckRoll);

  foundry.applications.handlebars.loadTemplates([
    `systems/${SYSTEM.id}/templates/sheets/partials/player-description.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/item-description.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/item-header.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/player-header.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/player-skills.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/parts/unlock-icon.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/armor.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/skill.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/spell.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/weapon.hbs`,
  ]);

  //Register Settings & Handlebar Helpers
  registerSettings();
  registerHandlebarsHelpers();
  
});

Hooks.once("ready", async function () {
  console.log("conan-hyborian-age - system ready");
});

Hooks.once("i18nInit", function () {
  preLocalizeConfig();
});

function preLocalizeConfig() {
  const localizeConfigObject = (obj, keys) => {
    for (let o of Object.values(obj)) {
      for (let k of keys) {
        o[k] = game.i18n.localize(o[k]);
       // console.log(o[k]);
      }
    }
  };

  localizeConfigObject(SYSTEM.ATTRIBUTES, ["label"]);
  localizeConfigObject(SYSTEM.ARMOR_TYPES, ["label"]);
  localizeConfigObject(SYSTEM.CLASSIFICATION, ["label"]);
  localizeConfigObject(SYSTEM.DICE, ["label"]);
  localizeConfigObject(SYSTEM.DISCIPLINES, ["label"]);
  localizeConfigObject(SYSTEM.ENNEMIES, ["label"]);
  localizeConfigObject(SYSTEM.FIGHTING_STYLES, ["label","weapons","bonus","hindrance"]);
  localizeConfigObject(SYSTEM.RANGES, ["label"]);
  localizeConfigObject(SYSTEM.WEAPON_TYPES, ["label"]);
  localizeConfigObject(SYSTEM.WEAPON_WEIGHTS, ["label"]);
  
}
