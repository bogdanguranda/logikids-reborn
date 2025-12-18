import { EnvironmentObject } from '../model/environment/EnvironmentObject';
import { AnimatedEntity } from '../model/common/AnimatedEntity';
import { Enemy } from '../model/environment/Enemy';
import { LevelScene } from '../LevelScene';

export class EnvironmentManager {
    scene: LevelScene;
    environment: any[];
    collectibles: any[];
    enemies: any[];

    constructor(scene: LevelScene) {
        this.scene = scene;
        this.environment = [];
        this.collectibles = [];
        this.enemies = [];
    }

    loadAssets() {
        this.scene.load.image('treasure', 'assets/level/objects/treasure.png');
        this.scene.load.atlas('coin', 'assets/level/objects/coin.png', 'assets/level/objects/coin.json');
        this.scene.load.image('dummy', 'assets/level/objects/dummy.png');
        this.scene.load.image('horizontalWall', 'assets/level/objects/horizontalWall.png');
        this.scene.load.image('verticalWall', 'assets/level/objects/verticalWall.png');
        this.scene.load.image('obstacle', 'assets/level/objects/obstacle.png');
        this.scene.load.image('gate', 'assets/level/objects/gate.png');
        this.scene.load.image('ladder', 'assets/level/objects/ladder.png');
    }

    create(jsonLevelData: any) {
        const environment = jsonLevelData.environment;
        for (const key in environment) {
            if (environment.hasOwnProperty(key)) {
                const itemInfo = environment[key];
                const item = new EnvironmentObject(this.scene, itemInfo.position.x, itemInfo.position.y, itemInfo.texture, false);
                this.scene.physics.add.existing(item);
                const body = item.body as Phaser.Physics.Arcade.Body;
                body.setCollideWorldBounds(true);
                body.setImmovable(true);
                body.moves = false;
                this.environment.push(item);
            }
        }
        const collectibles = jsonLevelData.collectibles;
        for (const key in collectibles) {
            if (collectibles.hasOwnProperty(key)) {
                const itemInfo = collectibles[key];
                const item = new AnimatedEntity(this.scene, itemInfo.position.x, itemInfo.position.y, itemInfo.texture, itemInfo.animations);
                this.scene.physics.add.existing(item);
                const body = item.body as Phaser.Physics.Arcade.Body;
                body.setCollideWorldBounds(true);
                body.setImmovable(true);
                body.moves = false;
                item.play('standing');
                this.collectibles.push(item);
            }
        }
        const enemies = jsonLevelData.enemies;
        for (const keyE in enemies) {
            if (enemies.hasOwnProperty(keyE)) {
                const itemInfo = enemies[keyE];
                const item = new Enemy(this.scene, itemInfo.position.x, itemInfo.position.y, itemInfo.texture, itemInfo.animations, itemInfo.damage);
                this.scene.physics.add.existing(item);
                const body = item.body as Phaser.Physics.Arcade.Body;
                body.setCollideWorldBounds(true);
                body.setImmovable(true);
                body.moves = false;
                this.enemies.push(item);
            }
        }
    }

    cleanUp() {
        this.scene.resourceUtil.cleanUpArray(this.environment);
        this.scene.resourceUtil.cleanUpArray(this.collectibles);
        this.scene.resourceUtil.cleanUpArray(this.enemies);
        this.environment = [];
        this.collectibles = [];
        this.enemies = [];
    }
}
