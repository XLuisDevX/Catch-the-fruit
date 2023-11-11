export default class LocalizationManager {
  private langJSON: any;
  private lang: string;
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.langJSON = this.scene.cache.json.get("lang");
    this.lang = this.getLanguage();
  }

  private getLanguage(): string {
    let language = this.scene.cache.json.get('gameConfig').currentLanguage
    return language;
  }

  public getTranslationByLocalizationId(
    word_key: string
  ): string {
    for (let key in this.langJSON) {
      if (key === this.lang && this.langJSON[key][word_key]) {
        return this.langJSON[key][word_key];
      }
    }
    return "UNDEFINED_KEY";
  }
}
