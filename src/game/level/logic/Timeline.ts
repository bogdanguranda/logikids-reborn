export class Timeline {
    scene: Phaser.Scene;
    actions: any[];
    currentActionIndex: number;
    actionsStartingX: number;
    actionsStartingY: number;
    actionsSpacingX: number;
    actionsWidth: number;

    constructor(scene: Phaser.Scene, actionsStartingY: number) {
        this.scene = scene;
        this.actions = [];
        this.currentActionIndex = -1;
        this.actionsStartingX = 35;
        this.actionsStartingY = actionsStartingY;
        this.actionsSpacingX = 40;
        this.actionsWidth = 60;
    }

    hasStarted() {
        return this.currentActionIndex >= 0;
    }

    hasFinished() {
        return this.currentActionIndex >= this.actions.length;
    }

    stopExecution() {
        this.currentActionIndex = this.actions.length;
    }

    startExecution() {
        if (this.actions.length === 0) {
            return;
        }
        this.currentActionIndex++;
    }

    updateExecution(character: any) {
        if (this.currentActionIndex >= this.actions.length) return;

        // In Phaser 3, we update body size based on current frame if available
        if (character.frame) {
            const body = character.body as Phaser.Physics.Arcade.Body;
            body.setSize(character.frame.width, character.frame.height);
        }
        let currentAction = this.actions[this.currentActionIndex];
        if (!currentAction.isOver()) {
            currentAction.update(character);
        } else {
            if (this.currentActionIndex < this.actions.length - 1) {
                this.currentActionIndex++;
                currentAction = this.actions[this.currentActionIndex];
                currentAction.update(character);
            }
        }
    }

    addAction(action: any) {
        action.sprite.y = this.actionsStartingY;
        if (this.actions.length === 0) {
            action.sprite.x = this.actionsStartingX;
        } else {
            action.sprite.x = this.actionsStartingX + (this.actionsWidth + this.actionsSpacingX) * this.actions.length;
        }
        action.homeX = action.sprite.x;
        action.homeY = action.sprite.y;
        this.actions.push(action);
    }

    removeAction(action: any) {
        let index: number | undefined = undefined;
        let actionToKill: any = undefined;
        for (let i = 0; i < this.actions.length; i++) {
            if (this.actions[i] === action) {
                actionToKill = this.actions[i];
                for (let j = this.actions.length - 1; j > i; j--) {
                    this.actions[j].sprite.x = this.actions[j - 1].homeX;
                    this.actions[j].homeX = this.actions[j - 1].homeX;
                }
                index = i;
                break;
            }
        }
        if (index !== undefined) {
            this.actions.splice(index, 1);
            if (this.currentActionIndex >= 0) {
                this.currentActionIndex--;
            }
            actionToKill.sprite.destroy();
        }
    }
}
