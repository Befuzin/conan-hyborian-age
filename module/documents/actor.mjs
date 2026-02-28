import CheckRoll from "../applications/rolls/check-roll.mjs";
import ConanChatMessage from "../applications/rolls/chatmessage.mjs";
import { SYSTEM } from "../config/system.mjs";
export default class ConanActor extends Actor {
  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    // Player character configuration
    if (this.type === "player") {
      const prototypeToken = {
        vision: true,
        actorLink: true,
        disposition: 1, // Friendly
      };
      //      this.updateSource({ prototypeToken });
      this.updateSource({
        "prototypeToken.vision": true,
        "prototypeToken.actorLink": true,
        "prototypeToken.disposition": 1, // Friendly
      });
    }
  }
  async _onCreate(data, options, user) {
    // Player character configuration

    return await super._onCreate(data, options, user);
  }

  /** @override */
  async prepareBaseData() {
    await super.prepareBaseData();
  }
  get isUnlocked() {
    if (this.getFlag(game.system.id, "SheetUnlocked")) return true;
    return false;
  }

  get sheetlight() {
    if (this.getFlag(game.system.id, "sheetlight")) return true;
    return false;
  }

  /**
   * Action roll
   * @param {string} skill
   * @param {string} style
   * @returns {Promise<StandardCheck>} - A promise that resolves to the rolled check.
   */
  async rollCheck(options) {
    options.doRoll = true;
    options.actorId = this.id;
    options.actingCharImg = this.img;
    options.actingCharName = this.name;

    //flex die for players, not for Npcs
    options.hasFlex = this.type === "player";

    if (!options.introText) {
      options.introText = game.i18n.format("CONAN.CHATMESSAGE.introActionStd", options);
    }

    let formula = (await this.getAttributeFormula(options.statname)) + "[white]";
    // Create the check roll
    const action_roll = new CheckRoll(formula, {}, options);

    if (options.askDialog) {
      // Prompt the user with a roll dialog
      const promptValue = await action_roll.prompt(options);
      if (!promptValue || Object.keys(promptValue).length === 0) return null;
    }
    const evaluatedRoll = await action_roll.evaluate();
    

    const rolls = [action_roll];
    const flexroll = await this.doFlexroll();
    if (flexroll) rolls.push(flexroll);
    const chatData = await ConanChatMessage.buildChatData(rolls);

    const messageData = {
      user: game.user.id,
      rolls: rolls,
      speaker: {
        actor: chatData.actorId,
      },
      whisper:chatData.whisper,
      rollMode: chatData.rollMode,
      blind : chatData.blind,
    };
    
    messageData.content = await foundry.applications.handlebars.renderTemplate("systems/conan-hyborian-age/templates/dice/check-roll.hbs", chatData);

    return await ConanChatMessage.create(messageData);
  }

  /**
   * Attack roll
   * @param {string} itemId
   * @returns {Promise<rollCheck>} - A promise that resolves to the rolled check.
   */
  async useWeapon(itemId) {
    const item = this.items.get(itemId);

    let damage = await this.getWeaponDamageFormula(itemId);

    const statname = SYSTEM.WEAPON_TYPES[item.system.weaponType].carac;

    const introText = game.i18n.format("CONAN.CHATMESSAGE.introAttack", { weaponName: item.name, actingCharName: this.name });

    const targetData = await this.getTarget();
    let difficulty = 0;
    //console.log("tar=getdata", targetData);
    if (targetData) {
      difficulty = item.system.weaponType === "sorcery" ? targetData.targetSorceryDef : targetData.targetPhysicalDef;
    }

    let data = {
      askDialog: true,
      checkType: SYSTEM.ROLLTYPE.attackCheck,
      damage: damage,
      hasDamage: true,
      introText: introText,
      itemId: itemId,
      statname: statname,
      difficulty: difficulty,
      targetData: targetData,
    };

    return this.rollCheck(data);
  }

  /*Show portrait */

  async showPortrait(options = {}) {
    const htmlTemplate = `<h3>Portrait</h3>`;
    const ImagePopout = foundry.applications.apps.ImagePopout;

    new foundry.applications.api.DialogV2({
      window: { title: "Portrait" },
      content: htmlTemplate,
      buttons: [
        {
          action: "validate",
          label: game.i18n.format("CONAN.DIALOG.portrait", { actorName: this.name }),
          default: true,
          callback: () => {
            const pop = new ImagePopout(this.img, {
              uuid: this.uuid,
              window: { title: this.name }
            });

            pop.render({ force: true });
            if (typeof pop.shareImage === "function") pop.shareImage();
          }
        },
        {
          action: "close",
          label: game.i18n.format("CONAN.DIALOG.cancel")
        }
      ]
    }).render({ force: true });
  }


  /**
   * set to max
   * @param {string} data
   */
  async setToMax(data) {
    const maxValue = this.system[data].max;
    return await this.update({ [`system.${data}.value`]: maxValue });
  }
  /**
   * Reset Stamina to Grit
   * @param {string} data
   */
  async resetStamina() {
    const gritValue = this.system.attributes.grit.value;
    return await this.update({ [`system.stamina.value`]: gritValue });
  }

  /**
   * Builds the attribute roll formula
   * @param {string} attributeName - the name of the stat
   * @returns {string>} - the roll formula.
   */
  async getAttributeFormula(attributeName) {
    return this.system.attributes[attributeName].value.toString() + "+1" + this.system.attributes[attributeName].dice;
  }

  /**
   * Flex roll
   * @returns {roll}
   */
  async doFlexroll() {
    if (this.type !== "player") return null;
    const flexFormula = "1" + this.system.flexDie + "[black]";
    const flexroll = await new Roll(flexFormula);
    await flexroll.evaluate();
    flexroll.options.flexTrigger = (flexroll.total === SYSTEM.DICE[this.system.flexDie].max);
    return flexroll;
  }

  async getWeaponDamageFormula(itemId) {
    const weapon = await this.items.get(itemId);
    let damage = foundry.utils.getProperty(weapon, `system.damage`);
    if (this.type === "player" && ["melee", "thrown"].includes(weapon.system.weaponType)) damage += "+" + this.system.attributes.might.value.toString();
    return damage;
  }
  get isMinion() {
    return this.system?.ennemyType === "minion";
  }

  /*get the target token, its actor
@Params: {}
@returns:  {targetData object}*/
  async getTarget() {
    let targets = Array.from(game.user.targets);
    if (targets.length === 0) return null;
    if (targets.length > 1) {
      ui.notifications.warn("Multi-targeting not supported");
      return null;
    }
    return {
      targetActorId: targets[0].actor.id,
      name: targets[0].name,
      tokenId: targets[0].id,
      targetPhysicalDef: targets[0].actor.system.defence.physical.value,
      targetSorceryDef: targets[0].actor.system.defence.sorcery.value,
      targetTreshold: targets[0].actor.isMinion ? targets[0].actor.system.threshold : 0,
    };
  }
  /**
   * set fighting style
   *
   * @this Actor
   * @param {newStyle} SYSTEM.FIGHTING_STYLES   The new style
   */
  async setFightingStyle(newStyle) {
    await this.setFlag(game.system.id, "FightingStyle", newStyle);
    const options = foundry.utils.duplicate(SYSTEM.FIGHTING_STYLES[newStyle]);
    options.charName = this.name;
    const message = game.i18n.format("CONAN.CHATMESSAGE.introFightingStyle", options);

    ChatMessage.create({ content: message });
  }
  /**
   * get fighting style
   *
   * @this Actor
   * @return  SYSTEM.FIGHTING_STYLE
   */
  async fightingStyle() {
    let flagData = (await this.getFlag(game.system.id, "FightingStyle")) ?? "none";
    return flagData;
  }
}