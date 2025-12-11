export default class ConanItem extends Item {

    get isUnlocked() {
      if (this.getFlag(game.system.id, "SheetUnlocked")) return true;
      return false;
    }
}