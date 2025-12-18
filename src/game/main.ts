import { LevelScene } from './level/LevelScene';
import { AUTO, Game, Scale, Types } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 612,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [
        LevelScene
    ]
};

const StartGame = (parent: string) => {
    const game = new Game({ ...config, parent });
    // Start the LevelScene with initial level data
    game.scene.start('LevelScene', { campaignNumber: 1, levelNumber: 1 });
    return game;
}

export default StartGame;
