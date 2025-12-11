const { api, sheets } = foundry.applications;
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
import { SYSTEM } from "../../config/system.mjs";

export class PresentationForm extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    classes: [SYSTEM.id, "conan-scrollable"],
    tag: "form",
    form: {
      submitOnChange: false,
      closeOnSubmit: false,
    },
    window: {
      resizable: true,
      icon: "fas fa-book-open-reader",
    },
    position: { width: 900 },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    // Add the item document.
    context.document = this.document;
    context.images = SYSTEM.IMAGES;
    context.languageisfr = game.i18n.lang === "fr";

    return context;
  }
}

export class SystemGuideForm extends PresentationForm {
  static DEFAULT_OPTIONS = {
    position: { height: 700 },
    id: "systemGuide",
    window: {
      resizable: true,
      icon: "fas fa-book-open-reader",
    },
  };

  static PARTS = {
    presentation_fr: {
      template: "systems/conan-hyborian-age/templates/forms/system-guide_fr.hbs",
    },
    presentation_en: {
      template: "systems/conan-hyborian-age/templates/forms/system-guide_en.hbs",
    },
  };

  get title() {
    return game.i18n.localize("CONAN.SETTINGS.systemGuide.name");
  }
}
