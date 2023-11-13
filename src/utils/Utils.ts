const LANGS = ['es-ES', 'en-EN']

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

    getCurrentLang(): string {
       return this.scene.cache.json.get('gameConfig').currentLang
    }

    updateGameLang(lang: string): void {
        let lang_ = ''
        if(lang === LANGS[0]){
            lang_ = LANGS[1]
        } else {
            lang_ = LANGS[0]
        }
        this.scene.cache.json.get('gameConfig').currentLang = lang_
    }

    generateRandomPositions(min, max): Array<number> {
        if (min > max) {
            [min, max] = [max, min];
        }

        const positions = [];
        for (let i = min; i <= max; i++) {
            positions.push(i);
        }

        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        return positions;
    }
}