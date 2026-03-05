# AI Arena Constitution

## Project Charter

**AI Arena** is a web-based arena shooter hackathon project designed to demonstrate AI-driven game design. Players engage in a fast-paced combat simulation where waves of malfunctioning drones must be disabled, while collecting and combining AI-generated abilities for a dynamic, replayable experience.

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

### 4. **Rapid Experimentation**
- All gameplay systems must be data-driven (JSON format)
- AI systems must be pluggable and replaceable
- Easy iteration on ability stats and mechanics

---

## Technical Architecture

### Core Technology Stack

| Technology | Purpose                |
|-----------|------------------------|
| TypeScript | Type-safe game logic   |
| Babylon.js | 3D rendering & physics |
| Vite       | Fast development build |
| JSON       | All game data format   |

### AI Integration

| AI System | Responsibility                  | Data Output |
|-----------|--------------------------------|-------------|
| ChatGPT   | Ability generation & balancing | Ability JSON |
| Gemini    | Enemy mutations & wave modifiers | Mutation JSON |
| Claude    | Event descriptions & lore flavor | Event text |

### Project Structure Requirements

```
src/
├── game/
│   ├── player/          # Player character, movement, shooting
│   ├── enemies/         # Drone types, behaviors, mutations
│   ├── abilities/       # Ability system, passive/active effects
│   ├── waves/           # Wave spawning, difficulty scaling
│   └── systems/         # XP, leveling, progression
│
├── ai/
│   ├── chatgpt/         # Ability generation service
│   ├── gemini/          # Enemy mutation service
│   └── claude/          # Event description service
│
├── rendering/
│   └── babylon/         # Babylon.js scene, camera, effects
│
└── main.ts              # Entry point
```

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
- **Enemies:** Holographic drone representations
- **Effects:** Bright, energetic ability visualizations

### Rendering Requirements
- All 3D assets rendered via Babylon.js
- Particle effects for ability impacts
- Clear visual feedback for damage/disablement
- UI elements with neon styling

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

### Input Methods
- Keyboard: Movement (WASD), shooting, ability triggers
- Mouse: Camera control, ability selection
- UI buttons: Menu navigation, ability merging

---

## Development Workflow

### Task Allocation

**Kevin (Game Engine & Rendering)**
- Babylon.js project setup
- Arena scene creation
- Player movement and camera systems
- Basic shooting mechanics
- Enemy rendering and spawning
- Collision detection
- Basic UI implementation
- Wave visualization
- Particle effects and visuals
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
- Trade-offs explicitly document when features are deferred

### Status Updates
- Weekly sync on progress against priorities
- Daily async updates in task management system
- Transparent communication about blockers

### Code Standards
- TypeScript strict mode enforced
- JSON schemas validated for all game data
- Comments required for non-obvious logic
- Consistent naming conventions (camelCase for variables, PascalCase for classes)

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

