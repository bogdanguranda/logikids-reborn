import { LevelScene } from '../LevelScene';

export class UIManager {
    scene: LevelScene;
    btnReady!: Phaser.GameObjects.Sprite;
    btnReadyText!: Phaser.GameObjects.Text;
    mainObjectiveReachedText: Phaser.GameObjects.Text | null = null;
    secondaryObjectiveReachedText: Phaser.GameObjects.Text | null = null;
    background!: Phaser.GameObjects.Sprite;

    constructor(scene: LevelScene) {
        this.scene = scene;
    }

    loadAssets() {
        this.scene.load.image('btnReady', 'assets/level/ui/btnReady.png');
    }

    create(levelScene: LevelScene) {
        this.background = levelScene.background;
        this.btnReady = this.scene.add.sprite(levelScene.background.width / 2, 50, 'btnReady');
        this.btnReady.setOrigin(0.5, 0.5);
        this.btnReady.setScale(0.5, 0.5);
        this.btnReady.setInteractive();
        this.btnReady.on('pointerdown', () => {
            if (!levelScene.timelineManager.timeline.hasStarted()) {
                levelScene.timelineManager.timeline.startExecution();
                this.btnReadyText.setText('Restart');
                levelScene.timelineManager.disableActions();
            } else {
                this.btnReadyText.setText('Start');
                this.cleanUp();
                this.scene.scene.restart({
                    campaignNumber: levelScene.campaignNumber,
                    levelNumber: levelScene.levelNumber
                });
            }
        });
        this.scene.physics.add.existing(this.btnReady);
        this.btnReadyText = this.scene.add.text(this.btnReady.x, this.btnReady.y, 'Start', {
            font: '24px ' + this.scene.customConfigurations.ui.fontFamily, color: '#ffffff'
        });
        this.btnReadyText.setOrigin(0.5, 0.5);
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
        this.scene.resourceUtil.cleanUp(this.btnReadyText);
        if (this.mainObjectiveReachedText != null) {
            this.scene.resourceUtil.cleanUp(this.mainObjectiveReachedText);
        }
        if (this.secondaryObjectiveReachedText != null) {
            this.scene.resourceUtil.cleanUp(this.secondaryObjectiveReachedText);
        }
    }
}
