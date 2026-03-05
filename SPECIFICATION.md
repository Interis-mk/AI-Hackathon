# AI Arena — Baseline Technical Specification

**Project:** AI Arena - AI-Driven Wave Shooter  
**Version:** 1.0  
**Date:** March 5, 2026  
**Status:** Active Development  
**Owners:** Kevin (Engine), Julien (Systems)

---

## 1. Executive Summary

**AI Arena** is a web-based arena shooter demonstrating AI-driven game design. Players navigate a high-tech combat simulator, disabling waves of malfunctioning drones while collecting AI-generated abilities and experimenting with ability combinations.

The core innovation is **real-time AI integration** where ChatGPT, Gemini, and Claude actively generate gameplay content (abilities, enemy mutations, event descriptions), making each playthrough unique.

**Target Runtime:** 2–5 minutes per session  
**Target Audience:** Open day visitors (casual, unfamiliar with project)  
**Deployment:** Web-based (browser)

---

## 2. Functional Requirements

### 2.1 Player Movement & Camera

**Requirement:** Player must move freely in the arena and control camera perspective.

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.1.1 | WASD Movement | Move forward (W), backward (S), left strafe (A), right strafe (D) |
| FR-2.1.2 | Mouse Look | Mouse controls camera rotation (pitch/yaw) |
| FR-2.1.3 | Collision Detection | Player cannot walk through arena walls or environmental obstacles |
| FR-2.1.4 | Camera Bounds | Camera stays within arena bounds; no clipping outside playable area |
| FR-2.1.5 | Movement Speed | Base movement speed: 15 units/second, scalable via abilities |

**Acceptance Criteria:**
- Player can move in all directions smoothly
- Camera follows player movement correctly
- No collision glitches or clipping
- Movement feels responsive (minimal input lag)

---

### 2.2 Combat Mechanics

**Requirement:** Player must be able to engage enemies with basic shooting and abilities.

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.2.1 | Basic Shooting | Left mouse click fires projectile in camera direction |
| FR-2.2.2 | Projectile Behavior | Projectiles travel in straight line, disappear on impact or after 20 seconds |
| FR-2.2.3 | Fire Rate | Base fire rate: 3 shots/second, scalable via abilities |
| FR-2.2.4 | Projectile Damage | Base projectile damage: 10 HP per hit |
| FR-2.2.5 | Active Ability Trigger | Number keys (1-4) trigger equipped active abilities |
| FR-2.2.6 | Ability Cooldown | Active abilities have cooldown timers before reuse |
| FR-2.2.7 | Energy System | Player has energy pool (HP equivalent) starting at 100 |
| FR-2.2.8 | Damage Feedback | Visual/audio feedback when player takes damage |

**Acceptance Criteria:**
- Projectiles spawn correctly and travel as expected
- Collision with enemies registers consistently
- Cooldown system prevents ability spam
- Player health decreases on enemy hit
- Game ends when player health reaches 0

---

### 2.3 Enemy System

**Requirement:** Enemies (drones) spawn in waves and exhibit distinct behaviors.

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.3.1 | Basic Drone | Scout Drone - fast, low damage (health: 20, speed: 12, damage: 5) |
| FR-2.3.2 | Basic Drone | Pulse Drone - medium speed, energy attacks (health: 30, speed: 8, damage: 8) |
| FR-2.3.3 | Basic Drone | Swarm Drone - appears in groups (health: 15, speed: 10, damage: 3) |
| FR-2.3.4 | Elite Drone | Shield Drone - reduced damage taken (health: 40, speed: 6, damage: 10, defense: 0.7x) |
| FR-2.3.5 | Elite Drone | Phase Drone - movement evasion (health: 25, speed: 14, damage: 7, evasion: 30% chance) |
| FR-2.3.6 | Elite Drone | Overclocked Drone - increased stats (health: 35, speed: 10, damage: 12) |
| FR-2.3.7 | Elite Drone | Regenerating Drone - health recovery (health: 30, speed: 8, damage: 8, regen: 2 HP/sec) |
| FR-2.3.8 | AI Mutations | Gemini generates new drone modifiers dynamically |
| FR-2.3.9 | Enemy Targeting | Drones pathfind toward player position |
| FR-2.3.10 | Collision | Drones collide with each other and arena obstacles |

**Acceptance Criteria:**
- Each drone type spawns with correct stats
- Drones move toward player predictably
- Damage calculations apply correctly
- Mutations modify drone behavior visibly
- Drones are disabled (removed) when health reaches 0

---

### 2.4 Wave System

**Requirement:** Enemies spawn in structured waves with increasing difficulty.

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.4.1 | Wave Structure | Waves spawn sequentially, each containing multiple drones |
| FR-2.4.2 | Wave Delay | 5-second delay between wave completions before next wave spawns |
| FR-2.4.3 | Difficulty Scaling | Wave number multiplies base enemy stats (wave N = 1.0 + 0.15 * N) |
| FR-2.4.4 | Enemy Variety | Later waves introduce elite drones and AI-generated modifiers |
| FR-2.4.5 | Wave Counter | UI displays current wave number |
| FR-2.4.6 | Wave Progression | Game continues indefinitely until player defeat |

**Wave Spawn Quantities:**
```
Wave 1: 3x Scout Drone
Wave 2: 2x Pulse Drone + 1x Scout Drone
Wave 3: 2x Swarm Drone + 1x Shield Drone
Wave 4+: Mixed elite drones + AI-generated modifiers
```

**Acceptance Criteria:**
- Waves spawn on schedule
- Enemy count and type match specifications
- Difficulty increases noticeably between waves
- Wave counter displays correctly

---

### 2.5 Progression System

**Requirement:** Player gains XP and levels up, unlocking new abilities.

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.5.1 | XP Gain | Disabling a drone grants XP equal to enemy base health / 2 |
| FR-2.5.2 | XP Display | UI shows current XP and progress toward next level |
| FR-2.5.3 | Level Threshold | Level N requires 100 * N total XP to reach |
| FR-2.5.4 | Level Up Event | On level up, player receives ability/upgrade reward |
| FR-2.5.5 | Level Cap | No artificial level cap (scales indefinitely) |
| FR-2.5.6 | XP Counter | UI tracks total XP earned |

**XP Examples:**
```
Scout Drone (health: 20) → 10 XP
Pulse Drone (health: 30) → 15 XP
Shield Drone (health: 40) → 20 XP
```

**Level Requirements:**
```
Level 1: 0 XP (start)
Level 2: 100 XP
Level 3: 300 XP total
Level 4: 600 XP total
Level N: 100*N*(N+1)/2 XP total
```

**Acceptance Criteria:**
- XP calculations are correct
- Level thresholds trigger at correct XP values
- Level up events fire and grant rewards
- UI displays current progress accurately

---

### 2.6 Ability System

**Requirement:** Players acquire abilities that modify stats or trigger special effects.

#### 2.6.1 Passive Abilities

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.6.1.1 | Passive Effect | Applied immediately upon acquisition, always active |
| FR-2.6.1.2 | Stat Types | Can boost: fireRate, projectileSpeed, maxEnergy, xpBoost, cooldownReduction |
| FR-2.6.1.3 | Stacking | Multiple passive abilities stack multiplicatively (e.g., 1.1x * 1.15x = 1.265x) |
| FR-2.6.1.4 | UI Display | Passive abilities shown in inventory with stat bonuses |

**Example Passive:**
```json
{
  "name": "Overclock",
  "type": "passive",
  "statBoosts": {
    "fireRate": 1.15,
    "cooldownReduction": 1.1
  },
  "description": "+15% fire rate, +10% cooldown reduction"
}
```

#### 2.6.2 Active Abilities

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.6.2.1 | Trigger | Activated via number key (1-4) press |
| FR-2.6.2.2 | Cooldown | Each ability has individual cooldown timer |
| FR-2.6.2.3 | Area Effect | Abilities affect enemies within defined radius |
| FR-2.6.2.4 | Damage | Ability damage applies on hit; scales with player stats |
| FR-2.6.2.5 | Effects | May apply status (stun, slow, burn) or movement (knockback, pull) |
| FR-2.6.2.6 | UI Display | Active abilities shown in hotbar with cooldown timer |
| FR-2.6.2.7 | Max Equipped | Player can equip maximum 4 active abilities at once |

**Example Active:**
```json
{
  "name": "Shock Pulse",
  "type": "active",
  "damage": 25,
  "effects": ["electric", "stun"],
  "cooldown": 12,
  "radius": 10,
  "description": "Releases electrical wave that stuns nearby drones"
}
```

#### 2.6.3 Ability Acquisition

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.6.3.1 | Level Up Reward | On level up, player receives one ability (50% active, 50% passive) |
| FR-2.6.3.2 | AI Generation | ChatGPT generates ability if not available in base pool |
| FR-2.6.3.3 | Ability Pool | Game maintains pool of ~20 base abilities + AI-generated variants |
| FR-2.6.3.4 | Duplicate Prevention | Acquired abilities added to inventory; duplicates increase power |
| FR-2.6.3.5 | Inventory Limit | No hard limit on inventory size |

**Acceptance Criteria:**
- Level up grants ability successfully
- Passive abilities apply stat bonuses
- Active abilities trigger and cooldown correctly
- Ability effects deal damage and apply status

---

### 2.7 Ability Combination System

**Requirement:** Players can merge two abilities into a new one.

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.7.1 | Merge Trigger | UI button or hotkey initiates merge mode |
| FR-2.7.2 | Ability Selection | Player selects two abilities from inventory via drag-and-drop |
| FR-2.7.3 | Merge Validation | Both abilities must be different types (not duplicates) |
| FR-2.7.4 | AI Merge Logic | Claude/ChatGPT generates merged ability stats and effects |
| FR-2.7.5 | Result Generation | New ability stored as JSON and added to inventory |
| FR-2.7.6 | Source Consumption | Both source abilities are removed from inventory |
| FR-2.7.7 | Merge Limit | Maximum 4 consecutive merges per session |
| FR-2.7.8 | Merge Counter | UI tracks merges used |
| FR-2.7.9 | Merge UI Feedback | Visual confirmation of merge result |

**Merge Rules:**
```
Input: Ability A + Ability B
Process:
  1. Extract element types from both abilities
  2. Combine effects array
  3. AI calculates merged stats (damage, cooldown, etc.)
  4. Generate unique ability name based on elements
  5. Return new ability JSON

Output: New Ability JSON
```

**Example Merge:**
```
Input:
  "Fire Burst" (fire, damage: 20)
  "Frost Shield" (ice, defense boost)

Output:
  "Steam Eruption" (fire+ice, damage: 28, effects: ["steam", "slow"])
```

**Acceptance Criteria:**
- Drag-and-drop UI works smoothly
- Merge validation prevents invalid combinations
- AI generates unique results
- New ability stats are balanced
- Source abilities are consumed correctly
- Merge counter increments

---

### 2.8 Crate System

**Requirement:** Collectible crates spawn in arena with random rewards.

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.8.1 | Crate Spawn | Crates appear randomly during waves (20% spawn rate per wave) |
| FR-2.8.2 | Crate Lifetime | Crate exists for 30 seconds before disappearing |
| FR-2.8.3 | Crate Contents | Random selection: ability, stat upgrade, or temporary buff |
| FR-2.8.4 | Crate Pickup | Player collision with crate triggers pickup; visual feedback |
| FR-2.8.5 | AI Generation | Crate contents may include AI-generated abilities |
| FR-2.8.6 | Spawn Location | Crates spawn at random arena location, not on player/enemies |

**Crate Loot Table:**
```
50% - New ability (base pool or AI-generated)
30% - Stat upgrade (+10% to fireRate, projectileSpeed, or maxEnergy)
20% - Temporary buff (2x damage for 15 seconds)
```

**Acceptance Criteria:**
- Crates spawn on schedule
- Pickup detection works reliably
- Rewards apply correctly
- Temporary buffs expire after duration

---

### 2.9 User Interface

**Requirement:** UI provides clear feedback on game state and player actions.

#### 2.9.1 HUD (Heads-Up Display)

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.9.1.1 | Health Bar | Shows current energy / max energy (top-left) |
| FR-2.9.1.2 | XP Bar | Shows current XP / XP to next level (below health bar) |
| FR-2.9.1.3 | Level Display | Shows current level number |
| FR-2.9.1.4 | Score Counter | Shows total XP earned this session (top-right) |
| FR-2.9.1.5 | Wave Counter | Shows current wave number |
| FR-2.9.1.6 | Ability Hotbar | Shows 4 active ability slots with cooldown timers |
| FR-2.9.1.7 | Crosshair | Center-screen targeting reticle |
| FR-2.9.1.8 | Damage Numbers | Floating text showing damage dealt (optional) |
| FR-2.9.1.9 | AI Event Notifications | Toast notifications for AI-generated events (top-center) |

#### 2.9.2 Menus

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.9.2.1 | Start Menu | Title, description, start button, settings button |
| FR-2.9.2.2 | Pause Menu | Resume, settings, quit buttons (accessible via ESC) |
| FR-2.9.2.3 | Game Over Screen | Final score, wave reached, ability count, restart/menu buttons |
| FR-2.9.2.4 | Ability Merge UI | Drag-and-drop interface with merge preview and confirm button |
| FR-2.9.2.5 | Settings Menu | Volume, resolution, sensitivity adjustment |

#### 2.9.3 Visual Feedback

| ID | Requirement | Details |
|----|-------------|---------|
| FR-2.9.3.1 | Hit Feedback | Enemy flashes red on damage |
| FR-2.9.3.2 | Enemy Disable | Enemy disappears/dissolves on defeat |
| FR-2.9.3.3 | Ability Cast | Visual effect at cast point (particle burst, glow, etc.) |
| FR-2.9.3.4 | Level Up | Screen flash, sound effect, ability acquired notification |
| FR-2.9.3.5 | Crate Pickup | Pickup glow effect, item appear animation |
| FR-2.9.3.6 | Status Effects | Visual indicators for active buffs/debuffs on player/enemies |

**Acceptance Criteria:**
- HUD displays accurate information
- All menus are navigable
- Visual feedback is clear and immediate
- No UI clipping or overlap issues

---

### 2.10 Game States

**Requirement:** Game state machine manages progression through game phases.

| State | Transitions | Actions |
|-------|-----------|---------|
| **Menu** | → Playing | Initialize game, hide menu |
| **Playing** | → Paused, GameOver | Update enemies, player, abilities |
| **Paused** | → Playing, Menu | Freeze game, show pause menu |
| **GameOver** | → Menu, Playing (restart) | Calculate final score, show results |

---

## 3. AI Integration Requirements

### 3.1 ChatGPT Integration

**Purpose:** Generate new abilities dynamically

| ID | Requirement | Details |
|----|-------------|---------|
| FR-3.1.1 | Ability Generation | On level up, request new ability from ChatGPT |
| FR-3.1.2 | Ability Merging | On merge, request merged ability stats from ChatGPT |
| FR-3.1.3 | Prompt Format | Send ability generation prompt with context (player level, existing abilities, theme) |
| FR-3.1.4 | Response Format | Expect JSON response conforming to ability schema |
| FR-3.1.5 | Fallback Behavior | Use base ability pool if API fails or rate-limited |
| FR-3.1.6 | Caching | Cache generated abilities to reduce API calls |

**Example Prompt:**
```
Generate a new game ability with these parameters:
- Player Level: 5
- Theme: Electric + Fire (merged abilities)
- Type: Active
- Cooldown: 8-15 seconds
- Damage Range: 20-40

Return valid JSON matching this schema:
{
  "name": "string",
  "type": "active",
  "damage": number,
  "effects": ["string"],
  "cooldown": number,
  "description": "string"
}
```

### 3.2 Gemini Integration

**Purpose:** Generate enemy mutations

| ID | Requirement | Details |
|----|-------------|---------|
| FR-3.2.1 | Mutation Generation | Request new drone modifier from Gemini each wave (30% chance) |
| FR-3.2.2 | Mutation Format | Expect JSON with name, stat multipliers, description |
| FR-3.2.3 | Balanced Stats | Mutations should not exceed 2.0x stat multipliers |
| FR-3.2.4 | Visual Feedback | Mutated drones display visual indicator (aura, color, etc.) |
| FR-3.2.5 | Fallback Pool | Use pre-defined mutations if API unavailable |

**Example Mutation JSON:**
```json
{
  "name": "Frenzied",
  "effects": {
    "speedMultiplier": 1.3,
    "durabilityMultiplier": 0.7
  },
  "description": "Drones move faster but have reduced durability"
}
```

### 3.3 Claude Integration

**Purpose:** Generate event descriptions and flavor text

| ID | Requirement | Details |
|----|-------------|---------|
| FR-3.3.1 | Event Descriptions | Request flavor text for significant events (wave start, level up, ability unlock) |
| FR-3.3.2 | Tone | Descriptions maintain futuristic training simulation aesthetic |
| FR-3.3.3 | Length | Descriptions kept to 1-2 sentences for UI display |
| FR-3.3.4 | Display Format | Show as toast notification or battle log entry |

**Example Prompt:**
```
Write a short (1-2 sentence) flavor text for a wave of mutated drones.
Setting: Futuristic training simulation. Tone: Energetic and sci-fi.
Mutation: Frenzied (drones move faster)

Return plain text only.
```

### 3.4 AI Service Abstraction

**Requirement:** AI services must be abstracted to support multiple providers.

| ID | Requirement | Details |
|----|-------------|---------|
| FR-3.4.1 | Service Interface | Define common interface for all AI services |
| FR-3.4.2 | Error Handling | Graceful degradation if API fails (use fallback) |
| FR-3.4.3 | Rate Limiting | Queue requests to prevent API rate limit hits |
| FR-3.4.4 | Timeout | 10-second timeout on API requests |
| FR-3.4.5 | Logging | Log all API calls and responses for debugging |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Details |
|----|-------------|---------|
| NFR-4.1.1 | Frame Rate | Maintain 60 FPS during gameplay |
| NFR-4.1.2 | Load Time | Game loads in <3 seconds on standard hardware |
| NFR-4.1.3 | Memory | Game uses <500MB RAM during gameplay |
| NFR-4.1.4 | Enemy Count | Support 20+ enemies on screen simultaneously |
| NFR-4.1.5 | Particle Effects | Support up to 1000 particles on screen without FPS drop |

### 4.2 Compatibility

| ID | Requirement | Details |
|----|-------------|---------|
| NFR-4.2.1 | Browsers | Support Chrome, Firefox, Edge, Safari (latest versions) |
| NFR-4.2.2 | Resolution | Adapt to 1280x720 and above |
| NFR-4.2.3 | Input Devices | Support keyboard/mouse (no gamepad required) |
| NFR-4.2.4 | Accessibility | Contrast ratios meet WCAG AA standards |

### 4.3 Reliability

| ID | Requirement | Details |
|----|-------------|---------|
| NFR-4.3.1 | Stability | No crashes during 5-minute gameplay session |
| NFR-4.3.2 | Data Validation | All JSON data validated before use |
| NFR-4.3.3 | Error Recovery | Game recovers from API failures without crashing |

### 4.4 Security

| ID | Requirement | Details |
|----|-------------|---------|
| NFR-4.4.1 | API Keys | AI API keys not exposed in client code |
| NFR-4.4.2 | Input Validation | All player inputs sanitized |
| NFR-4.4.3 | HTTPS | Deployed over HTTPS only |

---

## 5. Data Formats

### 5.1 Ability Schema

```json
{
  "name": "string",
  "type": "active" | "passive",
  "damage": "number (0 for passive-only)",
  "effects": ["string (element types)"],
  "cooldown": "number (0 for passive)",
  "description": "string",
  "statBoosts": {
    "fireRate": "number (optional)",
    "projectileSpeed": "number (optional)",
    "maxEnergy": "number (optional)",
    "xpBoost": "number (optional)",
    "cooldownReduction": "number (optional)"
  }
}
```

### 5.2 Enemy Schema

```json
{
  "id": "string (unique)",
  "name": "string",
  "health": "number",
  "speed": "number",
  "damage": "number",
  "xpReward": "number",
  "modifiers": ["string (modifier IDs)"],
  "visuals": {
    "color": "string (hex)",
    "scale": "number"
  }
}
```

### 5.3 Mutation Schema

```json
{
  "name": "string",
  "effects": {
    "healthMultiplier": "number (optional)",
    "speedMultiplier": "number (optional)",
    "damageMultiplier": "number (optional)",
    "durabilityMultiplier": "number (optional)"
  },
  "description": "string"
}
```

### 5.4 Player State Schema

```json
{
  "level": "number",
  "xp": "number",
  "currentEnergy": "number",
  "maxEnergy": "number",
  "inventory": ["ability objects"],
  "equippedAbilities": ["ability objects (4 max)"],
  "activeBuffs": ["buff objects"],
  "mergesRemaining": "number",
  "stats": {
    "fireRate": "number",
    "projectileSpeed": "number",
    "cooldownReduction": "number"
  }
}
```

---

## 6. Technical Architecture

### 6.1 File Organization

```
src/
├── game/
│   ├── player/
│   │   ├── Player.ts          # Player character class
│   │   ├── PlayerController.ts # Input handling
│   │   ├── PlayerStats.ts      # Stat calculations
│   │   └── Inventory.ts        # Ability inventory management
│   │
│   ├── enemies/
│   │   ├── Enemy.ts            # Base enemy class
│   │   ├── EnemyTypes.ts       # Enemy type definitions
│   │   ├── EnemyBehavior.ts    # AI pathfinding, attacks
│   │   ├── EnemyMutations.ts   # Mutation application
│   │   └── EnemyManager.ts     # Enemy pool and lifecycle
│   │
│   ├── abilities/
│   │   ├── Ability.ts          # Base ability class
│   │   ├── PassiveAbility.ts   # Passive ability implementation
│   │   ├── ActiveAbility.ts    # Active ability implementation
│   │   ├── AbilityPool.ts      # Ability database
│   │   ├── AbilityMerge.ts     # Merge logic
│   │   └── AbilityEffects.ts   # Effect application (damage, stun, etc.)
│   │
│   ├── waves/
│   │   ├── WaveManager.ts      # Wave spawning logic
│   │   ├── WaveDefinitions.ts  # Wave configurations
│   │   └── DifficultyScaler.ts # Difficulty progression
│   │
│   ├── systems/
│   │   ├── XPSystem.ts         # XP and level calculations
│   │   ├── ProgressionSystem.ts # Level up logic
│   │   ├── CrateSystem.ts      # Crate spawning and rewards
│   │   └── GameState.ts        # Game state machine
│   │
│   └── GameManager.ts          # Main game coordinator
│
├── ai/
│   ├── AIService.ts            # Base AI service interface
│   ├── chatgpt/
│   │   ├── ChatGPTService.ts   # ChatGPT API integration
│   │   └── AbilityPrompts.ts   # ChatGPT prompts
│   │
│   ├── gemini/
│   │   ├── GeminiService.ts    # Gemini API integration
│   │   └── MutationPrompts.ts  # Gemini prompts
│   │
│   └── claude/
│       ├── ClaudeService.ts    # Claude API integration
│       └── EventPrompts.ts     # Claude prompts
│
├── rendering/
│   ├── babylon/
│   │   ├── Scene.ts            # Babylon.js scene setup
│   │   ├── Player.ts           # Player rendering
│   │   ├── Enemies.ts          # Enemy rendering
│   │   ├── Projectiles.ts      # Projectile rendering
│   │   ├── Effects.ts          # Particle effects, VFX
│   │   ├── Camera.ts           # Camera controller
│   │   └── UI.ts               # UI rendering
│   │
│   └── Assets.ts               # Asset loading and management
│
├── ui/
│   ├── HUD.ts                  # Heads-up display
│   ├── Menu.ts                 # Menu system
│   ├── AbilityUI.ts            # Ability display and merge UI
│   ├── NotificationSystem.ts   # Toast notifications
│   └── UIManager.ts            # UI coordinator
│
├── utils/
│   ├── Vector3.ts              # Math utilities
│   ├── JSONValidator.ts        # Schema validation
│   ├── Logger.ts               # Logging utilities
│   └── Config.ts               # Game configuration constants
│
└── main.ts                      # Application entry point
```

### 6.2 Dependencies

```json
{
  "dependencies": {
    "babylonjs": "^6.x",
    "babylonjs-loaders": "^6.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "@types/node": "^20.x"
  }
}
```

---

## 7. Acceptance Testing

### 7.1 Test Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Unit Tests** | Function correctness | XP calculations, ability merging, stat application |
| **Integration Tests** | System interaction | Ability cast → damage application → enemy defeat → XP gain |
| **Gameplay Tests** | Feel and balance | Movement responsiveness, ability cooldowns, difficulty curve |
| **AI Tests** | API integration | ChatGPT generation, Gemini mutations, fallback behavior |
| **UI Tests** | User experience | Menu navigation, HUD visibility, notification display |

### 7.2 Critical Test Cases

| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| T-1 | Player shoots enemy | Enemy health decreases, projectile disappears |
| T-2 | Enemy health reaches 0 | Enemy is disabled, player gains XP |
| T-3 | Player reaches level 2 | Ability acquired, level UI updates |
| T-4 | Ability merge attempt | New ability generated, source abilities removed |
| T-5 | Active ability used | Ability activates, cooldown timer starts |
| T-6 | Passive ability equipped | Player stats update, bonus applied |
| T-7 | Wave completes | Next wave spawns after 5 seconds |
| T-8 | Crate picked up | Reward applied, crate disappears |
| T-9 | Game over (0 health) | Game over screen shows final score |
| T-10 | AI API fails | Game uses fallback ability pool, continues |

---

## 8. Launch Checklist

- [ ] Game runs at 60 FPS
- [ ] All core gameplay mechanics functional
- [ ] Player can complete 2–5 minute session
- [ ] Abilities level up and are acquired
- [ ] Waves spawn and escalate difficulty
- [ ] At least one AI system (ChatGPT) generates content
- [ ] UI is clear and readable
- [ ] Sound effects play (if included)
- [ ] No crashes during 5-minute gameplay
- [ ] Open day demo ready
- [ ] README updated with instructions
- [ ] Build process documented

---

## 9. Glossary

| Term | Definition |
|------|-----------|
| **Arena** | The main playable 3D environment |
| **Drone** | Enemy unit representing malfunctioning machines |
| **Ability** | Player power affecting gameplay (damage, buffs, etc.) |
| **Passive** | Always-active stat boost |
| **Active** | Triggered ability with cooldown |
| **Merge** | Combining two abilities into one new ability |
| **Modifier** | AI-generated stat multiplier for enemies |
| **Mutation** | An enemy with applied modifiers |
| **XP** | Experience points earned from enemy defeat |
| **Level Up** | Achievement milestone granting rewards |
| **Crate** | Collectible item spawning random rewards |
| **Cooldown** | Time delay before ability can be reused |
| **Wave** | Group of enemies spawning in sequence |
| **Difficulty Scaling** | Increasing enemy stats as waves progress |

---

## 10. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | March 5, 2026 | Technical Lead | Initial specification from README |
| 1.0 | March 5, 2026 | Technical Lead | Final baseline specification |

---

**Document Status:** APPROVED FOR DEVELOPMENT  
**Next Review:** After Priority 1 completion

