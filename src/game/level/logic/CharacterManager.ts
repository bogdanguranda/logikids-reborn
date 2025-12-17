import { Character } from '../model/character/Character';
import { LevelScene } from '../LevelScene';

export class CharacterManager {
    scene: LevelScene;
    character!: Character;

    constructor(scene: LevelScene) {
        this.scene = scene;
    }

    loadAssets() {
        this.scene.load.atlas('swordsmanClassic', 'assets/level/character/swordsmanClassic.png', 'assets/level/character/swordsmanClassic.json');
    }

    create(characterData: any) {
        this.character = new Character(this.scene, characterData.position.x, characterData.position.y, characterData.texture, characterData.animations);
        this.character.setOrigin(0.5, 1);
        this.scene.physics.add.existing(this.character);
        const body = this.character.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setGravityY(1000);
    }

    updateCharacter(environment: any[], collectibles: any[], enemies: any[], timeline: any) {
        for (const key in environment) {
            if (environment.hasOwnProperty(key)) {
                this.scene.physics.world.collide(this.character, environment[key]);
            }
        }
        for (let i = 0; i < collectibles.length; i++) {
            const collectible = collectibles[i];
            const isPickingUp = timeline.actions[timeline.currentActionIndex].name === 'actionPick';
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.character.getBounds(), collectible.getBounds()) && isPickingUp) {
                this.character.inventory.push(collectible.name);
                collectible.destroy();
                collectibles.splice(i, 1);
                break;
            } else {
                collectible.update();
            }
        }
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const isSlashing = timeline.actions[timeline.currentActionIndex].name === 'actionAttack';
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.character.getBounds(), enemy.getBounds()) && isSlashing) {
                this.character.enemiesKilled.push(enemy.name);
                enemy.destroy();
                enemies.splice(i, 1);
                break;
            } else {
                enemy.update();
            }
        }
    }

    cleanUp() {
        this.scene.resourceUtil.cleanUp(this.character);
    }
}
