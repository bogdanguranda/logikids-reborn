export abstract class Action {
    scene: Phaser.Scene;
    name: string;
    sprite: Phaser.GameObjects.Sprite;
    homeX: number;
    homeY: number;
    isModel: boolean;
    started: boolean;
    finished: boolean;

    constructor(scene: Phaser.Scene, name: string, sprite: Phaser.GameObjects.Sprite, isModel: boolean) {
        this.scene = scene;
        this.name = name;
        this.sprite = sprite;
        this.homeX = sprite.x;
        this.homeY = sprite.y;
        this.isModel = isModel;
        this.started = false;
        this.finished = false;
    }

    abstract update(character: any): void;

    moveHome() {
        this.sprite.x = this.homeX;
        this.sprite.y = this.homeY;
    }

    isOver() {
        return this.finished;
    }

    destroy() {
        this.sprite.destroy();
    }
}
