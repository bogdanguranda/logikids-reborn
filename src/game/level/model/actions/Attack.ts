import { Action } from './Action';

export class Attack extends Action {
    animation: any;

    constructor(scene: Phaser.Scene, name: string, sprite: Phaser.GameObjects.Sprite, isModel: boolean) {
        super(scene, name, sprite, isModel);
    }

    update(character: any) {
        if (!this.started) {
            this.animation = character.play('attack');
            character.once('animationcomplete', () => {
                character.stop();
                this.finished = true;
            });
            this.started = true;
        }
    }
}
