import * as Phaser from "phaser";
import Utils from "./utils/Utils";

export default class PreloadScene extends Phaser.Scene {
  private utils: Utils
  private progressBar: any
  private progressBox: any

  private POSX_BAR_BOX: number  
  private POSY_BAR_BOX: number  
  private BAR_BOX_WIDTH: number 
  private BAR_BOX_HEIGHT: number

  private POSX_BAR: number  
  private POSY_BAR: number  
  private BAR_WIDTH: number 
  private BAR_HEIGHT: number


  constructor() {
    super({ key: "preloadScene" });
  }

  init(){
    this.POSX_BAR = 10
    this.POSY_BAR = this.game.scale.height/2
    this.BAR_WIDTH = this.game.scale.width - 20;
    this.BAR_HEIGHT = 50

    this.POSX_BAR_BOX = 20
    this.POSY_BAR_BOX = this.game.scale.height/2 + 10
    this.BAR_BOX_WIDTH = this.game.scale.width-40
    this.BAR_BOX_HEIGHT = 30
  }

  preload() {
    this.loadFont("retroGaming", "assets/fonts/RetroGaming.ttf");
    this.load.image("background", "assets/images/background.jpg");
    this.load.image("box", "assets/images/box.png");
    this.load.image("apple", "assets/images/apple.png")
    this.load.image("strawberry", "assets/images/strawberry.png")
    this.load.image("pear", "assets/images/pear.png")
    this.load.image("orange", "assets/images/orange.png")
    this.load.image("pineapple", "assets/images/pineapple.png")
    this.load.image("lemon", "assets/images/lemon.png")
    this.load.image("es-ES", "assets/images/england.png")
    this.load.image("en-EN", "assets/images/spain.png")

    this.load.json('lang', 'assets/langs/lang.json')
    this.load.json('gameConfig', 'data/gameData.json')

    this.load.audio("background", [
      'assets/sounds/background_music.ogg', 
      'assets/sounds/background_music.mp3'
    ])
    this.load.audio("collect", [
      'assets/sounds/collect.mp3'
    ])
    this.load.audio("game_over", [
      'assets/sounds/game_over.mp3'
    ])
    this.load.audio("high_score", [
      'assets/sounds/high_score.mp3'
    ])
    this.load.audio("key_pressed", [
      'assets/sounds/key_pressed.mp3'
    ])

    this.createLoadingBar()

    this.load.on("progress", function (value) {
      this.scene.loadBar(value)
    })
    this.load.on("complete", function () {
      this.scene.startMainMenuScene()
    });
  }

  create() {
    this.utils = new Utils(this)
    this.add.text(this.game.scale.width/2, this.game.scale.height/2-20, "Loading...").setOrigin(.5);
  }

  createLoadingBar(){
    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(
      this.POSX_BAR_BOX,
      this.POSY_BAR_BOX,
      this.BAR_BOX_WIDTH,
      this.BAR_BOX_HEIGHT
    );
  }

  loadBar(value: any){
    for(let i=0; i < 100000; i++){}
    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(
      this.POSX_BAR,
      this.POSY_BAR,
      this.BAR_WIDTH * value,
      this.BAR_HEIGHT
    );
  }

  startMainMenuScene(){
    this.scene.start("mainMenu")
  }

  loadFont(name, url) {
    const newFont = new FontFace(name, `url(${url})`);
    newFont
      .load()
      //@ts-ignore
      .then((loaded) => document.fonts.add(loaded))
      .catch((error) => error);
  }
}
