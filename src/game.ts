import * as Phaser from "phaser";
import { KEY_NAMES } from "./const";
import LocalizationManager from "./utils/LocalizationManager";
import Utils from "./utils/Utils";
export default class Game extends Phaser.Scene {
  private localizationManager: LocalizationManager;
  private utils: Utils
  private background: Phaser.GameObjects.Image;
  private player: any;
  private fruitSpawner: Phaser.Time.TimerEvent;
  public fruitsRandomPositions: Array<number> = []
  private fruits: any[];
  private scoreText: Phaser.GameObjects.Text;
  private tutorialText: Phaser.GameObjects.Text;
  private score: number = 0;
  private scoreTextMarginX: number;
  private scoreTextMarginY: number;
  private isGameOver: boolean;
  private objVelocity: number;
  private parent: any;
  private sizer: any;
  private game_sounds: any = {};
  private isNewGame: boolean = true;
  private lang: string

  private SPAWN_TIME: number = 3000;
  private SPAWN_MARGIN_LEFT: number
  private SPAWN_MARGIN_RIGHT: number

  constructor() {
    super({ key: "gameScene" });
  }

  preload() {}

  init() {
    this.score = 0;
    this.scoreTextMarginX = 15;
    this.scoreTextMarginY = 15;
    this.fruits = [];
    this.isGameOver = false;
    this.objVelocity = 100;
    this.parent = new Phaser.Structs.Size(
      this.scale.gameSize.width,
      this.scale.gameSize.height
    );
    this.sizer = new Phaser.Structs.Size(
      300,
      590,
      Phaser.Structs.Size.FIT,
      this.parent
    );
    this.SPAWN_TIME = 3000;
  }

  create() {
    this.sound.pauseOnBlur = true;
    this.localizationManager = new LocalizationManager(
      this
    );
    this.utils = new Utils(this)
    this.SPAWN_MARGIN_LEFT = 50
    this.SPAWN_MARGIN_RIGHT = this.scale.gameSize.width - 50
    this.lang = this.utils.getCurrentLang()
    this.fruitsRandomPositions = this.utils.generateRandomPositions(this.SPAWN_MARGIN_LEFT, this.SPAWN_MARGIN_RIGHT)
    this.createGraphics();
    this.attachEvents();
    this.showTutorial();

    this.parent.setSize(this.scale.gameSize.width, this.scale.gameSize.height);
    this.sizer.setSize(this.scale.gameSize.width, this.scale.gameSize.height);

    if (Object.keys(this.game_sounds).length === 0) {
      this.game_sounds.background_music = this.sound.add("background", {
        volume: 0.5,
        loop: true,
      });
      this.game_sounds.collect = this.sound.add("collect");
      this.game_sounds.game_over = this.sound.add("game_over");
    }

    if (this.game_sounds.background_music)
      this.game_sounds.background_music.play();

    this.fruitSpawner = this.time.addEvent({
      delay: this.SPAWN_TIME,
      callback: () => {
        this.spawnFruits();
      },
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        if (this.SPAWN_TIME >= 1000 && !this.isNewGame)
          this.SPAWN_TIME -= this.score * 0.2;
        this.objVelocity += 50 * 0.25;
      },
      loop: true,
    });
  }

  attachEvents() {
    this.physics.add.collider(this.player, this.fruits, (obj1, obj2) => {
      //@ts-ignore
      if (obj2.body.position.y < obj1.body.position.y - obj1.body.height / 2)
        this.resetPhysicsOnCollision(obj1, obj2);
    });

    this.input.keyboard.on("keydown", (eventData) => {
      if (
        eventData.code === KEY_NAMES.ARROW_LEFT ||
        eventData.code === KEY_NAMES.ARROW_RIGHT
      ) {
        this.hideTutorial();
      }
    });
  }

  showTutorial() {
    if (this.isNewGame) {
      this.tutorialText = this.add
        .text(
          this.game.scale.width / 2,
          this.game.scale.height / 2,
          this.localizationManager.getTranslationByLocalizationId(
            "UI_TUTORIAL", this.lang
          ),
          {
            fontFamily: "retroGaming",
            fontSize: this.utils.getFontSize(18),
            color: "#ffff00",
            stroke: "#000000",
            strokeThickness: 4,
            wordWrap: { width: this.game.scale.width - 25 },
            align: "center",
          }
        )
        .setOrigin(0.5);
    }
  }

  hideTutorial() {
    this.isNewGame = false;
    this.tutorialText.setVisible(false);
  }

  spawnFruits() {
    if (!this.isNewGame) {
      let rndFruit = Phaser.Math.Between(0, this.fruits.length - 1);
      const fruitSelected = this.fruits[rndFruit];

      // const randomRangeX = Phaser.Math.Between(
      //   0 + fruitSelected.width / 2,
      //   this.game.scale.width - fruitSelected.width / 2
      // );
      const randomIndex = Math.floor(Math.random() * this.fruitsRandomPositions.length)
      const randomRangeX = this.fruitsRandomPositions[randomIndex]
      // Reset physics from the object
      fruitSelected.x = randomRangeX;
      fruitSelected.y = 0 - fruitSelected.height / 2;
      fruitSelected.body.velocity.reset();
      fruitSelected.body.allowGravity = true;
      fruitSelected.body.gravity.y = this.objVelocity;
    }
  }

  update() {
    if (!this.isGameOver) {
      if (this.player.controls.left.isDown) {
        this.player.x -= 4;
      }
      if (this.player.controls.right.isDown) {
        this.player.x += 4;
      }
    }

    this.fruits.forEach((fruit) => {
      //@ts-ignore
      if (fruit.y > this.game.scale.height) {
        this.endGame();
      }
    });
  }

  resize() {
    this.parent.setSize(this.scale.gameSize.width, this.scale.gameSize.height);
    this.sizer.setSize(this.scale.gameSize.width, this.scale.gameSize.height);
  }

  resetPhysicsOnCollision(player: any, fruit: any) {
    fruit.y = -100;
    fruit.body.velocity.reset();
    fruit.body.allowGravity = false;

    // Increment Score puntuation
    this.score += fruit.score;
    this.scoreText.setText(
      this.localizationManager.getTranslationByLocalizationId(
        "UI_SCORE", this.lang
      ) + this.score
    );
    this.game_sounds.collect.play();
  }

  createGraphics() {
    this.createBackground();
    this.createPlayer();
    this.createFruits();
    this.createScoreText();
  }

  createBackground() {
    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

    this.background.setScale(
      this.game.scale.width / this.background.width,
      this.game.scale.height / this.background.height
    );
  }

  createPlayer() {
    this.player = this.physics.add
      .sprite(this.game.scale.width / 2, this.game.scale.height - 75, "box")
      .setOrigin(0.5, 0.5);
    this.player.body.setSize(80, 60);

    this.player.body.allowGravity = false;
    this.player.body.immovable = true;
    this.player.setCollideWorldBounds(true);
    this.player.controls = this.input.keyboard.createCursorKeys();
  }

  createFruits() {
    this.createFruitSprite("apple", -100, -100, 10);
    this.createFruitSprite("pear", -100, -100, 20);
    this.createFruitSprite("lemon", -100, -100, 30);
    this.createFruitSprite("orange", -100, -100, 40);
    this.createFruitSprite("strawberry", -100, -100, 50);
    this.createFruitSprite("pineapple", -100, -100, 60);
  }

  createFruitSprite(
    texture: string,
    posX: number,
    posY: number,
    scorePoints: number
  ): void {
    const fruit = this.physics.add.sprite(posX, posY, texture);
    fruit.body.allowGravity = false;
    //@ts-ignore
    fruit.score = scorePoints;
    this.fruits.push(fruit);
  }

  createScoreText() {
    this.scoreText = this.add.text(
      this.scoreTextMarginX,
      this.scoreTextMarginY,
      this.localizationManager.getTranslationByLocalizationId("UI_SCORE", this.lang),
      {
        fontFamily: "retroGaming",
        fontSize: "18px",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 4,
      }
    );
    this.scoreText.setText(this.localizationManager.getTranslationByLocalizationId("UI_SCORE", this.lang) + this.score);
  }

  endGame() {
    this.scene.sleep("gameScene")
    this.scene.start("gameOverScene", { score: this.score });
    this.isGameOver = true;
    this.game_sounds.background_music.stop();
  }
}
