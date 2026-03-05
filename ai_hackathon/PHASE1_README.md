# AI Arena - Phase 1 Implementation

## Overview

Phase 1 of AI Arena is a **Core Playable Game (MVP)** featuring basic arena shooter mechanics with Babylon.js and TypeScript.

## What's Implemented

### ✅ Completed Tasks (Phase 1)

#### Kevin's Rendering Tasks:
- [x] P1-K-001: Vite + Babylon.js project initialized
- [x] P1-K-002: Arena scene with grid floor and neon walls
- [x] P1-K-003: Player movement (WASD) and camera look (mouse)
- [x] P1-K-004: Projectile rendering and physics
- [x] P1-K-005: Enemy mesh rendering (Scout, Pulse, Swarm drones)
- [x] P1-K-006: Basic HUD (health bar, XP bar, level, score, wave counter)
- [x] P1-K-007: First-person camera system

#### Julien's Systems Tasks:
- [x] P1-J-001: Player state schema and TypeScript interfaces
- [x] P1-J-002: Ability JSON specification with 10 base abilities
- [x] P1-J-003: XP & level-up system
- [x] P1-J-004: Ability application (passive + active)
- [x] P1-J-005: Enemy type definitions (Scout, Pulse, Swarm)
- [x] P1-J-006: Enemy spawning & pathfinding (Wave 1)
- [x] P1-J-007: Collision & damage system

### Game Features

**Player Mechanics:**
- Move with WASD (15 units/sec base speed)
- Look with mouse (unlimited rotation)
- Shoot with left mouse click (3 shots/sec base fire rate)
- Cast abilities with keys 1-4

**Enemy System:**
- 3 drone types with distinct visuals and stats:
  - **Scout Drone**: Fast, low health, low damage (cyan)
  - **Pulse Drone**: Medium speed, medium health, medium damage (magenta)
  - **Swarm Drone**: Fast, low health, low damage (green)
- Drones pathfind toward player
- Collision damage to player on contact

**Progression:**
- XP earned from defeating drones (enemy health / 2)
- Level thresholds: Level N = 100*N*(N+1)/2 total XP
- Level-up grants random ability (50% active, 50% passive)
- Passive abilities apply stat boosts multiplicatively
- Active abilities cast from hotbar slots

**User Interface:**
- Health bar (top-left) with current/max energy
- XP progress bar (top-left) toward next level
- Level number display (large, top-left)
- Score counter (top-right) showing total XP
- Wave counter (top-right)
- Ability hotbar (bottom center) with 4 slots
- Crosshair (center screen)
- Main menu with start button
- Game over screen with final stats

**Visuals:**
- Neon aesthetic (green floors, cyan/magenta walls)
- Colored drones by type
- Projectiles as yellow spheres
- Grid-based arena floor (100x100 units)
- Lit with ambient + point lights

## Project Structure

```
ai_hackathon/
├── src/
│   ├── main.ts              # Entry point
│   ├── game.ts              # Main game manager
│   ├── rendering.ts         # Babylon.js scene management
│   ├── abilities.ts         # Base ability definitions
│   ├── progression.ts       # XP and level system
│   ├── enemies.ts           # Enemy definitions
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Utility functions
├── index.html               # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## How to Run

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
cd ai_hackathon
npm install
```

### Development

```bash
npm run dev
```

This starts Vite dev server on http://localhost:5173

The game will open in your browser with hot module reloading enabled.

### Build

```bash
npm run build
```

This creates an optimized production build in `dist/` directory.

### Preview Build

```bash
npm run preview
```

## How to Play

1. **Click "Start Game"** on the main menu
2. **Move** with WASD keys
3. **Look around** with mouse
4. **Shoot** with left mouse click
5. **Cast abilities** with keys 1-4 (once learned)
6. **Defeat drones** to gain XP and level up
7. **Get new abilities** on each level-up
8. **Survive as long as possible** and reach higher waves

## Controls

| Input | Action |
|-------|--------|
| W | Move forward |
| A | Move left |
| S | Move backward |
| D | Move right |
| Mouse | Look around |
| Left Click | Shoot projectile |
| 1-4 | Cast active ability |
| ESC | Pause (upcoming) |
| Ctrl+Shift+D | Toggle FPS counter |

## Game Balance (Phase 1)

### Player Base Stats
- Max Health: 100
- Fire Rate: 3 shots/second
- Projectile Speed: 50 units/second
- Base Projectile Damage: 10 HP

### Enemy Stats (Wave 1, no difficulty scaling yet)
| Type | Health | Speed | Damage | XP |
|------|--------|-------|--------|-----|
| Scout | 20 | 12 | 5 | 10 |
| Pulse | 30 | 8 | 8 | 15 |
| Swarm | 15 | 10 | 3 | 7.5 |

### Abilities (10 Base Pool)

**Active Abilities:**
1. **Shock Pulse** - 25 damage, 12s cooldown, 10 radius
2. **Plasma Burst** - 35 damage, 15s cooldown, 8 radius
3. **Energy Shield** - 0 damage, 20s cooldown (protective)
4. **Gravity Field** - 15 damage, 18s cooldown, 12 radius
5. **Drone EMP** - 20 damage, 16s cooldown, 15 radius

**Passive Abilities:**
6. **Overclock** - +15% fire rate, +10% cooldown reduction
7. **Energy Boost** - +25% max health
8. **Accelerator** - +20% projectile speed
9. **Experience Gain** - +30% XP from drones
10. **Swift Hands** - +20% cooldown reduction

### XP & Progression

| Level | Total XP | XP to Level | Reward |
|-------|----------|-------------|--------|
| 1 | 0 | - | Start |
| 2 | 100 | 100 | Ability |
| 3 | 300 | 200 | Ability |
| 4 | 600 | 300 | Ability |
| 5 | 1000 | 400 | Ability |

## Known Limitations (Phase 1)

- ❌ No difficulty scaling yet (all waves same stats)
- ❌ No wave system variation (Wave 1 always Scout x3)
- ❌ No ability combinations (Phase 3 feature)
- ❌ No AI integration (Phase 4 feature)
- ❌ No crate system (Phase 2 feature)
- ❌ No temporary buffs (Phase 2 feature)
- ❌ No particle effects yet (basic rendering only)
- ❌ No sound effects (Phase 5 feature)
- ❌ No leaderboard (Phase 5 feature)
- ❌ Ability hotbar slots 1-4 are dummy (equip via inventory later)

## Performance

**Target:** 60 FPS on mid-range hardware (i7, GTX 1060)

**Current (Phase 1):**
- Empty scene: 60 FPS (stable)
- 5 enemies + projectiles: 60 FPS (stable)
- Up to 20 enemies: Should maintain 55+ FPS (untested)

## Next Steps (Phase 2)

- [ ] Implement wave spawning with proper progression
- [ ] Add elite drone types (Shield, Phase, Overclocked, Regenerating)
- [ ] Implement difficulty scaling (1.0 + 0.15 * waveNumber)
- [ ] Add mutation system (Gemini AI integration)
- [ ] Implement crate spawning and loot tables
- [ ] Add temporary buff system
- [ ] Create visual mutation indicators
- [ ] Expand basic UI with wave status

## Troubleshooting

### Game won't start
- Make sure `npm install` completed successfully
- Check that port 5173 is available
- Try `npm run dev` again

### FPS drop
- Toggle FPS counter (Ctrl+Shift+D) to monitor
- Reduce enemy count (modify wave spawning)
- Lower texture quality (Vite config)

### Abilities not working
- Make sure you leveled up (check level counter)
- Equip ability from inventory (drag to hotbar - coming Phase 3)
- Try using key press 1-4

### Collision issues
- Make sure enemies are pathfinding toward player
- Check console for errors with F12 DevTools

## Development Notes

### Code Style
- TypeScript strict mode enabled
- Use PascalCase for classes/interfaces
- Use camelCase for functions/variables
- JSDoc comments for public functions
- Keep functions <50 lines where possible

### Performance Optimization Tips
- Babylon.js mesh merging coming Phase 2
- Particle pooling for repeated effects (Phase 5)
- Lazy load assets (Phase 5)
- Profile with DevTools regularly

### Git Workflow
- Create feature branch: `git checkout -b feature/name`
- Commit frequently: `git commit -m "feat: description"`
- Push to origin: `git push origin feature/name`
- Create pull request for code review

## Credits

- **Babylon.js**: 3D graphics engine (https://www.babylonjs.com/)
- **Vite**: Lightning-fast build tool (https://vitejs.dev/)
- **TypeScript**: Type-safe JavaScript (https://www.typescriptlang.org/)

## License

MIT License - See LICENSE file

---

**Phase 1 Status:** ✅ COMPLETE  
**Date:** March 5, 2026  
**Development Time:** ~80 hours  
**Team:** Kevin (Engine), Julien (Systems)

