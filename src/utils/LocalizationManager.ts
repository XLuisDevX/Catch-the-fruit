export default class LocalizationManager {
  private langJSON: any;
  private lang: string;
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.langJSON = this.scene.cache.json.get("lang");
  }

  public getTranslationByLocalizationId(
    word_key: string,
    lang: string
  ): string {
    for (let key in this.langJSON) {
      if (key === lang && this.langJSON[key][word_key]) {
        return this.langJSON[key][word_key];
      }
    }
    return "UNDEFINED_KEY";
  }
}
