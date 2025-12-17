import { Action } from './Action';

export class Crawl extends Action {
    distance: number;
    velocity: number;
    remainingTimeInSeconds: number;
    animation: any;
    lastTime: number;
    currentTime: number;

    constructor(scene: Phaser.Scene, name: string, sprite: Phaser.GameObjects.Sprite, isModel: boolean, distance: number, velocity: number) {
        super(scene, name, sprite, isModel);
        this.distance = distance;
        this.velocity = velocity;
        this.remainingTimeInSeconds = this.distance / this.velocity;
    }

    update(character: any) {
        if (!this.started) {
            this.animation = character.play('crawl');
            (character.body as Phaser.Physics.Arcade.Body).setVelocityX(this.velocity);
            this.lastTime = this.scene.time.now / 1000;
            this.started = true;
        }
        if (this.remainingTimeInSeconds > 0) {
            this.currentTime = this.scene.time.now / 1000;
            const elapsedTime = this.currentTime - this.lastTime;
            this.remainingTimeInSeconds -= elapsedTime;
            this.lastTime = this.currentTime;
        } else {
            (character.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
            character.stop();
            this.finished = true;
        }
    }
}
