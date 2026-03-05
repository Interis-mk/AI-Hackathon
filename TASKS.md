# AI Arena — Task Breakdown & Work Items

**Project:** AI Arena - AI-Driven Wave Shooter  
**Version:** 1.0  
**Date:** March 5, 2026  
**Generated From:** DEVELOPMENT_PLAN.md  
**Format:** Actionable work items organized by phase and assignee

---

## Overview

This document breaks down the development plan into granular, actionable tasks suitable for daily standup tracking and project management tools (GitHub Projects, Jira, Trello, etc.).

Each task includes:
- **Task ID:** Unique identifier (format: P#-K-### or P#-J-### for Kevin/Julien)
- **Title:** Clear, action-oriented task name
- **Description:** What needs to be done
- **Effort:** Story points or hours estimate
- **Dependencies:** Tasks that must be complete first
- **Acceptance Criteria:** How to verify completion
- **Status:** Ready, In Progress, Blocked, Complete

---

## Phase 1: Core Playable Game (MVP)

**Duration:** Weeks 1-2  
**Total Effort:** 80 hours (Kevin: 38h, Julien: 42h)  
**Goal:** Playable arena shooter with movement, shooting, XP, abilities

### Kevin's Phase 1 Tasks

#### P1-K-001: Initialize Vite Project with Babylon.js
- **Effort:** 8h
- **Dependencies:** None (Critical Path)
- **Status:** Ready
- **Description:**
  - Set up new Vite project with TypeScript configuration
  - Install Babylon.js 6.x and babylonjs-loaders dependencies
  - Configure WebGL canvas and rendering loop
  - Set up development server (npm run dev)
  - Create git repository and initial commit
- **Acceptance Criteria:**
  - [ ] Vite dev server runs without errors
  - [ ] Babylon.js renders a simple scene (blue background)
  - [ ] Hot module reload working
  - [ ] TypeScript strict mode enabled
  - [ ] Build process creates optimized bundle

#### P1-K-002: Create Arena Scene with Lighting
- **Effort:** 12h
- **Dependencies:** P1-K-001
- **Status:** Ready
- **Description:**
  - Design 100x100 unit arena floor with grid texture
  - Create neon-style arena walls (no collision yet)
  - Implement arena lighting (ambient + point lights)
  - Add futuristic skybox or background
  - Test camera placement and FOV
- **Acceptance Criteria:**
  - [ ] Arena visible and properly lit
  - [ ] Grid texture clearly visible on floor
  - [ ] Neon aesthetic matches concept
  - [ ] Skybox renders without artifacts
  - [ ] 60 FPS baseline achieved (empty scene)

#### P1-K-003: Implement Player Movement (WASD + Camera)
- **Effort:** 16h
- **Dependencies:** P1-K-002
- **Status:** Ready
- **Description:**
  - Implement WASD key input handling (W: forward, A: left, S: backward, D: right)
  - Create player character mesh (capsule/cylinder for now)
  - Implement smooth movement acceleration/deceleration
  - Add mouse look for camera control (pitch/yaw)
  - Clamp pitch to prevent camera flipping
  - Add collision detection with arena walls (simple AABB)
  - Test movement feels responsive and natural
- **Acceptance Criteria:**
  - [ ] Player moves at 15 units/sec base speed
  - [ ] Movement is smooth (no jitter)
  - [ ] Player cannot clip through walls
  - [ ] Camera follows player correctly
  - [ ] Mouse look is responsive (<50ms input lag)
  - [ ] Can move in all diagonal directions
  - [ ] No movement when no keys pressed

#### P1-K-004: Implement Projectile Rendering & Physics
- **Effort:** 8h
- **Dependencies:** P1-K-003
- **Status:** Ready
- **Description:**
  - Create simple projectile mesh (sphere or capsule)
  - Implement projectile spawning from player position in camera direction
  - Add straight-line trajectory movement
  - Implement despawn logic (after 20 seconds or on impact)
  - Add basic impact visual feedback (placeholder)
- **Acceptance Criteria:**
  - [ ] Projectile spawns on mouse click
  - [ ] Projectile travels in camera direction
  - [ ] Projectile disappears after 20 seconds
  - [ ] Multiple projectiles on screen simultaneously
  - [ ] No projectile collision with walls yet (pass through)

#### P1-K-005: Create Enemy Rendering (Scout, Pulse, Swarm)
- **Effort:** 12h
- **Dependencies:** P1-K-002
- **Status:** Ready
- **Description:**
  - Design Scout Drone mesh (small, fast) - neon blue color
  - Design Pulse Drone mesh (medium, energy) - neon purple color
  - Design Swarm Drone mesh (tiny, grouped) - neon cyan color
  - Implement drone material system for easy color/scale changes
  - Add health bar above each drone (simple quad)
  - Ensure drones spawn at random arena positions
- **Acceptance Criteria:**
  - [ ] All 3 drone types visually distinct
  - [ ] Neon color palette consistent
  - [ ] Health bars display correctly
  - [ ] Health bars update as health changes
  - [ ] Drones render without performance issues

#### P1-K-006: Implement Basic UI (HUD)
- **Effort:** 16h
- **Dependencies:** P1-K-002
- **Status:** Ready
- **Description:**
  - Create health bar (top-left corner)
  - Create XP progress bar (below health bar)
  - Add level display (large number, top-left)
  - Add score counter (top-right corner)
  - Add wave counter (top-right, below score)
  - Add crosshair (center of screen)
  - Use Babylon.js GUI or canvas-based rendering
  - Implement smooth bar animations (lerp to target)
- **Acceptance Criteria:**
  - [ ] Health bar shows correct values (current/max)
  - [ ] XP bar fills to next level threshold
  - [ ] Level number updates on level-up
  - [ ] Score counter increments with XP gain
  - [ ] All UI elements readable (white on dark background)
  - [ ] No UI overlap or clipping
  - [ ] UI persists during gameplay

#### P1-K-007: Implement First-Person Camera System
- **Effort:** 10h
- **Dependencies:** P1-K-003
- **Status:** Ready
- **Description:**
  - Refine camera position (slightly above player head)
  - Add camera bob on movement (subtle animation)
  - Add camera collision (keeps camera inside arena bounds)
  - Implement smooth camera transitions
  - Add optional mouse sensitivity setting (store in localStorage)
- **Acceptance Criteria:**
  - [ ] Camera position natural for first-person view
  - [ ] Subtle bob effect on movement
  - [ ] Camera never clips outside arena
  - [ ] Transitions are smooth (no jumps)
  - [ ] Mouse sensitivity adjustable

### Julien's Phase 1 Tasks

#### P1-J-001: Define Player State Schema & TypeScript Interfaces
- **Effort:** 6h
- **Dependencies:** None (Critical Path)
- **Status:** Ready
- **Description:**
  - Create TypeScript interfaces for Player, Ability, Enemy, GameState
  - Define Player object structure: level, xp, currentEnergy, maxEnergy, inventory, equippedAbilities, stats
  - Create enums for ability types (active, passive)
  - Add JSDoc comments for all fields
  - Create unit tests for schema validation
- **Acceptance Criteria:**
  - [ ] TypeScript interfaces compiled without errors
  - [ ] Player state can be serialized to JSON
  - [ ] All fields have proper types
  - [ ] JSDoc comments complete
  - [ ] Unit tests verify schema structure

#### P1-J-002: Create Ability JSON Specification & Base Abilities
- **Effort:** 8h
- **Dependencies:** P1-J-001
- **Status:** Ready
- **Description:**
  - Define Ability schema (name, type, damage, effects, cooldown, description)
  - Create 10 base abilities with hardcoded JSON:
    - 5 active abilities (Shock Pulse, Plasma Burst, Energy Shield, Gravity Field, Drone EMP)
    - 5 passive abilities (Overclock, Energy Boost, Projectile Speed+, XP Boost, Cooldown Reduction)
  - Store in JSON file (abilities.json)
  - Implement ability loader (JSON parser)
  - Add ability validation function
- **Acceptance Criteria:**
  - [ ] All 10 base abilities defined in JSON
  - [ ] Ability schema matches SPECIFICATION.md
  - [ ] JSON validates against TypeScript schema
  - [ ] Abilities loadable from file at startup
  - [ ] All required fields present in each ability

#### P1-J-003: Implement XP & Level System
- **Effort:** 14h
- **Dependencies:** P1-J-002
- **Status:** Ready
- **Description:**
  - Implement XP gain calculation: xp = enemy.health / 2
  - Implement level threshold calculation: levelN = 100 * N * (N+1) / 2
  - Create levelUp() function (triggers when XP >= threshold)
  - Emit levelUp event with level number
  - Update player UI on XP change
  - Create unit tests for XP calculations
  - Verify formula: Level 1→2: 100 XP, Level 2→3: 200 XP, Level 3→4: 300 XP
- **Acceptance Criteria:**
  - [ ] XP calculation correct (verify Scout 20 HP = 10 XP)
  - [ ] Level thresholds match formula
  - [ ] Level-up event fires at correct XP
  - [ ] Player level increments on level-up
  - [ ] XP resets appropriately after level-up
  - [ ] Unit tests pass for multiple level progressions

#### P1-J-004: Implement Basic Ability Application System
- **Effort:** 12h
- **Dependencies:** P1-J-002, P1-J-003
- **Status:** Ready
- **Description:**
  - Create ability equip/unequip system
  - Implement passive ability stat application (multiplicative stacking)
  - Implement active ability triggering (keys 1-4)
  - Add cooldown timer system per ability
  - Create ability cast function with validation (check cooldown, mana, etc.)
  - Implement stat multiplier calculation
  - Test passive stacking: 1.1x * 1.15x = 1.265x
- **Acceptance Criteria:**
  - [ ] Passive abilities equip immediately
  - [ ] Stat multipliers apply correctly
  - [ ] Multiple passives stack multiplicatively
  - [ ] Active abilities trigger on key press
  - [ ] Cooldown prevents ability reuse during timer
  - [ ] Cooldown display updates in UI
  - [ ] Ability triggers only when not on cooldown

#### P1-J-005: Define Enemy Types (Scout, Pulse, Swarm)
- **Effort:** 10h
- **Dependencies:** P1-J-001
- **Status:** Ready
- **Description:**
  - Define Enemy schema (id, name, health, speed, damage, xpReward, visuals)
  - Create JSON definitions for 3 basic enemy types:
    - Scout Drone: health 20, speed 12, damage 5, xp 10
    - Pulse Drone: health 30, speed 8, damage 8, xp 15
    - Swarm Drone: health 15, speed 10, damage 3, xp 7.5
  - Store in enemies.json
  - Create enemy factory function (spawn enemy by type)
  - Add validation function
- **Acceptance Criteria:**
  - [ ] All 3 enemy types defined with correct stats
  - [ ] Enemy schema validates against TypeScript
  - [ ] Enemy factory creates instances correctly
  - [ ] All enemies spawn with correct health/speed/damage
  - [ ] XP rewards match specification

#### P1-J-006: Implement Basic Enemy Spawning & Pathfinding
- **Effort:** 12h
- **Dependencies:** P1-J-005
- **Status:** Ready
- **Description:**
  - Create Wave Manager class (manages spawning logic)
  - Implement Wave 1 spawning: 3x Scout Drones
  - Create enemy pathfinding (move toward player position)
  - Implement simple AABB collision between drones
  - Create enemy update loop (move, attack, health check)
  - Implement enemy defeat condition (health <= 0)
  - Test pathfinding with multiple drones
- **Acceptance Criteria:**
  - [ ] Wave 1 spawns 3 Scout Drones
  - [ ] Drones move toward player
  - [ ] Drones don't teleport or jitter
  - [ ] Multiple drones don't overlap (basic separation)
  - [ ] Drones attack player at close range
  - [ ] Drones removed when health = 0

#### P1-J-007: Implement Collision & Damage System
- **Effort:** 10h
- **Dependencies:** P1-J-006, P1-K-004
- **Status:** Ready
- **Description:**
  - Implement projectile-enemy collision detection
  - Create damage application function (reduce enemy health)
  - Implement enemy-player collision damage
  - Create health reduction events
  - Track damage dealt for scoring
  - Implement invulnerability frames (optional, 0.5s after hit)
  - Add visual feedback placeholder (enemy flashes)
- **Acceptance Criteria:**
  - [ ] Projectile hits enemy, health decreases
  - [ ] Projectile removed on impact
  - [ ] Enemy dies when health reaches 0
  - [ ] Enemy-player collision deals damage
  - [ ] Player health decreases from enemy hits
  - [ ] Damage values correct (Scout: 5 DMG)
  - [ ] No collision glitches or phantom hits

---

### Phase 1 Integration Points

#### P1-INTEGRATION-001: Connect Projectile System to Damage System
- **Effort:** 4h
- **Dependencies:** P1-K-004, P1-J-007
- **Status:** Ready
- **Description:**
  - Link projectile spawn to player controller
  - Implement collision detection between projectiles and drones
  - Trigger damage on collision
  - Remove projectile on hit
  - Update enemy health bar
- **Acceptance Criteria:**
  - [ ] Clicking fires projectile
  - [ ] Projectile hits drone
  - [ ] Drone health decreases
  - [ ] Projectile disappears

#### P1-INTEGRATION-002: Connect Enemy Spawning to Level System
- **Effort:** 4h
- **Dependencies:** P1-J-003, P1-J-006, P1-K-005
- **Status:** Ready
- **Description:**
  - Emit XP event on enemy defeat
  - Trigger level-up check
  - Display level-up notification
  - Grant ability on level-up (placeholder: random from base pool)
- **Acceptance Criteria:**
  - [ ] Enemy defeat grants XP
  - [ ] Level-up occurs at threshold
  - [ ] Ability acquired on level-up
  - [ ] UI updates reflect level change

#### P1-INTEGRATION-003: Connect UI to Game State
- **Effort:** 4h
- **Dependencies:** P1-K-006, P1-J-003, P1-J-004
- **Status:** Ready
- **Description:**
  - Bind health bar to player energy
  - Bind XP bar to player XP / threshold
  - Bind level display to player level
  - Bind score counter to total XP earned
  - Implement real-time UI updates
- **Acceptance Criteria:**
  - [ ] Health bar reflects current energy
  - [ ] XP bar shows progress to next level
  - [ ] Level display shows correct number
  - [ ] Score counter increments on XP gain

---

### Phase 1 Milestones & Sign-Off

**Milestone 1 (End of Week 1):**
- [ ] Babylon.js project initialized and running
- [ ] Arena scene with lighting renders correctly
- [ ] Player movement and camera working smoothly
- [ ] Scout Drone spawns and renders
- [ ] XP/level system implemented (no rewards yet)
- [ ] Basic UI displays (health, level, score)

**Milestone 2 (End of Week 2):**
- [ ] Projectiles spawn and travel correctly
- [ ] Projectiles damage enemies on collision
- [ ] Scout Drones defeated, removed from scene
- [ ] XP gained on enemy defeat
- [ ] Level-up grants passive ability
- [ ] Active ability casts on key press with cooldown
- [ ] 60 FPS maintained with 5+ drones

**Phase 1 Sign-Off Criteria:**
- [ ] Complete playable 2-minute session
- [ ] No crashes during 5-minute gameplay
- [ ] All success criteria from DEVELOPMENT_PLAN.md met
- [ ] Code reviewed and merged to main branch
- [ ] README updated with Phase 1 completion status

---

## Phase 2: Wave System & Enemy Variety

**Duration:** Weeks 3-4  
**Total Effort:** 70 hours (Kevin: 32h, Julien: 38h)  
**Goal:** Multiple enemy types, waves, difficulty scaling, crates

### Kevin's Phase 2 Tasks

#### P2-K-001: Create 6 Elite Enemy Model Variants
- **Effort:** 14h
- **Dependencies:** P1-K-005
- **Status:** Ready (After Phase 1)
- **Description:**
  - Design Pulse Drone mesh (medium, energy attacks) - neon purple
  - Design Swarm Drone mesh (tiny, grouped) - neon cyan
  - Design Shield Drone mesh (bulky, defensive) - neon green with glow
  - Design Phase Drone mesh (sleek, evasive) - neon blue with shimmer
  - Design Overclocked Drone mesh (aggressive, charged) - neon red/yellow
  - Design Regenerating Drone mesh (organic-looking) - neon green pulsing
  - Vary mesh complexity, scale, and color per type
  - Test rendering with all types on screen
- **Acceptance Criteria:**
  - [ ] All 6 drone types visually distinct
  - [ ] Colors match neon aesthetic
  - [ ] Special effects (shimmer, glow, pulse) visible
  - [ ] Performance acceptable (60 FPS with 20+ drones)

#### P2-K-002: Implement Mutation Visual Indicators
- **Effort:** 10h
- **Dependencies:** P2-K-001
- **Status:** Ready (After Phase 1)
- **Description:**
  - Create aura/glow effect for mutated drones
  - Add color tint overlay for mutation type
  - Implement stat display on drone (optional: damage number)
  - Create visual effect for mutation application
  - Test that mutations are immediately recognizable
- **Acceptance Criteria:**
  - [ ] Mutated drones have visual indicator
  - [ ] Aura color reflects mutation type
  - [ ] Indicator visible from distance
  - [ ] No performance impact

#### P2-K-003: Implement Wave Spawning Visualization
- **Effort:** 8h
- **Dependencies:** P2-K-001
- **Status:** Ready (After Phase 1)
- **Description:**
  - Create wave start animation (brief flash, sound)
  - Update wave counter prominently on screen
  - Add visual scaling hint (larger drones = harder wave)
  - Create wave completion animation
  - Add brief pause (0.5s) between waves
- **Acceptance Criteria:**
  - [ ] Wave counter updates visibly
  - [ ] Wave transition smooth and clear
  - [ ] Visual cues indicate difficulty increase

#### P2-K-004: Build Particle Effects Foundation
- **Effort:** 12h
- **Dependencies:** P1-K-002
- **Status:** Ready (After Phase 1)
- **Description:**
  - Create particle system base class with pooling
  - Implement particle emitter with configurable properties
  - Create impact particles (spark burst on projectile hit)
  - Create projectile trail (optional)
  - Test particle performance (up to 1000 particles)
  - Implement color fade and lifetime management
- **Acceptance Criteria:**
  - [ ] Particles emit from correct position
  - [ ] Particles have proper lifetime
  - [ ] Color fades appropriately
  - [ ] Pooling reduces garbage collection
  - [ ] 1000 particles on screen maintains 60 FPS

#### P2-K-005: Implement Crate Rendering & Animation
- **Effort:** 8h
- **Dependencies:** P1-K-002
- **Status:** Ready (After Phase 1)
- **Description:**
  - Design crate model (cubic/box shape, glowing edges)
  - Implement crate spawn animation (scale-up, glow)
  - Add rotating glow effect (continuous)
  - Implement pickup animation (float to player, fadeout)
  - Create pickup particle burst
- **Acceptance Criteria:**
  - [ ] Crates render with distinctive appearance
  - [ ] Spawn animation smooth and clear
  - [ ] Rotating glow effect smooth
  - [ ] Pickup animation satisfying

---

### Julien's Phase 2 Tasks

#### P2-J-001: Define Elite Enemy Type Definitions
- **Effort:** 10h
- **Dependencies:** P1-J-005
- **Status:** Ready (After Phase 1)
- **Description:**
  - Define Shield Drone (health: 40, speed: 6, damage: 10, defense: 0.7x)
  - Define Phase Drone (health: 25, speed: 14, damage: 7, evasion: 30%)
  - Define Overclocked Drone (health: 35, speed: 10, damage: 12)
  - Define Regenerating Drone (health: 30, speed: 8, damage: 8, regen: 2 HP/s)
  - Add defense and evasion mechanics to damage calculation
  - Create enemy factory for all 7 types (3 basic + 4 elite)
- **Acceptance Criteria:**
  - [ ] All 4 elite types defined in JSON
  - [ ] Stats match specification
  - [ ] Evasion mechanic works (30% chance to dodge)
  - [ ] Defense multiplier reduces damage (0.7x = 30% reduction)
  - [ ] Regeneration adds 2 HP/s to health

#### P2-J-002: Implement Difficulty Scaling Logic
- **Effort:** 12h
- **Dependencies:** P2-J-001
- **Status:** Ready (After Phase 1)
- **Description:**
  - Create difficulty multiplier formula: 1.0 + 0.15 * (WaveNumber - 1)
  - Apply multiplier to all enemy stats (health, speed, damage)
  - Verify calculations: Wave 1 = 1.0x, Wave 5 = 1.6x, Wave 10 = 2.35x
  - Create unit tests for multiplier formula
  - Store current wave number in game state
- **Acceptance Criteria:**
  - [ ] Difficulty multiplier calculated correctly
  - [ ] Multiplier applied to spawned enemies
  - [ ] Wave 5 enemies have 1.6x stats (verified)
  - [ ] Progression feels balanced (not too easy or hard)

#### P2-J-003: Implement Mutation System
- **Effort:** 14h
- **Dependencies:** P2-J-002
- **Status:** Ready (After Phase 1)
- **Description:**
  - Define mutation schema (name, effects object with multipliers, description)
  - Create base mutation pool: Frenzied, Shielded, Regenerative, Overcharged
  - Frenzied: speedMultiplier 1.3, durabilityMultiplier 0.7
  - Shielded: damageReductionMultiplier 0.6 (40% less damage)
  - Regenerative: regenRate 5 HP/s (doubled)
  - Overcharged: damageMultiplier 1.4, speedMultiplier 0.8
  - Create applyMutation() function
  - Validate multipliers don't exceed 2.0x total
- **Acceptance Criteria:**
  - [ ] All mutations defined in JSON
  - [ ] Mutation effects applied correctly
  - [ ] Frenzied drone visibly faster
  - [ ] No multiplier exceeds 2.0x
  - [ ] Mutations balanced and testable

#### P2-J-004: Implement Wave Manager
- **Effort:** 16h
- **Dependencies:** P2-J-001, P2-J-002, P2-J-003
- **Status:** Ready (After Phase 1)
- **Description:**
  - Create WaveManager class with structured spawning
  - Define wave configurations (enemy types + counts):
    - Wave 1: 3x Scout
    - Wave 2: 2x Pulse + 1x Scout
    - Wave 3: 2x Swarm + 1x Shield
    - Wave 4+: Mixed (2x random + 1x random, increasing difficulty)
  - Implement spawn scheduling (all at once, or staggered)
  - Implement wave completion detection (all enemies defeated)
  - Implement 5-second delay between waves
  - Create unit tests for wave progression
- **Acceptance Criteria:**
  - [ ] Wave 1 spawns 3x Scout correctly
  - [ ] Wave 2 spawns 2x Pulse + 1x Scout
  - [ ] Wave 3 spawns 2x Swarm + 1x Shield
  - [ ] Wave completion detected automatically
  - [ ] 5-second delay before next wave
  - [ ] Wave counter accurate

#### P2-J-005: Implement Crate System
- **Effort:** 12h
- **Dependencies:** P1-J-004
- **Status:** Ready (After Phase 1)
- **Description:**
  - Implement crate spawn logic (20% chance per wave)
  - Create loot table (50% ability, 30% stat upgrade, 20% temp buff)
  - Define stat upgrade effects (+10% to fireRate, projectileSpeed, or maxEnergy)
  - Implement crate pickup detection (distance-based)
  - Apply reward to player inventory
  - Set crate lifetime (30 seconds, then despawn)
  - Create crate cleanup logic
- **Acceptance Criteria:**
  - [ ] Crates spawn roughly every 5 waves (20% * waves)
  - [ ] Loot table probabilities correct
  - [ ] Pickup detection reliable (no false positives/negatives)
  - [ ] Reward applies correctly to player
  - [ ] Crate despawns after 30 seconds
  - [ ] Multiple crates can exist simultaneously

#### P2-J-006: Implement Temporary Buff System
- **Effort:** 10h
- **Dependencies:** P2-J-005, P1-J-004
- **Status:** Ready (After Phase 1)
- **Description:**
  - Create Buff class (name, duration, stat modifier)
  - Implement temporary damage buff (2x damage for 15 seconds)
  - Create buff application (additive to player stats)
  - Implement buff timer and expiration
  - Create buff display in UI (icon + duration)
  - Support multiple concurrent buffs
- **Acceptance Criteria:**
  - [ ] Buff applies immediately on pickup
  - [ ] Buff duration is exactly 15 seconds
  - [ ] 2x damage multiplier verified in combat
  - [ ] Buff expires and removes modification
  - [ ] Multiple buffs stack correctly
  - [ ] UI shows active buffs

---

### Phase 2 Integration Points

#### P2-INTEGRATION-001: Connect Wave Manager to Difficulty Scaling
- **Effort:** 4h
- **Dependencies:** P2-J-002, P2-J-004
- **Status:** Ready (After Phase 1)
- **Description:**
  - Apply difficulty multiplier to each wave's enemies
  - Verify progression: Wave 1 = baseline, Wave 10 = 2.35x
  - Test gameplay balance across all waves
- **Acceptance Criteria:**
  - [ ] Difficulty increases per wave
  - [ ] Progression feels balanced
  - [ ] Wave 10 is noticeably harder than Wave 1

#### P2-INTEGRATION-002: Connect Mutations to Enemy Spawning
- **Effort:** 4h
- **Dependencies:** P2-J-003, P2-J-004
- **Status:** Ready (After Phase 1)
- **Description:**
  - Apply mutations to drones in Wave 3+
  - Verify mutation stats apply correctly
  - Test visual indicators
- **Acceptance Criteria:**
  - [ ] Mutations appear in Wave 3+
  - [ ] Mutation effects visible in gameplay
  - [ ] Visual indicators show mutation type

#### P2-INTEGRATION-003: Connect Crate Rewards to Player Inventory
- **Effort:** 3h
- **Dependencies:** P2-J-005, P1-J-004
- **Status:** Ready (After Phase 1)
- **Description:**
  - Add crate reward logic to player inventory
  - Verify ability pickup works
  - Verify stat upgrade applies
- **Acceptance Criteria:**
  - [ ] Crate pickup adds ability to inventory
  - [ ] Stat upgrade applies to player
  - [ ] Reward feedback clear to player

---

### Phase 2 Milestones & Sign-Off

**Milestone 1 (End of Week 3):**
- [ ] All 6 elite enemy models rendering
- [ ] Difficulty scaling logic complete
- [ ] Mutation system functional
- [ ] Wave Manager spawning Waves 1-3
- [ ] Particle effects emitting on impact
- [ ] Visual mutation indicators working

**Milestone 2 (End of Week 4):**
- [ ] Crate system spawning and rewarding
- [ ] Temporary buffs apply and expire correctly
- [ ] 5-minute session reaches Wave 8+
- [ ] All visuals readable and distinct
- [ ] Performance: 60 FPS with 20+ drones
- [ ] No crashes or major bugs

**Phase 2 Sign-Off Criteria:**
- [ ] Complete playable progressive difficulty experience
- [ ] All Phase 2 tasks completed
- [ ] Integration points verified
- [ ] Code reviewed and merged
- [ ] README updated with Phase 2 status

---

## Phase 3: Ability Combination System

**Duration:** Weeks 5-6  
**Total Effort:** 65 hours (Kevin: 34h, Julien: 31h)  
**Goal:** Drag-and-drop merge UI, AI-powered ability generation

### Kevin's Phase 3 Tasks

#### P3-K-001: Implement Drag-and-Drop Merge UI
- **Effort:** 16h
- **Dependencies:** P1-K-006
- **Status:** Ready (After Phase 2)
- **Description:**
  - Design merge UI layout (two ability slots + preview + confirm button)
  - Implement drag-and-drop for ability selection
  - Show merge preview (new ability name, stats, effects)
  - Add confirmation dialog
  - Implement merge cancellation
  - Test on multiple browsers (Chrome, Firefox, Edge, Safari)
- **Acceptance Criteria:**
  - [ ] Drag-and-drop responds smoothly (<100ms)
  - [ ] Both abilities selectable via drag
  - [ ] Preview shows accurate merged stats
  - [ ] Confirm button triggers merge
  - [ ] Works on all target browsers
  - [ ] No lag or freezing

#### P3-K-002: Implement Merge Confirmation Animation
- **Effort:** 8h
- **Dependencies:** P3-K-001
- **Status:** Ready (After Phase 2)
- **Description:**
  - Create merge confirmation animation (particle burst at center)
  - Add screen flash effect (brief white flash)
  - Play success sound (placeholder or royalty-free)
  - Display merged ability notification
  - Animate notification appearance and disappearance
- **Acceptance Criteria:**
  - [ ] Merge animation triggers on confirmation
  - [ ] Particle effects look satisfying
  - [ ] Sound provides feedback
  - [ ] Notification displays new ability name

#### P3-K-003: Enhance Ability Hotbar with Icons
- **Effort:** 10h
- **Dependencies:** P1-K-006
- **Status:** Ready (After Phase 2)
- **Description:**
  - Design ability icons (small, recognizable)
  - Display icons on hotbar (slots 1-4)
  - Add cooldown ring around icon (circular progress)
  - Implement equip/unequip UI (drag from inventory to hotbar)
  - Show ability tooltip on hover
  - Display current cooldown timer as text
- **Acceptance Criteria:**
  - [ ] Icons display correctly
  - [ ] Cooldown ring updates smoothly
  - [ ] Tooltip shows ability name + cooldown
  - [ ] Equip/unequip works via drag
  - [ ] No performance impact

#### P3-K-004: Implement Toast Notification System
- **Effort:** 10h
- **Dependencies:** P1-K-006
- **Status:** Ready (After Phase 2)
- **Description:**
  - Create toast notification component (small popup message)
  - Implement auto-dismiss after 3 seconds
  - Support multiple notifications (stack without overlap)
  - Add animation (slide in from top, fade out)
  - Create notification for: level-up, ability acquired, crate pickup, merge result
  - Support long text wrapping
- **Acceptance Criteria:**
  - [ ] Notifications display clearly
  - [ ] Auto-dismiss works correctly
  - [ ] Multiple notifications don't overlap
  - [ ] Animations smooth
  - [ ] Text wraps appropriately
  - [ ] Max 3 notifications on screen

---

### Julien's Phase 3 Tasks

#### P3-J-001: Implement Merge Logic Framework
- **Effort:** 12h
- **Dependencies:** P1-J-004
- **Status:** Ready (After Phase 2)
- **Description:**
  - Create MergeSystem class with merge validation
  - Validate inputs (both abilities selected, different types)
  - Combine effects arrays (remove duplicates)
  - Remove source abilities from inventory
  - Create newAbility object structure
  - Implement merge counter (0-4 per session)
  - Track merges performed
- **Acceptance Criteria:**
  - [ ] Merge validation works correctly
  - [ ] Invalid merges blocked (duplicate types)
  - [ ] Source abilities removed
  - [ ] Effects array combined properly
  - [ ] Merge counter accurate (0-4)

#### P3-J-002: Expand Base Ability Pool to 20+
- **Effort:** 8h
- **Dependencies:** P1-J-002
- **Status:** Ready (After Phase 2)
- **Description:**
  - Expand from 10 to 20+ base abilities
  - Add variety of element types: fire, ice, electric, gravity, nature, light, dark
  - Create active + passive variants for each element
  - Add to abilities.json
  - Verify each ability has complete stats
  - Balance damage/cooldown across all abilities
- **Acceptance Criteria:**
  - [ ] 20+ abilities defined
  - [ ] Multiple element types represented
  - [ ] All abilities have complete stats
  - [ ] JSON validates without errors
  - [ ] Balance check: no ability overpowered

#### P3-J-003: Implement Merged Ability Generation (Mock AI)
- **Effort:** 16h
- **Dependencies:** P3-J-001, P3-J-002
- **Status:** Ready (After Phase 2)
- **Description:**
  - Create deterministic merge formula:
    - Damage = (damage1 + damage2) / 2 + 10
    - Cooldown = min(cooldown1, cooldown2) + 2
    - Effects = effects1 + effects2 (no duplicates)
  - Generate ability name from element combination (Fire + Ice = "Steam Eruption")
  - Use element type lookup table for naming
  - Create merged ability JSON matching schema
  - Test formula with various ability combinations
- **Acceptance Criteria:**
  - [ ] Merge formula produces balanced stats
  - [ ] Damage values reasonable (not overpowered)
  - [ ] Cooldown values reasonable (not too long)
  - [ ] Generated name reflects elements
  - [ ] Merged ability schema valid
  - [ ] Formula verified with unit tests

#### P3-J-004: Implement Merge Counter & Limits
- **Effort:** 6h
- **Dependencies:** P3-J-001
- **Status:** Ready (After Phase 2)
- **Description:**
  - Track merges performed per session
  - Display merge counter in UI (e.g., "3/4 merges remaining")
  - Block merge when counter = 0
  - Show "no merges remaining" message
  - Reset counter on new session
- **Acceptance Criteria:**
  - [ ] Counter displays correctly
  - [ ] Merge blocked at 0 remaining
  - [ ] Warning message shown when blocked
  - [ ] Counter updates after each merge

#### P3-J-005: Prepare ChatGPT Integration (Prompts & Structure)
- **Effort:** 12h
- **Dependencies:** P3-J-003
- **Status:** Ready (After Phase 2)
- **Description:**
  - Design ChatGPT prompt template for ability generation
  - Create prompt with context (player level, existing abilities, element theme)
  - Design prompt for merge ability generation
  - Create request/response structures
  - Implement async API call handler
  - Add 10-second timeout logic
  - Create fallback to mock generation if API unavailable
  - Document API integration plan
- **Acceptance Criteria:**
  - [ ] Prompt template clear and complete
  - [ ] Request structure defined
  - [ ] Expected response format documented
  - [ ] Timeout logic implemented
  - [ ] Fallback mechanism ready

#### P3-J-006: Implement Ability Caching System
- **Effort:** 8h
- **Dependencies:** P3-J-005
- **Status:** Ready (After Phase 2)
- **Description:**
  - Create in-memory cache for generated abilities
  - Use prompt as cache key
  - Store generated ability JSON
  - Implement cache hit verification (same prompt = same output)
  - Add cache expiration (optional: 1 hour TTL)
  - Log cache hit rate for performance analysis
- **Acceptance Criteria:**
  - [ ] Cache stores abilities correctly
  - [ ] Identical prompts return cached results
  - [ ] Cache reduces API calls
  - [ ] Hit rate logged and visible

---

### Phase 3 Integration Points

#### P3-INTEGRATION-001: Connect Merge UI to Merge System
- **Effort:** 4h
- **Dependencies:** P3-K-001, P3-J-001
- **Status:** Ready (After Phase 2)
- **Description:**
  - Link drag-and-drop selections to merge system
  - Trigger merge on confirmation
  - Display merge result in preview
- **Acceptance Criteria:**
  - [ ] UI selections pass to merge system
  - [ ] Merge result accurate
  - [ ] UI reflects result

#### P3-INTEGRATION-002: Connect Merge Animation to Generation
- **Effort:** 3h
- **Dependencies:** P3-K-002, P3-J-003
- **Status:** Ready (After Phase 2)
- **Description:**
  - Trigger confirmation animation on merge
  - Display generated ability name in animation
  - Add to inventory after merge
- **Acceptance Criteria:**
  - [ ] Animation shows correct name
  - [ ] Ability added to inventory
  - [ ] Source abilities removed

#### P3-INTEGRATION-003: Connect Hotbar to Active Abilities
- **Effort:** 3h
- **Dependencies:** P3-K-003, P1-J-004
- **Status:** Ready (After Phase 2)
- **Description:**
  - Equip active abilities to hotbar
  - Cast from hotbar triggers ability
  - Cooldown updates hotbar display
- **Acceptance Criteria:**
  - [ ] Abilities equip to hotbar
  - [ ] Hotbar ability cast works
  - [ ] Cooldown displays correctly

---

### Phase 3 Milestones & Sign-Off

**Milestone 1 (End of Week 5):**
- [ ] Drag-and-drop merge UI fully functional
- [ ] Mock merge formula generating abilities
- [ ] Merge counter displays and enforces limit
- [ ] Toast notification system working
- [ ] Hotbar enhanced with icons and cooldown rings

**Milestone 2 (End of Week 6):**
- [ ] ChatGPT API integration prepared (not live yet)
- [ ] Real ChatGPT-generated abilities working (with fallback)
- [ ] Caching prevents duplicate API calls
- [ ] 4 consecutive merges possible without issues
- [ ] Merged abilities balanced vs. base abilities

**Phase 3 Sign-Off Criteria:**
- [ ] Full merge system operational
- [ ] UI responsive and intuitive
- [ ] ChatGPT integration ready for Phase 4
- [ ] All integration points verified
- [ ] Code reviewed and merged
- [ ] README updated with Phase 3 status

---

## Phase 4: Full AI Integration

**Duration:** Weeks 7-8  
**Total Effort:** 75 hours (Kevin: 24h, Julien: 51h)  
**Goal:** ChatGPT, Gemini, Claude integration with fallbacks

### Kevin's Phase 4 Tasks

#### P4-K-001: Implement AI Event Toast Notifications
- **Effort:** 10h
- **Dependencies:** P3-K-004
- **Status:** Ready (After Phase 3)
- **Description:**
  - Enhance toast system for long text (AI-generated descriptions)
  - Support styled notifications (different colors for different event types)
  - Implement text wrapping for multi-line descriptions
  - Add icons/emojis for event types (wave icon, ability icon, etc.)
  - Test notification readability
- **Acceptance Criteria:**
  - [ ] Long AI descriptions display correctly
  - [ ] Text wraps appropriately
  - [ ] Icons render clearly
  - [ ] Notifications dismiss on schedule
  - [ ] No text clipping

#### P4-K-002: Implement Enemy Mutation Animation
- **Effort:** 8h
- **Dependencies:** P2-K-002
- **Status:** Ready (After Phase 3)
- **Description:**
  - Add visual transition when mutation applies (glow burst, stat display)
  - Show mutation name briefly above drone
  - Animate stat change visualization
  - Play subtle sound effect (optional)
- **Acceptance Criteria:**
  - [ ] Mutation effect triggers on spawn
  - [ ] Glow burst visual clear
  - [ ] Mutation name readable
  - [ ] Animation smooth and quick

#### P4-K-003: Implement Performance Monitoring UI
- **Effort:** 6h
- **Dependencies:** P1-K-006
- **Status:** Ready (After Phase 3)
- **Description:**
  - Add frame rate counter (FPS display, top-right corner, debug mode)
  - Optional: memory usage monitor
  - Toggle with dev key (e.g., Ctrl+Shift+D)
  - Display in small, non-intrusive corner
- **Acceptance Criteria:**
  - [ ] FPS counter accurate
  - [ ] Displays only in debug mode
  - [ ] No performance impact
  - [ ] Easy to toggle on/off

---

### Julien's Phase 4 Tasks

#### P4-J-001: Implement ChatGPT Service
- **Effort:** 14h
- **Dependencies:** P3-J-005
- **Status:** Ready (After Phase 3)
- **Description:**
  - Create ChatGPTService class with OpenAI API wrapper
  - Implement error handling (network errors, API errors, timeouts)
  - Add timeout logic (10 seconds max)
  - Implement retry logic (up to 2 retries on timeout)
  - Create ability generation method with context parameters
  - Create merge ability generation method
  - Validate response JSON against ability schema
  - Add comprehensive logging
  - Cache generated abilities to reduce API calls
- **Acceptance Criteria:**
  - [ ] API requests successful
  - [ ] Response JSON valid and matches schema
  - [ ] Timeout after 10 seconds
  - [ ] Fallback triggered on API error
  - [ ] Retry logic works (up to 2 retries)
  - [ ] Logging complete and accessible
  - [ ] Cache prevents duplicate requests

#### P4-J-002: Implement Gemini Service
- **Effort:** 14h
- **Dependencies:** P2-J-003
- **Status:** Ready (After Phase 3)
- **Description:**
  - Create GeminiService class with Google API wrapper
  - Implement mutation generation request
  - Trigger mutation generation every 3 waves (30% chance per wave)
  - Create mutation generation prompts with game context
  - Validate stat multipliers (max 2.0x)
  - Validate response JSON against mutation schema
  - Handle API errors and timeouts gracefully
  - Cache generated mutations
  - Add logging for all requests
- **Acceptance Criteria:**
  - [ ] API requests successful
  - [ ] Mutation JSON valid and matches schema
  - [ ] Stat multipliers validated (<2.0x)
  - [ ] Mutations appear in Wave 3+ (30% chance)
  - [ ] Cache prevents duplicate requests
  - [ ] Error handling graceful
  - [ ] Logging complete

#### P4-J-003: Implement Claude Service
- **Effort:** 12h
- **Dependencies:** None (independent)
- **Status:** Ready (After Phase 3)
- **Description:**
  - Create ClaudeService class with Anthropic API wrapper
  - Implement event description generation
  - Support event types: wave start, level up, ability unlock, mutation appearance, game over
  - Create prompts for each event type with game context
  - Validate response length (1-2 sentences)
  - Maintain futuristic training simulation tone
  - Handle API errors gracefully
  - Cache descriptions by event type
  - Add logging for all requests
- **Acceptance Criteria:**
  - [ ] API requests successful
  - [ ] Descriptions are 1-2 sentences
  - [ ] Tone matches futuristic setting
  - [ ] Descriptions contextually appropriate
  - [ ] Error handling graceful
  - [ ] Cache prevents duplicate requests
  - [ ] Logging complete

#### P4-J-004: Implement Comprehensive Error Handling & Fallback
- **Effort:** 10h
- **Dependencies:** P4-J-001, P4-J-002, P4-J-003
- **Status:** Ready (After Phase 3)
- **Description:**
  - Create global error handler for all AI services
  - Handle network errors (offline, no connection)
  - Handle timeouts (>10 seconds per request)
  - Handle invalid JSON responses
  - Create fallback ability pool (20+ pre-generated abilities)
  - Create fallback mutation pool (all base mutations)
  - Create fallback description pool (generic event descriptions)
  - Log all failures with context (request, response, error)
  - Display non-critical errors silently (game continues)
  - Display critical errors to user (API outage notification)
- **Acceptance Criteria:**
  - [ ] Network error handled gracefully
  - [ ] Timeout triggers fallback
  - [ ] Invalid JSON doesn't crash game
  - [ ] Fallback pools complete and balanced
  - [ ] All failures logged with context
  - [ ] Game continues on API failure
  - [ ] User sees appropriate error message

#### P4-J-005: Implement AI Request Queueing
- **Effort:** 8h
- **Dependencies:** P4-J-001, P4-J-002, P4-J-003
- **Status:** Ready (After Phase 3)
- **Description:**
  - Create request queue to batch AI calls
  - Limit concurrent requests to 2 per service (6 total max)
  - Implement exponential backoff on rate limit (429 response)
  - Dequeue requests in FIFO order
  - Track queue depth and response times
  - Log queue statistics for performance analysis
- **Acceptance Criteria:**
  - [ ] Queue manages requests correctly
  - [ ] Concurrent limit enforced
  - [ ] Exponential backoff on 429
  - [ ] FIFO order maintained
  - [ ] Queue statistics logged

#### P4-J-006: Implement Generated Content Integration
- **Effort:** 10h
- **Dependencies:** P4-J-001, P4-J-002, P4-J-003, P4-J-004
- **Status:** Ready (After Phase 3)
- **Description:**
  - Replace level-up ability reward with ChatGPT-generated ability (60% of time)
  - Fallback to base ability pool 40% of time
  - Replace Wave 3+ mutations with Gemini-generated mutations (50% of time)
  - Fallback to base mutation pool 50% of time
  - Display Claude descriptions in toast notifications:
    - On wave start (wave description)
    - On level up (achievement description)
    - On ability unlock (ability flavor text)
    - On mutation appearance (mutation narrative)
    - On game over (final commentary)
  - Verify AI content doesn't break game (schema validation)
  - Test with all three services operational and with fallbacks
- **Acceptance Criteria:**
  - [ ] ChatGPT-generated abilities appear 60% of time
  - [ ] Gemini-generated mutations appear 50% of time
  - [ ] Claude descriptions display on events
  - [ ] Fallback content used on API failure
  - [ ] All AI content schema-validated
  - [ ] Game continues seamlessly with fallback
  - [ ] 5-minute session completes without crash

---

### Phase 4 Integration Points

#### P4-INTEGRATION-001: Connect AI Services to Game Systems
- **Effort:** 4h
- **Dependencies:** P4-J-006, P3-INTEGRATION-002
- **Status:** Ready (After Phase 3)
- **Description:**
  - Hook ChatGPT ability generation to level-up event
  - Hook Gemini mutation generation to wave spawn
  - Hook Claude descriptions to all significant events
- **Acceptance Criteria:**
  - [ ] AI abilities generated on level-up
  - [ ] AI mutations generated on wave start
  - [ ] AI descriptions displayed on events

#### P4-INTEGRATION-002: Connect Notification System to AI Events
- **Effort:** 3h
- **Dependencies:** P4-K-001
- **Status:** Ready (After Phase 3)
- **Description:**
  - Display Claude descriptions in toast notifications
  - Show AI event type with icon
  - Ensure descriptions readable and contextual
- **Acceptance Criteria:**
  - [ ] Descriptions display in toasts
  - [ ] Icons show event type
  - [ ] Text readable and appropriate

---

### Phase 4 Milestones & Sign-Off

**Milestone 1 (End of Week 7):**
- [ ] All three AI services operational
- [ ] Error handling and fallback systems in place
- [ ] ChatGPT generating abilities on level-up
- [ ] Gemini generating mutations on waves
- [ ] Request queueing preventing API overload

**Milestone 2 (End of Week 8):**
- [ ] Full AI integration complete
- [ ] Claude descriptions displaying
- [ ] Game seamlessly handles API failures
- [ ] Caching prevents duplicate API calls
- [ ] 5-minute session with full AI features completes without crash

**Phase 4 Sign-Off Criteria:**
- [ ] All AI services fully integrated
- [ ] Comprehensive testing with real API calls + fallback mode
- [ ] API keys secure (not in source code)
- [ ] All integration points verified
- [ ] Code reviewed and merged
- [ ] README updated with Phase 4 status
- [ ] Demo playable offline (fallback mode tested)

---

## Phase 5: Polish & Optimization

**Duration:** Weeks 9-10  
**Total Effort:** 60 hours (Kevin: 47h, Julien: 13h)  
**Goal:** Production-ready, 60 FPS, polished visuals, balanced gameplay

### Kevin's Phase 5 Tasks

#### P5-K-001: Full Particle Effects Implementation
- **Effort:** 16h
- **Dependencies:** P2-K-004
- **Status:** Ready (After Phase 4)
- **Description:**
  - Full particle system for projectile impacts (spark burst)
  - Ability cast effects (glow, directional burst, aura)
  - Enemy disable animations (dissolve, spark fade)
  - Level-up effects (gold particle shower)
  - Crate pickup effects (item float-up, glow)
  - Implement particle pooling for performance
  - Test with 1000+ particles on screen
  - Optimize particle rendering (batch updates)
- **Acceptance Criteria:**
  - [ ] All effect types rendering correctly
  - [ ] Particles pool-managed (no GC spikes)
  - [ ] 1000+ particles maintain 60 FPS
  - [ ] Effects look polished and satisfying

#### P5-K-002: Sound Design & Audio Integration
- **Effort:** 12h
- **Dependencies:** All core mechanics
- **Status:** Ready (After Phase 4)
- **Description:**
  - Shooting sound effect (crisp, immediate feedback)
  - Projectile impact sound (varies by surface, optional)
  - Ability cast sound (unique per ability, distinguishable)
  - Enemy defeat sound (satisfying, brief)
  - Level-up sound effect (celebratory, rewarding)
  - Game over sound (climactic, final)
  - UI click sounds (subtle, satisfying)
  - Implement sound pool for performance
  - Add volume control in settings menu
  - Test audio balance (no clipping, clear feedback)
- **Acceptance Criteria:**
  - [ ] All SFX implemented
  - [ ] Volumes balanced
  - [ ] No audio glitches or overlaps
  - [ ] Sound pool prevents duplicate sounds
  - [ ] Volume control works

#### P5-K-003: Performance Optimization
- **Effort:** 14h
- **Dependencies:** P4-K-003
- **Status:** Ready (After Phase 4)
- **Description:**
  - Profile game with DevTools (FPS counter, memory)
  - Implement mesh batching to reduce draw calls
  - Implement texture atlasing for enemy/effect sprites
  - Implement LOD (Level of Detail) for distant drones
  - Optimize memory pooling for bullets, enemies, particles
  - Lazy load assets not needed at start
  - Target 60 FPS on mid-range hardware (i7, GTX 1060)
  - Identify and fix bottleneck (CPU vs GPU)
  - Document performance improvements
- **Acceptance Criteria:**
  - [ ] 60 FPS maintained consistently
  - [ ] <500MB RAM usage
  - [ ] Draw calls reduced via batching
  - [ ] Memory pooling eliminates GC spikes
  - [ ] Profiling shows bottleneck identified and fixed
  - [ ] Performance target verified on test device

#### P5-K-004: UI Polish & Accessibility
- **Effort:** 10h
- **Dependencies:** All UI elements
- **Status:** Ready (After Phase 4)
- **Description:**
  - Refine menu designs (consistent fonts, spacing, colors)
  - Add smooth transitions between menu states
  - Improve readability (contrast ratios meet WCAG AA)
  - Animate ability hotbar (smoothly slide in cooldown)
  - Add visual feedback for interactive elements (hover states)
  - Fix any clipping or overlap issues
  - Test on multiple resolutions (1280x720, 1920x1080, 4K)
  - Verify accessibility (screen reader, keyboard nav, high contrast mode)
- **Acceptance Criteria:**
  - [ ] WCAG AA contrast verified on all text
  - [ ] Menu navigation smooth and intuitive
  - [ ] No overlapping UI elements
  - [ ] Animations smooth (60 FPS)
  - [ ] Responsive on all tested resolutions
  - [ ] Accessibility features working

#### P5-K-005: Implement Settings Menu
- **Effort:** 8h
- **Dependencies:** P1-K-006
- **Status:** Ready (After Phase 4)
- **Description:**
  - Volume slider (0-100%, verify with sound)
  - Resolution selector (1280x720, 1920x1080, etc.)
  - Mouse sensitivity adjustment (0.1-3.0x)
  - Optional: Difficulty level selector
  - Optional: Graphics quality selector (low/medium/high)
  - Optional: Keybind remapping
  - Save settings to localStorage
  - Apply settings immediately without restart
- **Acceptance Criteria:**
  - [ ] All settings save and persist
  - [ ] Volume slider works
  - [ ] Resolution change works
  - [ ] Mouse sensitivity affects camera immediately
  - [ ] Settings load on game restart

---

### Julien's Phase 5 Tasks

#### P5-J-001: Ability Balancing via Playtesting
- **Effort:** 12h
- **Dependencies:** Phase 4 complete
- **Status:** Ready (After Phase 4)
- **Description:**
  - Playtest extensively (20+ playthroughs, 2-5 minutes each)
  - Measure ability usage rates (identify overpowered abilities)
  - Adjust damage values (no single ability >20% of total DPS)
  - Adjust cooldown times (prevent spamming)
  - Verify passive ability stat boosts don't stack too high
  - Test merged abilities balance vs. base abilities
  - Create balance spreadsheet with before/after values
  - Document all balance changes
- **Acceptance Criteria:**
  - [ ] 20+ playthroughs completed
  - [ ] No ability >20% DPS
  - [ ] Cooldowns feel balanced
  - [ ] Merged abilities comparable to base
  - [ ] Balance spreadsheet documented

#### P5-J-002: Enemy Balance Tuning
- **Effort:** 10h
- **Dependencies:** Phase 4 complete
- **Status:** Ready (After Phase 4)
- **Description:**
  - Playtest difficulty curve across all waves
  - Adjust wave enemy composition for variety
  - Verify Wave 12 is ~3x harder than Wave 1
  - Test mutation balance (no mutation breaking game)
  - Ensure 5-minute sessions reach Wave 12+ consistently
  - Tune crate spawn rate (should feel rewarding, not overpowering)
  - Create difficulty tuning spreadsheet
  - Document all adjustments
- **Acceptance Criteria:**
  - [ ] Difficulty curve balanced
  - [ ] Wave 12 = ~3x Wave 1 difficulty
  - [ ] Sessions reach Wave 12+ consistently
  - [ ] Mutations balanced and fun
  - [ ] Crate spawn rate feels right
  - [ ] Tuning spreadsheet documented

#### P5-J-003: Implement Leaderboard System
- **Effort:** 12h
- **Dependencies:** All game systems
- **Status:** Ready (After Phase 4)
- **Description:**
  - Track session metrics: XP earned, wave reached, abilities acquired, merges performed
  - Calculate session score: 100*XP + 50*WaveReached + 25*AbilitiesAcquired
  - Store top 10 scores (local storage for MVP, backend optional)
  - Display leaderboard on game over screen
  - Sort by score descending
  - Show player stats (wave reached, final XP, abilities acquired)
  - Add session date/time
  - Implement score reset on new game
- **Acceptance Criteria:**
  - [ ] Score calculation correct
  - [ ] Top 10 leaderboard displays
  - [ ] Scores persist (localStorage working)
  - [ ] Leaderboard sorts correctly
  - [ ] Game over screen shows leaderboard

#### P5-J-004: Implement Session Timer & Metrics
- **Effort:** 8h
- **Dependencies:** All game systems
- **Status:** Ready (After Phase 4)
- **Description:**
  - Track session duration in seconds
  - Display on game over screen
  - Track total damage dealt (optional)
  - Track crates collected
  - Track merges performed
  - Generate session summary with all metrics
  - Display summary on game over screen
- **Acceptance Criteria:**
  - [ ] Timer accurate to within 1 second
  - [ ] All metrics tracked correctly
  - [ ] Summary displays on game over
  - [ ] Metrics help player understand performance

---

### Phase 5 Integration Points

#### P5-INTEGRATION-001: Connect Settings to Game Systems
- **Effort:** 2h
- **Dependencies:** P5-K-005
- **Status:** Ready (After Phase 4)
- **Description:**
  - Apply volume settings to audio
  - Apply resolution settings to rendering
  - Apply sensitivity settings to camera
- **Acceptance Criteria:**
  - [ ] All settings apply immediately
  - [ ] No game restart required

---

### Phase 5 Milestones & Sign-Off

**Milestone 1 (End of Week 9):**
- [ ] All particle effects integrated and polished
- [ ] Sound effects implemented and balanced
- [ ] Performance optimized to 60 FPS
- [ ] UI polished and accessible
- [ ] Settings menu functional

**Milestone 2 (End of Week 10):**
- [ ] Ability and enemy balance tuned via playtesting
- [ ] Leaderboard displays top 10 scores
- [ ] Session metrics tracked and displayed
- [ ] Documentation complete (README, controls, build, deployment)
- [ ] Production-ready demo ready for open day

**Phase 5 Sign-Off Criteria:**
- [ ] Game runs at 60 FPS sustained
- [ ] <500MB RAM usage verified
- [ ] All visual effects polished
- [ ] Audio balanced and satisfying
- [ ] UI accessible (WCAG AA)
- [ ] Gameplay balanced and fun (20+ playthroughs)
- [ ] Zero crashes in stress test
- [ ] README complete with all setup instructions
- [ ] Ready for open day deployment

---

## Cross-Phase Integration Tasks

### Integration-001: Version Control & Git Setup
- **Effort:** 2h
- **Status:** Ready (Before Week 1)
- **Description:**
  - Create GitHub repository
  - Set up branch strategy (main, develop, feature branches)
  - Create `.gitignore` for node_modules, .env, build artifacts
  - Initial commit with project structure
- **Acceptance Criteria:**
  - [ ] Repository accessible to team
  - [ ] Branches created
  - [ ] `.gitignore` configured

### Integration-002: Environment & API Keys Setup
- **Effort:** 2h
- **Status:** Ready (Before Week 1)
- **Description:**
  - Create `.env.local.example` template with placeholder keys
  - Document how to obtain API keys (OpenAI, Google, Anthropic)
  - Configure Vite to load environment variables
  - Test env variable loading
- **Acceptance Criteria:**
  - [ ] `.env.local.example` created
  - [ ] Instructions clear
  - [ ] Env variables load correctly

### Integration-003: Build & Deployment Pipeline
- **Effort:** 3h
- **Status:** Ready (Weeks 9-10)
- **Description:**
  - Configure npm build script
  - Test build process
  - Set up deployment to GitHub Pages or Vercel
  - Create deployment instructions
- **Acceptance Criteria:**
  - [ ] Build completes without errors
  - [ ] Deployment successful
  - [ ] Game accessible at live URL

### Integration-004: Documentation & README
- **Effort:** 4h
- **Status:** Ready (Throughout development, finalized Week 10)
- **Description:**
  - Update README with project overview (if not already done)
  - Document controls (WASD, mouse, hotkeys)
  - Document build instructions (npm install, npm run dev, npm run build)
  - Document deployment instructions
  - Add troubleshooting section
  - Include contribution guidelines
- **Acceptance Criteria:**
  - [ ] README complete and accurate
  - [ ] Build instructions clear
  - [ ] Controls documented
  - [ ] Troubleshooting helpful

---

## Summary Task Counts by Phase

| Phase | Kevin Tasks | Julien Tasks | Integration | Total |
|-------|-------------|--------------|-------------|-------|
| **Phase 1** | 7 | 7 | 3 | 17 |
| **Phase 2** | 5 | 6 | 3 | 14 |
| **Phase 3** | 4 | 6 | 3 | 13 |
| **Phase 4** | 3 | 6 | 2 | 11 |
| **Phase 5** | 5 | 4 | 1 | 10 |
| **Cross-Phase** | - | - | 4 | 4 |
| **TOTAL** | 24 | 29 | 16 | **69 total tasks** |

---

## Task Status Legend

- **Ready:** Task can begin immediately (dependencies met)
- **In Progress:** Task currently being worked on
- **Blocked:** Task waiting on dependency or external factor
- **Complete:** Task finished and sign-off done
- **Testing:** Task in QA/playtesting phase
- **Deferred:** Task pushed to later phase or post-launch

---

## Daily Standup Format

Use this template for 15-minute daily standups:

```
[Developer Name] - Phase [N] Progress
=====================================

Yesterday:
- [Task ID]: [Brief description] - [Status]
- [Task ID]: [Brief description] - [Status]

Today:
- [Task ID]: [Brief description]
- [Task ID]: [Brief description]

Blockers:
- [Description] (owner, workaround if known)

Notes:
- [Any important information for team]
```

---

## Performance Targets & Success Metrics

| Metric | Target | Phase | Verification |
|--------|--------|-------|--------------|
| **Frame Rate** | 60 FPS sustained | 5 | DevTools FPS counter |
| **Memory Usage** | <500MB | 5 | Chrome DevTools memory profiler |
| **Load Time** | <3 seconds | 5 | Page load timer |
| **Enemy Count** | 20+ on screen | 5 | Stress test, FPS maintained |
| **Particle Count** | 1000+ on screen | 5 | Effect testing |
| **API Response Time** | <10 seconds timeout | 4 | Request logging |
| **Cache Hit Rate** | >80% for AI calls | 4 | Cache statistics |
| **Balance Score** | No ability >20% DPS | 5 | Playtesting spreadsheet |

---

## Risk Mitigation Task List

| Risk | Task | Phase | Owner | Effort |
|------|------|-------|-------|--------|
| Babylon.js performance | Profile and optimize early | 1 | Kevin | 2h |
| Collision detection glitches | Implement physics engine testing | 1 | Julien | 2h |
| API rate limiting | Implement queue and cache | 4 | Julien | 2h |
| API key exposure | Use .env and gitignore | 4 | Both | 1h |
| Difficulty unbalanced | Extensive playtesting | 5 | Julien | 3h |
| Generated content poor quality | Schema validation | 4 | Julien | 2h |
| Performance <60 FPS | Optimization and profiling | 5 | Kevin | 3h |
| API unavailable during demo | Offline testing, fallback | 4 | Julien | 2h |

---

This task breakdown is ready for import into project management tools (GitHub Projects, Jira, Asana, Trello, etc.). Each task includes clear acceptance criteria and can be tracked independently. Adjust effort estimates based on actual team velocity and complexity.

