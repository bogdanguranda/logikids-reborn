import { Action } from './Action';

export class Climb extends Action {
    distance: number;
    remaining: number;

    constructor(scene: Phaser.Scene, name: string, sprite: Phaser.GameObjects.Sprite, isModel: boolean, distance: number) {
        super(scene, name, sprite, isModel);
        this.distance = distance;
        this.remaining = this.distance;
    }

    update(character: any) {
        if (!this.started) {
            character.play('climb');
            this.started = true;
        }
        if (this.remaining > 0) {
            character.y -= 5;
            this.remaining -= 5;
        } else {
            character.stop();
            this.finished = true;
        }
    }
}
