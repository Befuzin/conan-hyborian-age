import { SYSTEM } from "../../config/system.mjs";

export default class ConanChatMessage extends foundry.documents.ChatMessage {
  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async renderHTML(options = {}) {
    const html = await super.renderHTML(options);
    this._enrichChatCard(html);

    return html;
  }
  /**
   * Add click events for skill points
   * @param {HTMLElement} html  The chat card markup.
   * @protected
   */
  _enrichChatCard(html) {
    html.querySelectorAll(".rollbutton").forEach((el) => el.addEventListener("click", this._onClickRollbutton.bind(this)));
  }

  /* -------------------------------------------- */

  static async buildChatData(rolls) {
    const chatData = { actiontooltip: await rolls[0].getTooltip() };
    chatData.flexRollResult = rolls[1]?.total;
    chatData.flextooltip = await rolls[1]?.getTooltip();
    chatData.flexTrigger = rolls[1]?.options.flexTrigger;

    const actingChar = game.actors.get(rolls[0].options.actorId);

    // Hide npc rolls, else use chat configuration
    let visibilityMode = actingChar.type === "npc" && game.user.isGM ? "gmroll" : game.settings.get("core", "rollMode");

    switch (visibilityMode) {
      case "gmroll":
        chatData.whisper = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
        break;
      case "blindroll":
        chatData.whisper = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
        chatData.blind = true;
        break;
      case "selfroll":
        chatData.whisper = [game.user.id];
        break;
    }

    chatData.rollMode = visibilityMode;

    await foundry.utils.mergeObject(chatData, rolls[0].options, {
      insertKeys: true,
      insertValues: true,
      overwrite: false,
    });

    return chatData;
  }

  /**
   * Roll for damage.
   * @param {PointerEvent} event  The triggering event.
   * @protected
   */
  async _onClickRollbutton(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = event.currentTarget;

    // Only the GM and the actor who has sent the message can roll damage
    // Get the actor who has sent the chat message
    const actorId = target.dataset.actorId;
    const actor = game.actors.get(actorId);
    if (!game.user.isGM) {
      let found = false;
      let userArray = await actor.getOwnerPlayer();
      let userId = game.user._id;
      for (let user of userArray) {
        if (user._id == userId) found = true;
      }
      if (!found) return;
    }

    const isprivate = actor.type === "npc" && game.user.isGM;

    let roll = this.rolls[0];
    const actingChar = game.actors.get(roll.options.actorId);
    const weapon = actingChar.items.get(roll.options.itemId);
    let damageFormula = roll.options.damage;

    damageFormula += target.dataset.field;

    let damageRoll = new Roll(damageFormula);
    await damageRoll.evaluate();
    if (game.dice3d) game.dice3d.showForRoll(damageRoll, game.user, !isprivate);
    this.rolls[0].options.damageResult = damageRoll.total;
    this.rolls[0].options.damageTooltip = await damageRoll.getTooltip();
    const chatData = await ConanChatMessage.buildChatData(this.rolls);
    let newContent = await foundry.applications.handlebars.renderTemplate("systems/conan-hyborian-age/templates/dice/check-roll.hbs", chatData);
    this.update({ content: newContent });
  }
}
