import * as Phaser from "phaser";
import { KEY_NAMES } from "./const";
import LocalizationManager from "./utils/LocalizationManager";
import Utils from "./utils/Utils";

export default class GameOverScene extends Phaser.Scene {
  private localizationManager: LocalizationManager;
  private utils: Utils
  private gameOverText: Phaser.GameObjects.Text;
  private tryAgainText: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Image;
  private game_over_sounds: any = {};
  private highScore: number = +localStorage.getItem("score")
    ? +localStorage.getItem("score")
    : 0;
  private lang: string

  constructor() {
    super({ key: "gameOverScene" });
  }

  create(data: any) {
    this.localizationManager = new LocalizationManager(this);
    this.utils = new Utils(this)
    if (Object.keys(this.game_over_sounds).length === 0) {
      this.game_over_sounds.high_score = this.sound.add("high_score");
      this.game_over_sounds.game_over = this.sound.add("game_over");
      this.game_over_sounds.keyPressed = this.sound.add("key_pressed");
    }

    this.lang = this.utils.getCurrentLang()

    this.createBackground();
    this.createGameOverText(data.score);

    this.attachEvents();
  }

  attachEvents(): void {
    this.input.keyboard.on("keydown", (event) => {
      if (event.code === KEY_NAMES.SPACE) {
        this.game_over_sounds.keyPressed.play();
        this.restartGame();
      }
    });
    this.input.keyboard.on("keydown", (event) => {
      if (event.code === KEY_NAMES.ESCAPE) {
        this.game_over_sounds.keyPressed.play();
        this.returnMainMenu();
      }
    })

    this.tryAgainText.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.restartGame();
    });
  }

  createBackground() {
    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

    this.background.setScale(
      this.game.scale.width / this.background.width,
      this.game.scale.height / this.background.height
    );
  }

  createGameOverText(score: number) {
    this.gameOverText = this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height / 2 - 150,
        this.localizationManager.getTranslationByLocalizationId(
          "GAME_OVER_TITLE", this.lang
        ),
        {
          fontFamily: "retroGaming",
          fontSize: this.utils.getFontSize(34),
          color: "#ffff00",
          stroke: "#000000",
          strokeThickness: 6,
        }
      )
      .setOrigin(0.5);

    const scoreText = this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height / 2,
        this.localizationManager.getTranslationByLocalizationId("UI_SCORE", this.lang) +
        score,
        {
          fontFamily: "retroGaming",
          fontSize: "20px",
          color: "#ffff00",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5);
    if (score > this.highScore) {
      localStorage.setItem("score", score.toString());
      const highScoreText = this.add
        .text(
          this.game.scale.width / 2,
          this.game.scale.height / 2 + 50,
          this.localizationManager.getTranslationByLocalizationId(
            "UI_NEW_HIGHSCORE", this.lang
          ) + score,
          {
            fontFamily: "retroGaming",
            fontSize: this.utils.getFontSize(20),
            color: "#ffff00",
            stroke: "#000000",
            strokeThickness: 4,
          }
        )
        .setOrigin(0.5);

      this.game_over_sounds.high_score.play();
    } else {
      const highScore = +localStorage.getItem("score")
        ? +localStorage.getItem("score")
        : this.highScore;
      const highScoreText = this.add
        .text(
          this.game.scale.width / 2,
          this.game.scale.height / 2 + 50,
          this.localizationManager.getTranslationByLocalizationId(
            "UI_HIGHSCORE", this.lang
          ) + highScore,
          {
            fontFamily: "retroGaming",
            fontSize: this.utils.getFontSize(20),
            color: "#ffff00",
            stroke: "#000000",
            strokeThickness: 4,
          }
        )
        .setOrigin(0.5);

      this.game_over_sounds.game_over.play();
    }

    this.tryAgainText = this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height/2 + 200,
        this.localizationManager.getTranslationByLocalizationId("UI_RESTART", this.lang),
        {
          fontFamily: "retroGaming",
          fontSize: "20px",
          color: "#ffff00",
          stroke: "#000000",
          strokeThickness: 4,
          wordWrap: { width: this.game.scale.width },
          align: "center"
        }
      )
      .setOrigin(0.5);

    this.tweens.add({
      targets: this.tryAgainText,
      alpha: { from: 1, to: 0 },
      delay: 500,
      yoyo: true,
      loop: -1,
    });

    this.tryAgainText.setInteractive({ cursor: "pointer" });

    this.add.text(this.scale.width / 2, this.scale.height - 100, this.localizationManager.getTranslationByLocalizationId("UI_RETURN_MAIN_MENU", this.lang),
      {
        fontFamily: "retroGaming",
        fontSize: "14px",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 4,
        wordWrap: { width: this.game.scale.width },
        align: "center"
      }).setOrigin(0.5)
  }

  restartGame(): void {
    this.scene.start("gameScene")
  }

  returnMainMenu(): void {
    this.scene.start("mainMenu")
  }
}
