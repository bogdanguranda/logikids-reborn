import { Entity } from '../common/Entity';

export class EnvironmentObject extends Entity {
    isCollectible: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, resourceName: string, isCollectible: boolean) {
        super(scene, x, y, resourceName);
        this.isCollectible = isCollectible;
    }
}
