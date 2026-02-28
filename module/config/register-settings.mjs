import { SYSTEM } from "./system.mjs";
import { SystemGuideForm } from "../applications/forms/systemGuide.mjs";

export async function registerSettings() {
  // Display system guide button
  game.settings.registerMenu(SYSTEM.id, "displaySettings", {
    name: "CONAN.SETTINGS.systemGuide.name",
    hint: "CONAN.SETTINGS.systemGuide.hint",
    label: "CONAN.SETTINGS.systemGuide.label", // <- if you have this key; otherwise keep your existing one
    icon: "fas fa-book-open-reader",
    type: SystemGuideForm,
    restricted: true
  });

  game.settings.register(SYSTEM.id, "advancedRules", {
    name: "CONAN.SETTINGS.advancedrules.name",
    hint: "CONAN.SETTINGS.advancedrules.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => debouncedReload()
  });
}