import { Entity } from './Entity';

export class AnimatedEntity extends Entity {
    constructor(scene: Phaser.Scene, x: number, y: number, resourceName: string, animations?: any[]) {
        super(scene, x, y, resourceName);
        if (animations) {
            for (let i = 0; i < animations.length; i++) {
                const animConfig = animations[i];
                if (!this.scene.anims.exists(animConfig.key)) {
                    const frames = this.scene.anims.generateFrameNames(resourceName, {
                        prefix: '',
                        start: animConfig.frameStart,
                        end: animConfig.frameEnd,
                        zeroPad: 4
                    });
                    this.scene.anims.create({
                        key: animConfig.key,
                        frames: frames,
                        frameRate: 24,
                        repeat: -1
                    });
                }
            }
        }
    }
}
