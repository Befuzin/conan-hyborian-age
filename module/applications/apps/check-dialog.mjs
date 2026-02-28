import { SYSTEM } from "../../config/system.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class CheckDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["conan", "check-dialog"],
    position: {
      width: 280,
      height: 345,
    },
    tag: "form",
    window: {
      icon: "fa-solid fa-dice-d20",
      resizable: true,
    },
    form: {
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false,
      handler: this.#onSubmit,
    },
  };

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: `systems/${SYSTEM.id}/templates/dice/check-dialog.hbs`,
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    },
  };

  /**
   * Actions performed after any render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param {ApplicationRenderContext} context      Prepared context data
   * @param {RenderOptions} options                 Provided render options
   * @protected
   */
  _onRender(context, options) {
    const fieldChange = this.element.querySelectorAll('select[class="changefield"]');
    for (const select of fieldChange) {
      select.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (e.currentTarget.value.length && e.currentTarget.value !== this.options.context.statname) {
          this.options.context.statname = e.currentTarget.value;
        }
        this.render();
      });
    }

    const modifierChange = this.element.querySelectorAll(".modifierChange");
    for (const input of modifierChange) {
      input.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const newValue = e.currentTarget.value;
        const n = Number.parseInt(newValue, 10);
        this.options.context.modifier = Number.isFinite(n) ? n : 0;
        this.render();
      });
    }
    const difficultyChange = this.element.querySelectorAll(".difficultyChange");
    for (const input of difficultyChange) {
      input.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const newValue = e.currentTarget.value;
        const n = Number.parseInt(newValue, 10);
        this.options.context.difficulty = Number.isFinite(n) ? n : 0;
        this.render();
      });
    }
    const damageChange = this.element.querySelectorAll(".damageChange");
    for (const input of damageChange) {
      input.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const newValue = e.currentTarget.value;
        this.options.context.damage = newValue;
        this.render();
      });
    }
  }
  /**
   * The final prompt value to return to the requester
   * @type {Array<object>}
   */
  promptValue = {};

  /** @inheritdoc */
  _initializeApplicationOptions(options) {
    options.context ??= {};
    //options.context.rollMode = game.settings.get("core", "rollMode");
    return super._initializeApplicationOptions(options);
  }

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = this.options.context;
    //const context = options;
    foundry.utils.mergeObject(context, this.promptValue, {
      insertKeys: true,
      insertValues: true,
      overwrite: true,
    });
    context.attributes = SYSTEM.ATTRIBUTES;
    const actingChar = game.actors.get(context.actorId);
    
    context.rollMode = this.options.rollMode || game.settings.get("core", "rollMode");

    context.buttons = [{ type: "submit", cssClass: "dialog-button", icon: "fa-solid fa-dice-d10", label: "CONAN.DIALOG.throw" }];
    return context;
  }

  /**
   * Handle submitting the dialog.
   */
  static #onSubmit(formConfig, event) {
    foundry.utils.mergeObject(this.promptValue, this.options.context);
    //super.onSubmit(formConfig, event);
  }
  /* -------------------------------------------- */

  /**
   * Spawn a CheckDialog and wait for it to be rolled or closed.
   * @param {Partial<ApplicationConfiguration>} [options]
   * @returns {Promise<PowerRollDialogPrompt | null>}      Resolves to the final context to use for one or more power rolls.
   *                                                       If the dialog was closed without rolling, it resolves to null.
   */
  static async prompt(options) {
    return new Promise((resolve, reject) => {
      const dialog = new this(options);
      dialog.addEventListener(
        "close",
        (event) => {
          if (Object.keys(dialog.promptValue).length !== 0) resolve(dialog.promptValue);
          else resolve(null);
        },
        { once: true }
      );

      dialog.render({ force: true });
    });
  }
}
