# AI Arena — AI-Driven Wave Shooter

### Hackathon Project for Open Day

---

# Overview

**AI Arena** is a fast-paced **web-based arena shooter** where players test experimental AI-generated combat abilities in a futuristic training simulation.

Instead of a brutal battlefield, the game takes place inside a **high-tech combat simulator** where the player must disable waves of malfunctioning drones while experimenting with abilities created by AI.

The core idea of the project is to demonstrate how **multiple AI systems (ChatGPT, Gemini, Claude)** can dynamically create gameplay elements such as:

* New abilities
* Ability combinations
* Enemy mutations
* Event descriptions

The result is a **playable demo where AI actively shapes the game experience**.

The project is built using **TypeScript** and **Babylon.js**.

---

# Inspiration

Gameplay inspiration:

* DOOM (fast arena combat loop)
* Arcade wave shooters

Visual inspiration:

* Futuristic training simulations
* Neon sci-fi arenas
* Holographic environments

Instead of violent combat, enemies are **malfunctioning drones** that must be **disabled**.

---

# Core Concept

Players enter a **combat simulation arena** where waves of drones spawn.

The player survives as long as possible while collecting **AI-generated abilities** and combining them into powerful new skills.

Each run is slightly different because **AI dynamically generates upgrades and modifiers**.

---

# Tech Stack

## Core Technology

* **TypeScript**
* **Babylon.js**
* **Vite**

## AI Systems

| AI      | Role                               |
| ------- | ---------------------------------- |
| ChatGPT | Ability generation and balancing   |
| Gemini  | Enemy mutations and wave modifiers |
| Claude  | Event descriptions and lore flavor |

## Data Format

Game data such as abilities are stored as **JSON objects**.

---

# Gameplay Loop

1. Player enters arena
2. Drones spawn in waves
3. Player disables drones to gain **XP**
4. Player levels up and receives **abilities**
5. Abilities can be **combined**
6. AI generates **new abilities**
7. Waves become harder
8. Repeat until defeat

Each run lasts roughly **2–5 minutes**, making it perfect for an **open day demo**.

---

# Enemy Types

## Basic Drones

Standard enemies that move toward the player.

Examples:

* Scout Drone
* Pulse Drone
* Swarm Drone

## Elite Drones

Stronger variants with modifiers.

Examples:

* Shield Drone
* Phase Drone
* Overclocked Drone
* Regenerating Drone

AI may dynamically generate new modifiers.

Example mutation:

```
Mutation: Frenzied
Drones move faster but have reduced durability.
```

---

# Player Progression

Players gain **XP** by disabling drones.

Leveling up grants:

* New abilities
* Passive upgrades
* Ability combinations

---

# Ability System

Abilities are divided into two categories.

---

## Passive Abilities

Permanent stat boosts.

Examples:

* Increased energy (HP)
* Faster fire rate
* Increased projectile speed
* XP boost
* Faster cooldowns

Example:

```
Overclock
+15% fire rate
+10% reload speed
```

---

## Active Abilities

Triggered abilities with cooldowns.

Examples:

* Energy Pulse
* Gravity Field
* Drone EMP
* Plasma Burst
* Energy Shield

Example:

```
Shock Pulse
Releases an electrical wave that disables nearby drones.
Cooldown: 12 seconds
```

---

# Ability Combination System

Players can **merge abilities** to create new ones.

Example combinations:

```
Fire + Frost → Steam Burst
Electric + Gravity → Tesla Vortex
Shield + Aura → Energy Dome
```

Rules:

* Maximum **4 merge cycles**
* AI determines new stats and effects
* New abilities are generated in **JSON format**

Example ability JSON:

```json
{
  "name": "Tesla Vortex",
  "type": "active",
  "damage": 35,
  "effects": [
    "electric",
    "gravity"
  ],
  "cooldown": 8,
  "description": "A vortex of electricity that pulls drones inward."
}
```

---

# Crate System

Occasionally crates spawn in the arena.

Crates may contain:

* New abilities
* Passive upgrades
* Temporary buffs
* AI-generated powers

---

# AI Systems

AI plays an active role in generating gameplay elements.

---

## ChatGPT Responsibilities

* Generate new abilities
* Balance ability stats
* Create ability combinations

---

## Gemini Responsibilities

* Generate enemy mutations
* Modify wave behavior
* Create difficulty modifiers

Example:

```
Mutation: Magnetic
Drones are pulled toward each other periodically.
```

---

## Claude Responsibilities

* Generate flavor text
* Describe events
* Provide narrative context

Example:

```
Simulation Warning:
Experimental combat drones have entered the arena.
```

---

# Visual Style

The game uses a **clean futuristic training simulation aesthetic**.

Characteristics:

* Neon highlights
* Holographic drones
* Grid-based arena floor
* Bright ability effects
* Red and blue UI accents

Rendering is handled using **Babylon.js**.

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

Deliver a **playable demo** where visitors can:

* Play a short arena session
* See AI generate new abilities
* Watch enemies mutate
* Experiment with ability combinations

The focus is demonstrating **AI-driven game design**.

---

# Development Tasks

Tasks are split between **Kevin** and **Julien** and ordered by **priority**.

---

# Priority 1 — Core Playable Game

## Kevin

Focus: **Game Engine & Rendering**

Tasks:

* Setup **Babylon.js project**
* Create **arena scene**
* Implement **player movement**
* Implement **camera system**
* Implement **basic shooting**
* Create **simple drone enemy**
* Implement **enemy spawning**
* Implement **collision detection**
* Implement **basic UI (HP / score)**

Goal:
A playable prototype where the player can move and shoot drones.

---

## Julien

Focus: **Game Systems & Data**

Tasks:

* Define **ability JSON format**
* Implement **XP system**
* Implement **level-up system**
* Implement **basic ability system**
* Implement **passive ability effects**
* Implement **active ability triggers**

Goal:
Player can gain abilities when leveling up.

---

# Priority 2 — Wave System

## Kevin

* Implement **wave spawning system**
* Add **multiple enemy types**
* Add **enemy movement behaviors**
* Add **enemy visual effects**

---

## Julien

* Implement **difficulty scaling**
* Implement **elite enemy modifiers**
* Implement **crate spawning**
* Implement **temporary buffs**

---

# Priority 3 — Ability Combination System

## Kevin

* Implement **ability merge UI**
* Drag-and-drop ability interface
* Visual effect for ability creation

---

## Julien

* Implement **ability merge logic**
* Generate combined ability JSON
* Apply merged ability effects

---

# Priority 4 — AI Integration

## Kevin

* Add UI to display **AI-generated abilities**
* Visual indicators for AI events

---

## Julien

* Integrate APIs for:

  * ChatGPT
  * Gemini
  * Claude

* Implement AI prompts for:

  * Ability generation
  * Enemy mutation
  * Event descriptions

---

# Priority 5 — Polish for Open Day

## Kevin

* Add particle effects
* Improve UI
* Add sound effects
* Improve visuals

---

## Julien

* Add leaderboard
* Add session timer
* Improve ability balancing
* Add fun AI-generated messages

---

# Stretch Goals (If Time Allows)

* Boss drone
* Procedural arena
* More ability combinations
* Replay system
* Multiplayer prototype

---

# Final Vision

A fun **AI-powered arena shooter demo** where visitors can quickly jump in and experience how **AI dynamically changes gameplay**.

Every run creates new abilities, new enemies, and unexpected combinations — making each playthrough unique.
