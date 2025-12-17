import { Timeline } from './Timeline';
import { Walk } from '../model/actions/Walk';
import { Jump } from '../model/actions/Jump';
import { Attack } from '../model/actions/Attack';
import { Crawl } from '../model/actions/Crawl';
import { Climb } from '../model/actions/Climb';
import { Pick } from '../model/actions/Pick';
import { LevelScene } from '../LevelScene';

export class TimelineManager {
    scene: LevelScene;
    actionsNames: string[];
    actions: { [key: string]: any };
    actionsBar!: Phaser.GameObjects.Sprite;
    actionsBarText!: Phaser.GameObjects.Text;
    timelineBar!: Phaser.GameObjects.Sprite;
    timelineCharacterIcon!: Phaser.GameObjects.Sprite;
    timeline!: Timeline;

    constructor(scene: LevelScene) {
        this.scene = scene;
        this.actionsNames = [];
        this.actions = {};
    }

    loadAssets() {
        this.scene.load.image('actionsBar', 'assets/level/ui/actionsBar.png');
        this.scene.load.image('actionWalk', 'assets/level/actions/walk.png');
        this.scene.load.image('actionJump', 'assets/level/actions/jump.png');
        this.scene.load.image('actionAttack', 'assets/level/actions/attack.png');
        this.scene.load.image('actionCrawl', 'assets/level/actions/crawl.png');
        this.scene.load.image('actionClimb', 'assets/level/actions/climb.png');
        this.scene.load.image('actionPick', 'assets/level/actions/pick.png');
        this.actionsNames.push('actionWalk');
        this.actionsNames.push('actionJump');
        this.actionsNames.push('actionAttack');
        this.actionsNames.push('actionCrawl');
        this.actionsNames.push('actionClimb');
        this.actionsNames.push('actionPick');
        this.scene.load.image('timelineBar', 'assets/level/ui/timelineBar.png');
        this.scene.load.image('timelineCharacterIcon', 'assets/level/ui/timelineCharacterIcon.png');
    }

    create(actionsBarY: number) {
        this.actionsBar = this.scene.add.sprite(0, actionsBarY, 'actionsBar').setOrigin(0, 0);
        this.scene.physics.add.existing(this.actionsBar);
        (this.actionsBar.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        this.actionsBarText = this.scene.add.text(20, this.actionsBar.y + this.actionsBar.height / 2, 'Actions', {
            font: '38px ' + this.scene.customConfigurations.ui.fontFamily, color: '#4d2600'
        }).setOrigin(0, 0.5);
        const actionsWidth = 70.0;
        const actionsSpacing = 5;
        const actionsStartingX = this.actionsBarText.x + this.actionsBarText.width + actionsWidth / 2 + actionsSpacing;
        const actionsY = this.actionsBar.y + this.actionsBar.height / 2;
        this.timelineBar = this.scene.add.sprite(0, this.actionsBar.y + this.actionsBar.height, 'timelineBar').setOrigin(0, 0);
        this.timelineCharacterIcon = this.scene.add.sprite(80, this.timelineBar.y + this.timelineBar.height / 2, 'timelineCharacterIcon');
        this.timelineCharacterIcon.setOrigin(0.5, 0.5);
        this.timeline = new Timeline(this.scene, this.timelineBar.y + (this.timelineBar.height / 2));
        for (let i = 0; i < this.actionsNames.length; i++) {
            const action = this.createAction(this.actionsNames[i], actionsStartingX + (actionsWidth + actionsSpacing) * i, actionsY, true);
            this.actions[action.name] = action;
        }
    }

    createAction(actionName: string, x: number, y: number, isModel: boolean) {
        const sprite = this.scene.add.sprite(x, y, actionName);
        sprite.setOrigin(0.5, 0.5);
        sprite.setInteractive({ draggable: true });
        this.scene.input.setDraggable(sprite);
        this.scene.physics.add.existing(sprite);
        let action: any;
        if (actionName === 'actionWalk') {
            action = new Walk(this.scene, actionName, sprite, isModel, 100);
        } else if (actionName === 'actionJump') {
            action = new Jump(this.scene, actionName, sprite, isModel, 400, 100);
        } else if (actionName === 'actionAttack') {
            action = new Attack(this.scene, actionName, sprite, isModel);
        } else if (actionName === 'actionCrawl') {
            action = new Crawl(this.scene, actionName, sprite, isModel, 100, 100);
        } else if (actionName === 'actionClimb') {
            action = new Climb(this.scene, actionName, sprite, isModel, 100);
        } else if (actionName === 'actionPick') {
            action = new Pick(this.scene, actionName, sprite, isModel);
        }
        this.setActionHandlers(action);
        return action;
    }

    setActionHandlers(action: any) {
        if (action.isModel) {
            action.sprite.on('dragend', () => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(action.sprite.getBounds(), this.timelineBar.getBounds())) {
                    const cloneAction = this.createAction(action.name, action.sprite.x, action.sprite.y, false);
                    this.timeline.addAction(cloneAction);
                }
                action.moveHome();
            });
            action.sprite.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                action.sprite.x = dragX;
                action.sprite.y = dragY;
            });
        } else {
            action.sprite.on('dragend', () => {
                if (!Phaser.Geom.Intersects.RectangleToRectangle(action.sprite.getBounds(), this.timelineBar.getBounds())) {
                    this.timeline.removeAction(action);
                } else {
                    action.moveHome();
                }
            });
            action.sprite.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                action.sprite.x = dragX;
                action.sprite.y = dragY;
            });
        }
    }

    disableActions() {
        for (const key in this.actions) {
            if (this.actions.hasOwnProperty(key)) {
                this.scene.input.setDraggable(this.actions[key].sprite, false);
            }
        }
        for (let i = 0; i < this.timeline.actions.length; i++) {
            this.scene.input.setDraggable(this.timeline.actions[i].sprite, false);
        }
    }

    cleanUp() {
        this.scene.resourceUtil.cleanUp(this.actionsBar);
        this.scene.resourceUtil.cleanUp(this.actionsBarText);
        this.actionsNames = [];
        this.actions = {};
        this.scene.resourceUtil.cleanUp(this.timelineBar);
        this.scene.resourceUtil.cleanUp(this.timelineCharacterIcon);
    }
}
