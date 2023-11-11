

export default class Utils {
    scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    getFontSize(defaultFontSize: number): string {
        let widthReference = 350
        let gameWidth = this.scene.game.scale.width
        let fontSize = defaultFontSize
        let newFontSize = (gameWidth / widthReference) * fontSize
        return newFontSize.toString() + 'px'
    }

    updateGameLang(): void {
        let lang = navigator.language
        this.scene.cache.json.get('gameConfig').currentLanguage = lang
    }
}