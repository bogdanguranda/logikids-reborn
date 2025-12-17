# Logikids Reborn

A logic-based educational puzzle game built with Phaser 3 and TypeScript. Players control a character by arranging action blocks on a timeline to reach objectives.

## Gameplay

- Drag and drop action blocks (walk, jump, attack, climb, crawl, pick) onto the timeline
- Press Start to execute the sequence
- Complete objectives like reaching positions, collecting items, or defeating enemies
- Plan your moves carefully - you can't change them once execution begins!

## Tech Stack

- [Phaser 3.90.0](https://github.com/phaserjs/phaser) - Game framework
- [Vite 6.3.1](https://github.com/vitejs/vite) - Build tool
- [TypeScript 5.7.2](https://github.com/microsoft/TypeScript) - Type safety

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The development server runs on `http://localhost:8080` by default.

## Project Structure

```
├── public/
│   └── assets/
│       ├── data/           # Level JSON files
│       └── level/          # Game assets
│           ├── actions/    # Action button sprites
│           ├── character/  # Character sprite sheets
│           ├── objects/    # Environment objects
│           └── ui/         # UI elements
├── src/
│   ├── main.ts             # Application entry point
│   └── game/
│       ├── main.ts         # Phaser game configuration
│       └── level/
│           ├── LevelScene.ts       # Main game scene
│           ├── logic/              # Game managers
│           │   ├── CharacterManager.ts
│           │   ├── EnvironmentManager.ts
│           │   ├── ObjectivesManager.ts
│           │   ├── ResourceUtil.ts
│           │   ├── Timeline.ts
│           │   ├── TimelineManager.ts
│           │   └── UIManager.ts
│           └── model/              # Game entities
│               ├── actions/        # Action classes
│               ├── character/      # Character class
│               ├── common/         # Base entity classes
│               └── environment/    # Environment objects
└── vite/                   # Vite configuration
```

## Creating Levels

Levels are defined as JSON files in `public/assets/data/campaign{N}/level{N}.json`:

```json
{
    "character": {
        "position": { "x": 100, "y": 400 },
        "texture": "swordsmanClassic",
        "animations": [...]
    },
    "environment": [...],
    "collectibles": [...],
    "enemies": [...],
    "objectives": {
        "mainObjective": {
            "type": "position",
            "text": "Reach the goal",
            "data": { "x": 900 }
        }
    }
}
```

## License

MIT License - see [LICENSE](LICENSE) for details.
