import * as Phaser from "phaser";
import { KEY_NAMES } from "./const";
import LocalizationManager from "./utils/LocalizationManager";
import Utils from "./utils/Utils";

export default class MainMenu extends Phaser.Scene {
  utils: Utils
  background: Phaser.GameObjects.Image;
  playerImg: Phaser.GameObjects.Sprite;
  keyPressed: any;
  localizationManager: LocalizationManager;
  lang: string;
  claimTween: Phaser.Tweens.Tween;
  gameConfig: any;
  langFlag: Phaser.GameObjects.Image
  gameTitle: Phaser.GameObjects.Text
  startText: Phaser.GameObjects.Text


  constructor() {
    super({
      key: "mainMenu",
    });
  }

  init(): void {
    this.keyPressed = this.sound.add("key_pressed");
  }

  create(): void {
    this.utils = new Utils(this)
    this.localizationManager = this.localizationManager =
      new LocalizationManager(this);
    this.gameConfig = this.cache.json.get("gameConfig");
    this.lang = this.utils.getCurrentLang()
    this.createBackground();
    this.createLangFlag();
    this.createTexts();
    this.attachEvents();
  }

  attachEvents() {
    this.input.keyboard.on("keydown", (eventData) => {
      if (eventData.code === KEY_NAMES.SPACE) {
        this.keyPressed.play();
        this.tweens.remove(this.claimTween);
        this.startGameScene();
      }
    });
  }

  createBackground() {
    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

    this.background.setScale(
      this.game.scale.width / this.background.width,
      this.game.scale.height / this.background.height
    );
  }

  createTexts() {
    const gameVersion = "v" + this.cache.json
      .get("gameConfig")
      .gameVersion.toString();
    this.add.text(
      this.game.scale.width - 20,
      this.game.scale.height - 15,
      gameVersion,
      {
        fontFamily: "retroGaming",
        fontSize: "12px",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 4,
        align:"right"
      }
    ).setOrigin(1,0.5);

    this.gameTitle =  this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height / 2 - 150,
        this.localizationManager.getTranslationByLocalizationId("TITLE", this.lang),
        {
          fontFamily: "retroGaming",
          fontSize: "24px",
          color: "#ffff00",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5);

    this.startText = this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height / 2 + 100,
        this.localizationManager.getTranslationByLocalizationId(
          "UI_START_MESSAGE",
          this.lang
        ),
        {
          fontFamily: "retroGaming",
          fontSize: "18px",
          color: "#ffff00",
          stroke: "#000000",
          strokeThickness: 4,
          wordWrap: { width: this.game.scale.width },
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.claimTween = this.tweens.add({
      targets: this.startText,
      alpha: { from: 0, to: 1 },
      duration: 1000,
      repeat: -1,
      yoyo: true,
    });
  }

  createLangFlag() {
    this.langFlag = this.add.image(35, this.game.scale.height - 15, this.getCurrentLangFlag()).setOrigin(0.5)
    this.langFlag.setInteractive({cursor: 'pointer'})
    this.langFlag.on('pointerdown', () => {
      this.utils.updateGameLang(this.lang)
      this.updateGameTexts()
      this.updateFlagTexture()
    })
  }

  getCurrentLangFlag(): string {
    if(this.cache.json.get('gameConfig').currentLang === 'es-ES') {
      return 'spain'
    } else if (this.cache.json.get('gameConfig').currentLang === 'en-EN') {
      return 'england'
    }
    return ''
  }

  getLanguage(): string {
    return this.cache.json.get('gameConfig').currentLang;
  }

  startGameScene() {
    if (this.scene.isSleeping("gameScene")) {
      this.scene.wake("gameScene");
    } else {
      this.scene.start("gameScene");
    }
  }

  updateFlagTexture(){
    this.langFlag.setTexture(this.getCurrentLangFlag())
  }

  updateGameTexts() {
    this.utils.updateGameLang(this.lang)
    this.lang = this.cache.json.get('gameConfig').currentLang
    this.gameTitle.setText(this.localizationManager.getTranslationByLocalizationId('TITLE', this.lang))
    this.startText.setText(this.localizationManager.getTranslationByLocalizationId('UI_START_MESSAGE', this.lang))
  }
}
