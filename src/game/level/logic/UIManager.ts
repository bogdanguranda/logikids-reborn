import { LevelScene } from '../LevelScene';

export class UIManager {
    scene: LevelScene;
    btnReady!: Phaser.GameObjects.Sprite;
    btnReset!: Phaser.GameObjects.Sprite;
    mainObjectiveReachedText: Phaser.GameObjects.Text | null = null;
    secondaryObjectiveReachedText: Phaser.GameObjects.Text | null = null;
    background!: Phaser.GameObjects.Sprite;
    levelText!: Phaser.GameObjects.Text;

    constructor(scene: LevelScene) {
        this.scene = scene;
    }

    loadAssets() {
        this.scene.load.image('btnReady', 'assets/level/ui/btnReady.png');
        this.scene.load.image('btnReset', 'assets/level/ui/btnReset.png');
    }

    create(levelScene: LevelScene) {
        this.background = levelScene.background;
        this.levelText = this.scene.add.text(this.background.width - 150, 10, 'Level ' + levelScene.levelNumber, {
            font: '24px ' + this.scene.customConfigurations.ui.fontFamily,
            color: '#000000'
        });
        this.btnReady = this.scene.add.sprite(levelScene.background.width / 2, 50, 'btnReady');
        this.btnReady.setOrigin(0.5, 0.5);
        this.btnReady.setScale(0.5, 0.5);
        this.btnReady.setInteractive();
        this.btnReady.on('pointerdown', () => {
            levelScene.timelineManager.timeline.startExecution();
            levelScene.timelineManager.disableActions();
            this.btnReady.setActive(false);
            this.btnReset.setActive(true);
            this.btnReset.setVisible(true);
            this.btnReady.setVisible(false);

        });
        this.scene.physics.add.existing(this.btnReady);

        this.btnReset = this.scene.add.sprite(levelScene.background.width / 2, 50, 'btnReset');
        this.btnReset.setOrigin(0.5, 0.5);
        this.btnReset.setScale(0.5, 0.5);
        this.btnReset.setInteractive();
        this.btnReset.on('pointerdown', () => {
            this.cleanUp();
            this.scene.scene.restart({
                campaignNumber: levelScene.campaignNumber,
                levelNumber: levelScene.levelNumber
            });
            this.btnReady.setActive(true);
            this.btnReset.setActive(false);
            this.btnReset.setVisible(false);
            this.btnReady.setVisible(true);
        });
        this.scene.physics.add.existing(this.btnReset);
        this.btnReset.setActive(false);
        this.btnReset.setVisible(false);
    }

    displayFinish(isMainObjectiveReached: boolean, isSecondaryObjectiveReached: boolean) {
        if (isMainObjectiveReached) {
            this.mainObjectiveReachedText = this.scene.add.text(this.background.width / 2, this.background.height / 2, 'Victory!', {
                font: '64px ' + this.scene.customConfigurations.ui.fontFamily,
                color: '#000000'
            });
            this.mainObjectiveReachedText.setOrigin(0.5, 0.5);
            if (isSecondaryObjectiveReached) {
                const x = this.mainObjectiveReachedText.x;
                const y = this.mainObjectiveReachedText.y + this.mainObjectiveReachedText.height + 5;
                this.secondaryObjectiveReachedText = this.scene.add.text(x, y, 'Secondary objective completed!', {
                    font: '28px ' + this.scene.customConfigurations.ui.fontFamily,
                    color: '#000000'
                });
                this.secondaryObjectiveReachedText.setOrigin(0.5, 0.5);
            }
        } else {
            this.mainObjectiveReachedText = this.scene.add.text(this.background.width / 2, this.background.height / 2, 'Game over, try again!', {
                font: '64px ' + this.scene.customConfigurations.ui.fontFamily,
                color: '#000000'
            });
            this.mainObjectiveReachedText.setOrigin(0.5, 0.5);
        }
    }

    cleanUp() {
        this.scene.resourceUtil.cleanUp(this.btnReady);
        this.scene.resourceUtil.cleanUp(this.btnReset);
        this.scene.resourceUtil.cleanUp(this.levelText);
        if (this.mainObjectiveReachedText != null) {
            this.scene.resourceUtil.cleanUp(this.mainObjectiveReachedText);
        }
        if (this.secondaryObjectiveReachedText != null) {
            this.scene.resourceUtil.cleanUp(this.secondaryObjectiveReachedText);
        }
    }
}
