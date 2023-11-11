import * as Phaser from "phaser";
import { KEY_NAMES } from "./const";
import LocalizationManager from "./utils/LocalizationManager";
export default class MainMenu extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  playerImg: Phaser.GameObjects.Sprite;
  keyPressed: any;
  localizationManager: LocalizationManager;
  lang: string;
  claimTween: Phaser.Tweens.Tween;
  gameConfig: any;

  constructor() {
    super({
      key: "mainMenu",
    });
  }

  init(): void {
    this.keyPressed = this.sound.add("key_pressed");
    this.lang = this.getLanguage();
  }

  create(): void {
    this.localizationManager = this.localizationManager =
      new LocalizationManager(this);
    this.gameConfig = this.cache.json.get("gameConfig");
    console.log(this.gameConfig);
    this.createBackground();
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

    this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height / 2 - 150,
        this.localizationManager.getTranslationByLocalizationId("TITLE"),
        {
          fontFamily: "retroGaming",
          fontSize: "24px",
          color: "#ffff00",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5);

    let startText = this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height - 100,
        this.localizationManager.getTranslationByLocalizationId(
          "UI_START_MESSAGE"
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
      targets: startText,
      alpha: { from: 0, to: 1 },
      duration: 1000,
      repeat: -1,
      yoyo: true,
    });
  }

  getLanguage(): string {
    let url = new URL(window.location.href);
    let defaultLang = navigator.language ? navigator.language : "en-EN";
    let language = url.searchParams.get("lang")
      ? url.searchParams.get("lang")
      : defaultLang;
    return language;
  }

  startGameScene() {
    if (this.scene.isSleeping("gameScene")) {
      this.scene.wake("gameScene");
    } else {
      this.scene.start("gameScene");
    }
  }
}
