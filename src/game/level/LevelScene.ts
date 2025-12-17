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
        this.levelFilePath = 'assets/data/campaign' + this.campaignNumber + '/level' + this.levelNumber + '.json';

        this.uiManager = new UIManager(this);
        this.environmentManager = new EnvironmentManager(this);
        this.characterManager = new CharacterManager(this);
        this.timelineManager = new TimelineManager(this);
        this.objectivesManager = new ObjectivesManager(this);
    }

    preload() {
        this.load.json(this.levelFileAssetName, this.levelFilePath);
        this.load.image('levelBackground', 'assets/level/background.png');
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
    }

    update() {
        this.physics.world.collide(this.characterManager.character, this.timelineManager.actionsBar);
        if (this.timelineManager.timeline.hasStarted()) {
            this.timelineManager.timeline.updateExecution(this.characterManager.character);
            this.characterManager.updateCharacter(
                this.environmentManager.environment,
                this.environmentManager.collectibles,
                this.environmentManager.enemies,
                this.timelineManager.timeline
            );
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
