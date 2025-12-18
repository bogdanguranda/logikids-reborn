import { Action } from './Action';

export class Jump extends Action {
    distanceY: number;
    distanceX: number;
    defaultVelocityX: number;
    defaultVelocityY: number;
    remainingTime: number;
    jumpTime: number;
    fallingTime: number;
    landingTime: number;
    isJumping: boolean;
    isFalling: boolean;
    hasLanded: boolean;
    animation: any;
    lastTime: number;
    currentTime: number;

    constructor(scene: Phaser.Scene, name: string, sprite: Phaser.GameObjects.Sprite, isModel: boolean, distanceY: number, distanceX: number) {
        super(scene, name, sprite, isModel);
        this.distanceY = distanceY;
        this.distanceX = distanceX;
        this.remainingTime = this.distanceX / this.distanceX; // This is always 1, representing 1 second total jump time
        this.jumpTime = this.remainingTime - (1 / 4) * this.remainingTime;
        this.fallingTime = this.jumpTime - (1 / 3) * this.jumpTime;
        this.landingTime = this.fallingTime - (2 / 3) * this.fallingTime;
        // Calculate horizontal velocity to travel exactly distanceX during the moving phases
        const movingTime = this.jumpTime - this.landingTime;
        this.defaultVelocityX = this.distanceX / movingTime;
        this.defaultVelocityY = -this.distanceY;
        this.isJumping = false;
        this.isFalling = false;
        this.hasLanded = false;
    }

    update(character: any) {
        const body = character.body as Phaser.Physics.Arcade.Body;
        if (!this.started) {
            this.animation = character.play('jumpCrouch');
            this.lastTime = this.scene.time.now / 1000;
            this.started = true;
        }
        if (this.remainingTime > 0) {
            if (!this.isJumping && this.remainingTime <= this.jumpTime) {
                this.animation = character.play('jumpJump');
                body.setGravityY(0);
                body.setVelocityY(this.defaultVelocityY);
                body.setVelocityX(this.defaultVelocityX);
                this.isJumping = true;
            }
            if (!this.isFalling && this.remainingTime <= this.fallingTime) {
                this.animation = character.play('jumpFall');
                body.setGravityY(1500);
                body.setVelocityY(0);
                this.isFalling = true;
            }
            if (!this.hasLanded && this.remainingTime <= this.landingTime) {
                this.animation = character.play('jumpLand');
                body.setVelocityX(0);
                this.hasLanded = true;
            }
            this.currentTime = this.scene.time.now / 1000;
            const elapsedTime = this.currentTime - this.lastTime;
            this.remainingTime -= elapsedTime;
            this.lastTime = this.currentTime;
        } else {
            body.setVelocityX(0);
            body.setVelocityY(0);
            character.stop();
            this.finished = true;
        }
    }
}
