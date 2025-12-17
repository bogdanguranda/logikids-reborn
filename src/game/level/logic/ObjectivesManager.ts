import { LevelScene } from '../LevelScene';

export class ObjectivesManager {
    scene: LevelScene;
    objectives: any;
    mainObjectiveText!: Phaser.GameObjects.Text;
    secondaryObjectiveText: Phaser.GameObjects.Text | null = null;

    constructor(scene: LevelScene) {
        this.scene = scene;
    }

    create(jsonLevelData: any) {
        this.objectives = jsonLevelData.objectives;
        this.mainObjectiveText = this.scene.add.text(25, 10, 'Objective: ' + this.objectives.mainObjective.text, {
            font: '18px ' + this.scene.customConfigurations.ui.fontFamily,
            color: '#000000'
        });
        if (this.objectives.secondaryObjective != null) {
            this.secondaryObjectiveText = this.scene.add.text(25, 30, 'Secondary objective: ' + this.objectives.secondaryObjective.text, {
                font: '18px ' + this.scene.customConfigurations.ui.fontFamily,
                color: '#000000'
            });
        }
    }

    isMainObjectiveReached(character: any) {
        const objective = this.objectives.mainObjective;
        return this.isObjectiveReached(objective, character);
    }

    isSecondaryObjectiveReached(character: any) {
        const objective = this.objectives.secondaryObjective;
        return this.isObjectiveReached(objective, character);
    }

    isObjectiveReached(objective: any, character: any) {
        if (objective == null) {
            return false;
        }
        if (objective.type == 'position') {
            const xToReach = objective.data.x;
            const characterX = character.x;
            let difX = xToReach - characterX;
            if (difX < 0) {
                difX = -1 * difX;
            }
            const errorMargin = 25;
            if (difX < errorMargin) {
                return true;
            }
        } else if (objective.type == 'collect') {
            const collectibles = objective.data;
            for (let j = 0; j < collectibles.length; j++) {
                let found = false;
                const collectible = collectibles[j];
                for (let i = 0; i < character.inventory.length; i++) {
                    const item = character.inventory[i];
                    if (item == collectible) {
                        found = true;
                    }
                }
                if (!found) {
                    return false;
                }
            }
            return true;
        } else if (objective.type == 'kill') {
            const enemies = objective.data;
            for (let j = 0; j < enemies.length; j++) {
                let found = false;
                const enemy = enemies[j];
                for (let i = 0; i < character.enemiesKilled.length; i++) {
                    const item = character.enemiesKilled[i];
                    if (item == enemy) {
                        found = true;
                    }
                }
                if (!found) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    cleanUp() {
        this.mainObjectiveText.destroy();
        if (this.secondaryObjectiveText != null) {
            this.secondaryObjectiveText.destroy();
        }
    }
}
