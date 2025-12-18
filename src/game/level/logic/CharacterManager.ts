import { Character } from '../model/character/Character';
import { LevelScene } from '../LevelScene';

export class CharacterManager {
    scene: LevelScene;
    character!: Character;

    constructor(scene: LevelScene) {
        this.scene = scene;
    }

    loadAssets() {
        this.scene.load.atlas('swordsmanClassic', __ASSETS_BASE_PATH__ + 'level/character/swordsmanClassic.png', __ASSETS_BASE_PATH__ + 'level/character/swordsmanClassic.json');
    }

    create(characterData: any) {
        this.character = new Character(this.scene, characterData.position.x, characterData.position.y, characterData.texture, characterData.animations);
        this.character.setOrigin(0.5, 1);
        this.scene.physics.add.existing(this.character);
        const body = this.character.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setGravityY(1000);
    }

    cleanUp() {
        this.scene.resourceUtil.cleanUp(this.character);
    }
}
