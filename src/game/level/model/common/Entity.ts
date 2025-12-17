import Phaser from 'phaser';

export class Entity extends Phaser.GameObjects.Sprite {
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, x: number, y: number, resourceName: string) {
        super(scene, x, y, resourceName);
        this.scene = scene;
        this.scene.add.existing(this);
    }
}
