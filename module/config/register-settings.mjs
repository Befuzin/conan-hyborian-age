import { SystemGuideForm } from "../applications/forms/systemGuide.mjs";

export async function registerSettings() {
  //Display system guide Button
  game.settings.registerMenu(`${SYSTEM.id}`, "displaySettings", {
    name: "CONAN.SETTINGS.systemGuide.name",
    label: "CONAN.SETTINGS.systemGuide.hint",
    icon: "fas fa-book-open-reader",
    type: SystemGuideForm,
    restricted: true,
  });

  game.settings.register(`${SYSTEM.id}`, "advancedRules", {
    name: "CONAN.SETTINGS.advancedrules.name",
    hint: "CONAN.SETTINGS.advancedrules.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => debouncedReload(),
  });
}
