# AI Hackathon Project — AI-Driven Wave Shooter

## Overview

This project is a **web-based wave shooter** inspired by **DOOM** and the **Warhammer 40K universe**. The game will be built using **TypeScript** and **Babylon.js**, and will integrate multiple AI systems (**ChatGPT, Gemini, and Claude**) to dynamically generate gameplay elements such as abilities, upgrades, enemy mutations, and event modifiers.

The core idea is to create a **fast-paced arena shooter** where the player survives increasingly difficult waves of enemies while building and combining abilities that are **generated or enhanced using AI**.

---

# Core Concept

A **top-down or arena-style shooter** where the player controls a heavily armed **Space Marine-style character** fighting waves of **robotic or corrupted enemies**.

Key features:

* Procedurally escalating **wave combat**
* **AI-generated abilities and modifiers**
* **Ability merging system**
* **Dynamic enemy mutations**
* **Persistent upgrade systems**
* **Dark sci-fi aesthetic inspired by Warhammer 40K**

---

# Tech Stack

## Frontend

* **TypeScript**
* **Babylon.js** (3D rendering and game engine)
* **Vite** (fast dev server and bundling)

## AI Integration

The project integrates **three AI systems**, each responsible for different tasks:

| AI      | Role                                           |
| ------- | ---------------------------------------------- |
| ChatGPT | Ability generation and balancing               |
| Gemini  | Enemy mutation and behavior modifiers          |
| Claude  | Narrative flavor, event descriptions, and lore |

## Other Tools

* Git / GitHub (collaboration)
* JSON for ability definitions
* REST or API wrappers for AI calls

---

# Game Design

## Player Fantasy

The player embodies a **super-soldier inspired by Space Marines**, equipped with futuristic weapons and experimental abilities.

Combat should feel:

* Fast
* Brutal
* Chaotic
* Satisfying

Influences:

* **DOOM** (aggressive combat loop)
* **Warhammer 40K** (grimdark sci-fi aesthetic)

---

# Gameplay Loop

1. Player enters arena
2. Enemies spawn in waves
3. Player defeats enemies to gain **XP**
4. Player levels up and receives **abilities or upgrades**
5. Abilities can be **merged**
6. AI generates **new combined abilities**
7. Difficulty increases
8. Elite enemies and events appear
9. Repeat until defeat

---

# Wave System

Waves increase difficulty through:

* Increased spawn counts
* New enemy types
* Elite enemies
* Environmental hazards
* AI-generated modifiers

Example wave escalation:

```
Wave 1–3   : Basic enemies
Wave 4–6   : Fast enemies
Wave 7–9   : Elite units
Wave 10+   : Boss encounters
```

Spawn types:

* Incremental spawning
* Burst spawning
* AI-modified waves

---

# Enemy Types

## Basic Enemies

* Melee drones
* Ranged drones
* Swarm bots

## Elite Enemies

Elites appear occasionally with special modifiers:

Examples:

* Shielded
* Explosive
* Teleporting
* Regenerating

AI may generate new enemy traits dynamically.

Example:

```
Radiation Drone
- Emits toxic aura
- Slowly damages player over time
```

---

# Player Progression

## XP System

Players gain XP by:

* Killing enemies
* Completing waves
* Surviving elite encounters

Leveling up unlocks:

* Abilities
* Passive upgrades
* Weapon modifiers

---

# Ability System

Abilities are the **core mechanic** of the game.

Players obtain abilities through leveling and crates.

Abilities fall into two main categories.

---

## Passive Abilities

Permanent stat modifiers.

Examples:

* Increased HP
* Increased damage
* Increased fire rate
* Faster reload
* Increased bullet speed
* XP gain bonus

Example:

```
Relentless Fire
+15% fire rate
+10% reload speed
```

---

## Active Abilities

Triggered abilities with cooldowns.

Examples:

* Energy aura
* Tactical grenade
* Orbital strike
* Shockwave
* Defensive shield

Example:

```
Shock Pulse
Releases an electrical wave that stuns enemies.
Cooldown: 12 seconds
```

---

# Ability Combination System

One of the core experimental mechanics.

Players can **merge abilities** using a **drag-and-drop interface**.

Example:

```
Fire + Poison → Toxic Flame
Frost + Electric → Cryo Shock
Grenade + Radiation → Nuclear Burst
```

Rules:

* Max **4 merge cycles**
* Each merge generates a new ability
* AI determines stats and effects

---

# Ability Data Format

Abilities are stored as JSON.

Example:

```json
{
  "name": "Toxic Flame",
  "type": "active",
  "damage": 35,
  "effects": [
    "burn",
    "poison"
  ],
  "cooldown": 8,
  "description": "A burst of toxic fire that burns and poisons enemies."
}
```

AI can generate new ability definitions in this format.

---

# Element System

Abilities can include elemental effects.

Supported elements:

* Fire (burn)
* Frost (slow/freeze)
* Electric (chain damage)
* Poison (damage over time)
* Radiation (area damage)
* Bleed (stacking damage)
* Holy / Purge (anti-elite bonus)

Elements can combine to create **unique effects**.

---

# Crate System

Occasionally crates spawn in the arena.

Crates may contain:

* Weapons
* Ability upgrades
* Temporary buffs
* Random AI-generated powers

---

# AI Systems

AI is used to dynamically generate gameplay elements.

---

## ChatGPT Role

Responsible for:

* Generating new abilities
* Balancing stats
* Creating ability combinations
* Suggesting upgrade paths

---

## Gemini Role

Responsible for:

* Enemy mutations
* Wave modifiers
* Difficulty scaling

Example:

```
Mutation: Frenzied
Enemies move 40% faster but have reduced health.
```

---

## Claude Role

Responsible for:

* Lore snippets
* Event descriptions
* Flavor text

Example:

```
The Machine Cult has awakened ancient war constructs.
Prepare for annihilation.
```

---

# Visual Style

Inspired by **Warhammer 40K grimdark sci-fi**.

Characteristics:

* Dark metallic environments
* Red UI accents
* Neon weapon effects
* Heavy industrial atmosphere

Rendering handled with **Babylon.js**.

---

# Project Structure

```
project-root
│
├─ src
│  ├─ game
│  │  ├─ player
│  │  ├─ enemies
│  │  ├─ abilities
│  │  ├─ waves
│  │  └─ systems
│  │
│  ├─ ai
│  │  ├─ chatgpt
│  │  ├─ gemini
│  │  └─ claude
│  │
│  ├─ rendering
│  │  └─ babylon
│  │
│  └─ main.ts
│
├─ assets
├─ public
├─ README.md
└─ package.json
```

---

# Possible Stretch Goals

If time allows during the hackathon:

* Procedural arenas
* Boss enemies
* Co-op multiplayer
* Weapon crafting
* AI-generated missions
* Replay system

---

# Development Setup

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Build project:

```
npm run build
```

---

# Hackathon Goal

Build a **playable prototype** that demonstrates:

* Wave-based combat
* Ability merging
* AI-generated gameplay elements
* Babylon.js rendering

The focus is experimentation with **AI-driven game mechanics** rather than building a full production game.

---

# Team Workflow

* Use **GitHub for version control**
* Feature branches for new mechanics
* AI prompts stored in `/ai/prompts`

---

# Final Vision

A chaotic arena shooter where:

* Players create absurd ability combinations
* Enemies mutate unpredictably
* AI constantly introduces new mechanics

Every run becomes **unique, chaotic, and brutal**.

In the spirit of:

**"Rip and tear — but with AI."**
