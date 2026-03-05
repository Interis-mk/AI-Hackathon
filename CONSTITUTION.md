# AI Arena Constitution

## 🎮 RENDERING ARCHITECTURE - READ FIRST

**THIS IS A 2D GAME - NOT 3D**

- **Rendering Engine:** HTML5 Canvas 2D API
- **Game File:** `src/game2d.ts` (ACTIVE)
- **Rendering File:** `src/rendering.ts` (ACTIVE)
- **Perspective:** Top-down 2D view
- **Camera:** 2D follow camera with zoom

**DO NOT:**
- ❌ Use BabylonJS, Three.js, or any 3D libraries
- ❌ Reference `game.ts` or `rendering3d.ts` (deprecated 3D files)
- ❌ Implement 3D coordinates (x, y, z) - use 2D (x, y) only
- ❌ Use 3D concepts like meshes, quaternions, or 3D vectors

**ALWAYS:**
- ✅ Use Canvas 2D API for all rendering
- ✅ Work with `game2d.ts` for game logic
- ✅ Use 2D coordinates and 2D vector math
- ✅ Think top-down arcade shooter, not first-person shooter

---

## Project Charter

**AI Arena** is a web-based arena shooter hackathon project designed to demonstrate AI-driven game design. Players engage in a fast-paced combat simulation where waves of malfunctioning drones must be disabled, while collecting and combining AI-generated abilities for a dynamic, replayable experience.

### 🏃 Hackathon Philosophy

**SHIP FAST, DOCUMENT NEVER**

This is a **hackathon project** optimized for:
- ✅ **Working demos** that can be played immediately
- ✅ **Rapid iteration** with minimal overhead
- ✅ **Code-first approach** - let the code speak
- ✅ **Show, don't tell** - playable > readable
- ❌ **NO formal documentation required**
- ❌ **NO extensive comments** unless truly needed
- ❌ **NO project management overhead**

**The best documentation is a working game.**

---

## Core Mission

To deliver a **playable demo** where visitors can:
- Play a short arena session (2–5 minutes)
- Experience AI dynamically generating new abilities
- Watch enemies mutate in real-time
- Experiment with ability combinations

The focus is demonstrating how **multiple AI systems (ChatGPT, Gemini, Claude) actively shape the game experience**.

---

## Project Values

### 1. **AI-Driven Gameplay**
Every gameplay element must demonstrate AI participation:
- Abilities are generated, not hard-coded
- Enemy mutations are AI-determined
- Event descriptions are AI-narrated
- Ability combinations are AI-balanced

### 2. **Playability Over Perfection**
- The demo must be functional and engaging
- Quality of experience takes priority over feature completeness
- Each session should last 2–5 minutes for open day visitors

### 3. **Narrative Clarity**
- Enemies are **disabled**, not killed (ethical framing)
- Training simulation aesthetic (not warfare)
- Futuristic, neon sci-fi visual identity

### 4. **Rapid Experimentation (Hackathon Speed)**
- All gameplay systems must be data-driven (JSON format)
- AI systems must be pluggable and replaceable
- Easy iteration on ability stats and mechanics
- **NO DOCUMENTATION REQUIRED** - Code should be self-explanatory
- Focus on working demos, not written explanations
- Comments only when logic is non-obvious
- Git commits are the history, not docs

---

## Technical Architecture

### Core Technology Stack

| Technology | Purpose                |
|-----------|------------------------|
| TypeScript | Type-safe game logic   |
| HTML5 Canvas | **2D rendering (NOT 3D)** |
| Vite       | Fast development build |
| JSON       | All game data format   |

**CRITICAL: This is a 2D top-down arena shooter using HTML5 Canvas 2D rendering. Do NOT use BabylonJS, Three.js, or any 3D rendering libraries. All rendering is done via Canvas 2D API.**

### AI Integration

| AI System | Responsibility                  | Data Output |
|-----------|--------------------------------|-------------|
| ChatGPT   | Ability generation & balancing | Ability JSON |
| Gemini    | Enemy mutations & wave modifiers | Mutation JSON |
| Claude    | Event descriptions & lore flavor | Event text |

### Project Structure Requirements

```
src/
├── game2d.ts            # Main 2D game manager (ACTIVE - USE THIS)
├── rendering.ts         # 2D Canvas rendering system (ACTIVE)
├── player/              # Player character, movement, shooting
├── enemies/             # Drone types, behaviors, mutations
├── abilities/           # Ability system, passive/active effects
├── waves/               # Wave spawning, difficulty scaling
└── systems/             # XP, leveling, progression

DEPRECATED FILES (DO NOT USE):
├── game.ts              # Old 3D version - DO NOT USE OR MODIFY
└── rendering3d.ts       # Old 3D rendering - DO NOT USE
```

**Implementation Notes:**
- All game logic is in `game2d.ts`
- All rendering uses `rendering.ts` (2D Canvas SceneManager)
- Player position is in 2D coordinates (x, y)
- Camera follows player in 2D world space
- Mouse aiming uses screen-to-world coordinate conversion

### 2D Rendering Implementation Guide

**Coordinate System:**
- World space: Large 2D arena (e.g., 1600x1200)
- Screen space: Canvas viewport (e.g., 800x600)
- Camera transforms world coordinates to screen coordinates
- Mouse input converts screen coordinates back to world coordinates

**Core Rendering Functions (rendering.ts):**
```typescript
// Camera control
updateCamera(targetX: number, targetY: number): void
screenToWorld(screenX: number, screenY: number): { x: number; y: number }

// Drawing primitives
drawCircle(x: number, y: number, radius: number, color: string): void
drawRect(x: number, y: number, width: number, height: number, color: string): void
drawHealthBar(x: number, y: number, health: number, maxHealth: number): void

// Rendering pipeline
beginWorldRender(): void  // Apply camera transform
endWorldRender(): void    // Reset transform
```

**Game Entities (game2d.ts):**
- Player: Circle with direction indicator
- Enemies: Colored circles with health bars
- Projectiles: Small rectangles or circles
- All entities have 2D position: `{ x: number, y: number, z: 0 }`

**Mouse Aiming:**
1. Get mouse screen position from event
2. Convert to world position using `screenToWorld()`
3. Calculate direction from player to mouse cursor
4. Normalize direction vector
5. Apply to projectile velocity

---

## Gameplay Mechanics

### Core Loop

1. **Arena Entry** → Player spawns in combat simulation
2. **Wave Spawning** → Drones spawn in increasing waves
3. **Engagement** → Player disables drones with weapons/abilities
4. **Progression** → XP gained from drone disablement
5. **Level Up** → New abilities unlocked at milestones
6. **Combination** → Player can merge abilities for new effects
7. **AI Generation** → System generates new ability variants
8. **Difficulty Escalation** → Waves become harder
9. **Session End** → Player defeat triggers game over

**Session Duration:** 2–5 minutes (optimized for demo engagement)

### Enemy System

#### Basic Drones
Standard enemies spawning in early waves:
- Scout Drone (fast, low damage)
- Pulse Drone (medium speed, energy attacks)
- Swarm Drone (appears in groups)

#### Elite Drones
Stronger variants with AI-generated modifiers:
- Shield Drone (reduced damage taken)
- Phase Drone (movement evasion)
- Overclocked Drone (increased speed/damage)
- Regenerating Drone (health recovery)

**Mutation Rules:**
- AI generates new modifiers dynamically
- Modifiers appear as JSON-defined stat changes
- Example: `Frenzied` mutation increases speed but reduces durability

### Ability System

#### Passive Abilities
Permanent stat enhancements applied on acquisition:
- Increased energy/HP
- Faster fire rate
- Increased projectile speed
- XP boost
- Faster cooldowns

**Format:**
```
Name: Overclock
Type: Passive
+15% fire rate
+10% reload speed
```

#### Active Abilities
Triggered abilities with cooldown timers:
- Energy Pulse
- Gravity Field
- Drone EMP
- Plasma Burst
- Energy Shield

**Format:**
```
Name: Shock Pulse
Type: Active
Damage: 25
Cooldown: 12 seconds
Effect: Releases electrical wave that disables nearby drones
```

#### Ability JSON Specification

All abilities must conform to this JSON structure:
```json
{
  "name": "string",
  "type": "active" | "passive",
  "damage": number,
  "effects": ["string", "string"],
  "cooldown": number,
  "description": "string"
}
```

**Additional fields for passive abilities:**
- `statBoosts`: { "fireRate": number, "hp": number, ... }

### Ability Combination System

#### Merge Mechanics
- Players can combine two abilities into one
- Maximum **4 consecutive merge cycles** per session
- AI determines resulting stats and effects
- New combined ability is generated as JSON

#### Example Combinations
```
Fire + Frost → Steam Burst
Electric + Gravity → Tesla Vortex
Shield + Aura → Energy Dome
```

#### Combination Rules
- Both source abilities are consumed
- New ability inherits merged element types
- Stats are AI-calculated and balanced
- Result is unique per playthrough

### Progression System

#### Experience (XP)
- Earned by disabling drones
- Different drone types award different XP amounts
- Accumulated until level threshold reached

#### Level Up
Grants one of the following:
- New ability (AI-generated)
- Passive stat upgrade
- Ability merge opportunity

#### Player Stats
- Health/Energy pool
- Fire rate
- Projectile speed
- Active ability cooldowns
- Combination level (tracks merges performed)

### Crate System

Crates spawn randomly in the arena containing:
- New abilities (AI-generated)
- Passive upgrades (+stat buffs)
- Temporary buffs (time-limited enhancements)
- AI-generated special effects

**Rules:**
- Crates appear during active waves
- Limited crate spawns per session
- Contents are randomized but balanced

---

## Visual Identity

### Aesthetic
Clean futuristic training simulation:
- **Color Palette:** Neon highlights, red/blue accents
- **Environment:** Grid-based arena floor with holographic appearance
- **Enemies:** Circular drone representations with colored glows
- **Effects:** Bright, energetic ability visualizations

### Rendering Requirements (2D Canvas)
- All graphics rendered via HTML5 Canvas 2D API
- Circles for player and enemies
- Rectangles/shapes for projectiles
- Canvas drawing primitives (arc, rect, line, fillText)
- Color-based visual feedback for damage/disablement
- Simple but clear 2D visual effects

---

## Interaction Design

### UI Components

**HUD Elements:**
- Player health/energy bar
- Current XP and level indicator
- Active abilities with cooldown displays
- Current score/wave counter
- AI event notifications

**Menu Systems:**
- Start menu with game description
- Pause menu
- Game over screen with final score
- Ability combination interface (drag-and-drop)

### Input Methods (2D Controls)
- **Keyboard:** Movement (WASD), ability triggers (1-4 keys)
- **Mouse:** Aiming (cursor position), shooting (click)
- **UI buttons:** Menu navigation, ability merging
- **Camera:** Automatically follows player in 2D space

---

## Development Workflow

### Task Allocation

**Kevin (Game Engine & Rendering)**
- HTML5 Canvas 2D setup and rendering system
- Arena scene creation (2D top-down view)
- Player movement (2D WASD controls)
- Camera follow system (2D world space)
- Mouse aiming and shooting mechanics (screen-to-world conversion)
- Enemy rendering (2D circles with colors)
- Collision detection (2D distance checks)
- Basic UI implementation (HTML overlays)
- Wave visualization (2D spawning)
- Simple 2D visual effects
- Ability merge UI

**Julien (Game Systems & Data)**
- Ability JSON format specification
- XP and level-up systems
- Ability system implementation
- Passive ability effects
- Active ability triggers
- Wave difficulty scaling
- Elite enemy modifiers
- Crate spawning and contents
- Ability merge logic
- AI API integration (ChatGPT, Gemini, Claude)
- AI prompt engineering
- Leaderboard implementation
- Session timing

### Priority Hierarchy

1. **Priority 1 — Core Playable Game** (MVP)
   - Playable demo with basic drone elimination
   - Ability acquisition on level-up
   - Simple UI feedback

2. **Priority 2 — Wave System**
   - Multiple enemy types with unique behaviors
   - Difficulty scaling
   - Elite drone modifiers
   - Crate spawning system

3. **Priority 3 — Ability Combination**
   - Merge UI implementation
   - Combination logic
   - AI-generated combined ability stats

4. **Priority 4 — AI Integration**
   - ChatGPT ability generation API
   - Gemini enemy mutation API
   - Claude event description API
   - UI for displaying AI-generated content

5. **Priority 5 — Polish**
   - Particle effects and visual improvements
   - Sound effects
   - UI refinement
   - Leaderboard and session timer
   - Ability balancing
   - AI-generated narrative messages

### Stretch Goals
- Boss drone encounters
- Procedurally generated arena layouts
- Extended ability combination system
- Replay/recording system
- Multiplayer prototype

---

## Data Standards

### Ability Format

All abilities stored as JSON objects with mandatory fields:
- `name` (string): Display name
- `type` (string): "active" or "passive"
- `damage` (number): Damage value (0 for passive-only)
- `effects` (array): Element types affecting ability behavior
- `cooldown` (number): Cooldown in seconds (0 for passive)
- `description` (string): Player-facing description

### Enemy Format

Enemy types stored as JSON with:
- `id` (string): Unique identifier
- `name` (string): Display name
- `health` (number): Base HP
- `speed` (number): Movement speed
- `damage` (number): Damage per hit
- `xpReward` (number): XP granted on defeat
- `modifiers` (array): Applicable mutation modifiers

### Mutation Format

Modifiers stored as JSON with:
- `name` (string): Mutation name
- `effects` (object): Stat modifications
- `description` (string): Effect explanation

Example:
```json
{
  "name": "Frenzied",
  "effects": {
    "speedMultiplier": 1.3,
    "durabilityMultiplier": 0.7
  },
  "description": "Drones move faster but have reduced durability."
}
```

---

## Success Criteria

### MVP Requirements
- [ ] Player can move and aim in arena
- [ ] Drones spawn and move toward player
- [ ] Shooting mechanic disables drones
- [ ] XP system grants experience
- [ ] Level-up triggers ability acquisition
- [ ] Basic UI displays health and score
- [ ] Game ends on player defeat

### Demonstration Goals
- [ ] AI generates at least one new ability per playthrough
- [ ] Enemy mutations appear visually distinct
- [ ] Ability combinations produce new effects
- [ ] Session completes in 2–5 minutes
- [ ] Visitors can quickly understand mechanics

### Quality Metrics
- **Playability:** Game is stable and bug-free for demo duration
- **Clarity:** Visual and UI feedback is immediately understandable
- **Engagement:** Core gameplay loop feels responsive and rewarding
- **Innovation:** AI contributions are noticeable and impactful

---

## Communication Guidelines

### Decision Making
- Feature scope decisions prioritize demo completeness
- Technical decisions favor performance and rapid iteration
- Trade-offs communicated verbally or in git commits (no formal docs)

### Status Updates (Minimal Overhead)
- Quick syncs on progress against priorities
- Blockers communicated immediately
- Git commits are the history

### Code Standards (Hackathon Mode)
- TypeScript strict mode enforced
- JSON schemas validated for all game data
- Comments only for complex/non-obvious logic
- Consistent naming conventions (camelCase for variables, PascalCase for classes)
- **Code over comments** - Self-explanatory code preferred
- **Working demos over documentation** - Show, don't write

---

## Constraints & Assumptions

### Technical Constraints
- Single-player only (multiplayer is stretch goal)
- Web-based deployment (no mobile optimization required)
- Real-time performance target: 60 FPS
- API rate limiting on AI services (graceful degradation required)

### Design Assumptions
- Players have basic familiarity with arena shooters
- Open day audience has 2–5 minute engagement window
- Visitors prefer shorter, complete experience over longer, incomplete one
- AI-generated content is imperfect but entertaining

### Scope Boundaries
- No persistent progression between sessions
- No complex tutorials (game teaches itself)
- No online multiplayer features
- No extensive lore/story cinematics

---

## Glossary

| Term | Definition |
|------|-----------|
| **Arena** | The main playable area where combat occurs |
| **Drone** | Enemy unit representing malfunctioning machines |
| **Ability** | Player-controlled power that damages or affects drones |
| **Merge** | Combining two abilities into a new one |
| **Modifier** | AI-generated stat change applied to drones or abilities |
| **Passive** | Always-active stat boost ability |
| **Active** | Triggered ability with cooldown timer |
| **XP** | Experience points earned by disabling drones |
| **Level Up** | Progression milestone granting new abilities/stats |
| **Crate** | Spawned collectible containing abilities or upgrades |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 5, 2026 | Project Charter | Initial constitution from README |

**Last Updated:** March 5, 2026
**Status:** Active Development
**Approval:** Hackathon Project Owners (Kevin & Julien)

