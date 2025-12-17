import { AnimatedEntity } from '../common/AnimatedEntity';

export class Enemy extends AnimatedEntity {
    damage: number;

    constructor(scene: Phaser.Scene, x: number, y: number, resourceName: string, animations: any[], damage: number) {
        super(scene, x, y, resourceName, animations);
        this.damage = damage;
    }
}
