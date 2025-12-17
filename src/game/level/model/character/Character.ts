import { AnimatedEntity } from '../common/AnimatedEntity';

export class Character extends AnimatedEntity {
    inventory: any[];
    enemiesKilled: any[];

    constructor(scene: Phaser.Scene, x: number, y: number, resourceName: string, animations: any[]) {
        super(scene, x, y, resourceName, animations);
        this.inventory = [];
        this.enemiesKilled = [];
    }
}
