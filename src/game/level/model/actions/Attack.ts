import { Action } from './Action';

export class Attack extends Action {
    animation: any;

    constructor(scene: Phaser.Scene, name: string, sprite: Phaser.GameObjects.Sprite, isModel: boolean) {
        super(scene, name, sprite, isModel);
    }

    update(character: any) {
        if (!this.started) {
            this.animation = character.play('attack');
            // Attack animation: 8 frames at 24 fps = 8/24 = 0.333 seconds
            this.scene.time.delayedCall(333, () => {
                character.stop();
                this.finished = true;
            });
            this.started = true;
        }
    }
}
