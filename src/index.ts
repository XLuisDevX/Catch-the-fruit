import Game from "./game";
import * as Phaser from 'phaser';
import PreloadScene from "./preloadScene";
import GameOverScene from "./gameOverScene";
import MainMenu from "./MainMenu";

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: window.innerHeight / 2,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    lang: '',
    scene: [PreloadScene, MainMenu, Game, GameOverScene]
};

const game = new Phaser.Game(config);