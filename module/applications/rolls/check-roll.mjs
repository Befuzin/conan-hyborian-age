import { SYSTEM } from "../../config/system.mjs";
import { CheckDialog } from "../apps/check-dialog.mjs";

/**
 * @typedef {DiceCheckBonuses} StandardCheckData
 * @property {string} actorId                         L'ID de l'acteur a l'origine du jet
 */

/**
 * The standard d20 dice pool check used by the system.
 *
 * @param {string|chatMessageData} formula  This parameter is ignored
 * @param {chatMessageData} [data]          An object of roll data, containing the following optional fields
 */
export default class CheckRoll extends foundry.dice.Roll {
  constructor(formula, data = {}, options = {}) {
    super(formula, data, options);
    foundry.utils.mergeObject(this.options, this.constructor.DEFAULT_OPTIONS, {
      insertKeys: true,
      insertValues: true,
      overwrite: false,
    });
    this.options.formula = this.formula;
  }

  static DEFAULT_OPTIONS = Object.freeze({
    actiontooltip: "",
    actorId: null,
    actingCharImg: null,
    actingCharName: null,
    damageResult: null,
    difficulty: 0,
    doRoll: true,
    hasDamage: false,
    introText: "",
    itemId: null,
    finalText: "",
    flexRoll: null,
    flextooltip: "",
    flexTrigger: false,
    hasFlex: true,
    lasttextsuccess: null,
    lasttext: "",
    modifier: 0,
    resultMargin: 0,
    resultOne: false,
    rollType: SYSTEM.ROLLTYPE.check,
    rollModes: CONFIG.Dice.rollModes,
    showlasttext: false,
    success: false,
    weaponName: "",
  });

  static CHAT_TEMPLATE = "systems/conan-hyborian-age/templates/dice/check-roll.hbs";

  async evaluate() {
    const actingChar = game.actors.get(this.options.actorId);

    if (!this.options.introText.length) {
      this.options.introText = game.i18n.format("CONAN.CHATMESSAGE.introActionStd", this.options);
    }
    let evaluation = await super.evaluate();
    // test if automatic failure on 1
    if (this.terms[2].results[0].result === 1) {
      this.resultOne = true;
      this.options.finalText = game.i18n.localize("CONAN.CHATMESSAGE.failure_one");
    } else if (this._total + this.options.modifier < this.options.difficulty) this.options.finalText = game.i18n.localize("CONAN.CHATMESSAGE.failure");
    else this.options.finalText = game.i18n.localize("CONAN.CHATMESSAGE.success");

    if (this.options.rollType === SYSTEM.ROLLTYPE.attackCheck) {
      //damage
    }
    this.options.rolleddice = this.total + this.options.modifier;
    this.options.resultMargin = this._total + this.options.modifier - this.options.difficulty;

    return this;
  }

  /**
   * Prompt the user with a roll configuration dialog
   * @param {Partial<PowerRollPromptOptions>} [options] Options for the dialog
   * @return {Promise<PowerRollPrompt>} Based on evaluation made can either return an array of power rolls or chat messages
   */
  async prompt(options = {}) {
    const title = context.title ?? game.i18n.format("CONAN.DIALOG.promptTitle");

    const promptValue = await CheckDialog.prompt({
      context: this.options,
      window: {
        title: title,
      },
    });
    if (!promptValue || Object.keys(promptValue).length === 0) return null;
    foundry.utils.mergeObject(this.options, promptValue, {
      insertKeys: true,
      insertValues: true,
      overwrite: true,
    });
    const actingChar = game.actors.get(this.options.actorId);
    this.options.formula = actingChar.getAttributeFormula(promptValue.statname) + "[white]";

    return this;
  }
}
