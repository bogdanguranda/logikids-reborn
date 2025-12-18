import { UIManager } from './logic/UIManager';
import { EnvironmentManager } from './logic/EnvironmentManager';
import { CharacterManager } from './logic/CharacterManager';
import { TimelineManager } from './logic/TimelineManager';
import { ObjectivesManager } from './logic/ObjectivesManager';
import { ResourceUtil } from './logic/ResourceUtil';
import { Scene } from 'phaser';

export interface CustomConfigurations {
    ui: {
        fontFamily: string;
    };
}

export class LevelScene extends Scene {
    resourceUtil: ResourceUtil;
    customConfigurations: CustomConfigurations;
    uiManager!: UIManager;
    environmentManager!: EnvironmentManager;
    characterManager!: CharacterManager;
    timelineManager!: TimelineManager;
    objectivesManager!: ObjectivesManager;
    campaignNumber!: number;
    levelNumber!: number;
    levelFileAssetName!: string;
    levelFilePath!: string;
    background!: Phaser.GameObjects.Sprite;

    constructor() {
        super('LevelScene');
        this.resourceUtil = new ResourceUtil();
        this.customConfigurations = {
            ui: {
                fontFamily: 'Arial'
            }
        };
    }

    init(levelInfo: { campaignNumber: number; levelNumber: number }) {
        this.campaignNumber = levelInfo.campaignNumber;
        this.levelNumber = levelInfo.levelNumber;
        this.levelFileAssetName = 'campaign' + this.campaignNumber + 'Level' + this.levelNumber;
        this.levelFilePath = __ASSETS_BASE_PATH__ + 'data/campaign' + this.campaignNumber + '/level' + this.levelNumber + '.json';

        this.uiManager = new UIManager(this);
        this.environmentManager = new EnvironmentManager(this);
        this.characterManager = new CharacterManager(this);
        this.timelineManager = new TimelineManager(this);
        this.objectivesManager = new ObjectivesManager(this);
    }

    preload() {
        this.load.json(this.levelFileAssetName, this.levelFilePath);
        this.load.image('levelBackground', __ASSETS_BASE_PATH__ + 'level/background.png');
        this.uiManager.loadAssets();
        this.environmentManager.loadAssets();
        this.characterManager.loadAssets();
        this.timelineManager.loadAssets();
    }

    create() {
        const jsonLevelData = this.cache.json.get(this.levelFileAssetName);
        this.background = this.add.sprite(0, 0, 'levelBackground').setOrigin(0, 0);
        this.environmentManager.create(jsonLevelData);
        this.timelineManager.create(this.background.height);
        this.characterManager.create(jsonLevelData.character);
        this.objectivesManager.create(jsonLevelData);
        this.uiManager.create(this);

        this.setupCollisions();
    }

    setupCollisions() {
        const character = this.characterManager.character;

        // Character collides with environment (walls, platforms, etc.)
        this.environmentManager.environment.forEach(envObject => {
            this.physics.add.collider(character, envObject);
        });

        // Character collides with actions bar
        this.physics.add.collider(character, this.timelineManager.actionsBar);

        // Character overlaps with collectibles (for picking up)
        this.physics.add.overlap(
            character,
            this.environmentManager.collectibles,
            this.handleCollectibleOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // Character overlaps with enemies (for combat)
        this.physics.add.overlap(
            character,
            this.environmentManager.enemies,
            this.handleEnemyOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
    }

    handleCollectibleOverlap(character: Phaser.GameObjects.GameObject, collectible: Phaser.GameObjects.GameObject) {
        if (!this.timelineManager.timeline.hasStarted()) return;

        const currentAction = this.timelineManager.timeline.actions[this.timelineManager.timeline.currentActionIndex];
        if (currentAction && currentAction.name === 'actionPick') {
            const charEntity = character as any;
            const collectibleKey = (collectible as Phaser.GameObjects.Sprite).texture.key;
            charEntity.inventory.push(collectibleKey);
            collectible.destroy();

            // Remove from collectibles array
            const index = this.environmentManager.collectibles.indexOf(collectible as any);
            if (index > -1) {
                this.environmentManager.collectibles.splice(index, 1);
            }

            // Check if treasure was collected
            if (collectibleKey === 'treasure') {
                // Stop the timeline execution
                this.timelineManager.timeline.stopExecution();

                // Auto-advance to next level after 3 seconds
                if (this.levelNumber < 3) {
                    this.time.delayedCall(1500, () => {
                        this.scene.restart({ campaignNumber: this.campaignNumber, levelNumber: this.levelNumber + 1 });
                    });
                }
            }
        }
    }

    handleEnemyOverlap(character: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
        if (!this.timelineManager.timeline.hasStarted()) return;

        const currentAction = this.timelineManager.timeline.actions[this.timelineManager.timeline.currentActionIndex];
        if (currentAction && currentAction.name === 'actionAttack') {
            const charEntity = character as any;
            charEntity.enemiesKilled.push((enemy as any).name);
            enemy.destroy();

            // Remove from enemies array
            const index = this.environmentManager.enemies.indexOf(enemy as any);
            if (index > -1) {
                this.environmentManager.enemies.splice(index, 1);
            }
        }
    }

    update() {
        // Collisions are now handled by physics.add.collider() and physics.add.overlap() set up in create()
        if (this.timelineManager.timeline.hasStarted()) {
            this.timelineManager.timeline.updateExecution(this.characterManager.character);

            if (this.timelineManager.timeline.hasFinished()) {
                this.uiManager.displayFinish(
                    this.objectivesManager.isMainObjectiveReached(this.characterManager.character),
                    this.objectivesManager.isSecondaryObjectiveReached(this.characterManager.character)
                );
            }
        }
    }

    shutdown() {
        this.resourceUtil.cleanUp(this.background);
        this.uiManager.cleanUp();
        this.environmentManager.cleanUp();
        this.characterManager.cleanUp();
        this.timelineManager.cleanUp();
        this.objectivesManager.cleanUp();
    }
}
