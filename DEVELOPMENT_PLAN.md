# AI Arena — Development Plan

**Project:** AI Arena - AI-Driven Wave Shooter  
**Version:** 1.0  
**Date:** March 5, 2026  
**Timeline:** 10 weeks to production-ready demo  
**Team:** Kevin (Engine/Rendering), Julien (Systems/Data)

---

## Executive Summary

This document outlines a 10-week phased development plan to deliver a playable AI Arena demo for open day. The plan breaks the project into five priority phases, each with specific deliverables, task allocation, dependencies, risks, and success criteria.

**Core Strategy:** MVP → Wave System → Ability Combinations → AI Integration → Polish

Each phase builds on the previous, with parallel work paths for Kevin and Julien to maximize efficiency. Critical path management ensures demo readiness by Week 10.

---

## High-Level Timeline

```
Week 1-2   | PHASE 1: Core Playable Game (MVP)
Week 3-4   | PHASE 2: Wave System & Enemy Variety
Week 5-6   | PHASE 3: Ability Combination System
Week 7-8   | PHASE 4: Full AI Integration
Week 9-10  | PHASE 5: Polish & Optimization
           | Deploy production-ready demo
```

---

## Phase Definitions

| Phase | Focus | Duration | Effort | Deliverable |
|-------|-------|----------|--------|-------------|
| **1** | Core gameplay loop | Weeks 1-2 | 80h | Playable 2-min session with shooting, XP, abilities |
| **2** | Progressive difficulty | Weeks 3-4 | 70h | Multiple enemy types, waves, crates, difficulty scaling |
| **3** | Ability merging | Weeks 5-6 | 65h | Drag-and-drop merge UI, AI-generated combined abilities |
| **4** | AI content generation | Weeks 7-8 | 75h | ChatGPT, Gemini, Claude integrated with fallbacks |
| **5** | Production quality | Weeks 9-10 | 60h | 60 FPS, particles, sound, UI polish, leaderboard |

**Total Effort:** ~350 hours (175h Kevin, 175h Julien)

---

## Phase 1: Core Playable Game (MVP)

**Duration:** Weeks 1-2  
**Effort:** 80 hours  
**Goal:** Deliver a playable arena shooter where players can move, shoot drones, gain XP, and acquire basic abilities.

### Kevin's Tasks (Engine & Rendering)

| Task | Effort | Dependency | Critical |
|------|--------|-----------|----------|
| Babylon.js Setup | 8h | None | ✅ YES |
| Arena Scene Creation | 12h | Babylon.js Setup | ✅ YES |
| Player Controller (WASD + Camera) | 16h | Arena Scene | ✅ YES |
| Projectile Rendering | 8h | Player Controller | ⚠️ High |
| Enemy Rendering (3 types) | 12h | Arena Scene | ⚠️ High |
| Basic UI (HUD) | 16h | Arena Scene | ⚠️ High |
| Camera System | 10h | Player Controller | Medium |

**Checklist:**
- [ ] Initialize Vite project with Babylon.js 6.x
- [ ] Configure WebGL canvas and rendering pipeline
- [ ] Create 100x100 unit arena with grid texture and neon lighting
- [ ] Implement WASD movement (15 units/sec), mouse look (pitch/yaw)
- [ ] Add collision detection with arena walls
- [ ] Render simple projectile (sphere/capsule) with despawn logic
- [ ] Create visuals for Scout, Pulse, Swarm drones (neon colors)
- [ ] Implement health bar, XP bar, level display, score counter, crosshair
- [ ] Verify 60 FPS with 5+ enemies on screen

### Julien's Tasks (Systems & Data)

| Task | Effort | Dependency | Critical |
|------|--------|-----------|----------|
| Player State Schema | 6h | None | ✅ YES |
| Ability JSON Specification | 8h | Player State Schema | ✅ YES |
| XP & Level System | 14h | Ability JSON Spec | ✅ YES |
| Basic Ability Application | 12h | Ability JSON Spec, XP System | ⚠️ High |
| Enemy Types Definition | 10h | Player State Schema | ⚠️ High |
| Basic Enemy Spawning | 12h | Enemy Types Definition | ⚠️ High |
| Collision & Damage System | 10h | Basic Enemy Spawning | ⚠️ High |

**Checklist:**
- [ ] Define Player JSON with level, XP, energy, inventory, stats
- [ ] Create ability schema with active/passive types, stat boosts
- [ ] Hardcode 10 base abilities (Overclock, Shock Pulse, Energy Shield, etc.)
- [ ] Implement XP gain: enemy health / 2 (Scout 20 HP = 10 XP)
- [ ] Implement level thresholds: Level N = 100*N*(N+1)/2 total XP
- [ ] Apply passive ability stat boosts multiplicatively
- [ ] Trigger active abilities on keys 1-4 with cooldown timers
- [ ] Define Scout Drone (health: 20, speed: 12, damage: 5, xp: 10)
- [ ] Implement wave 1 spawning (3x Scout Drones)
- [ ] Add pathfinding toward player
- [ ] Implement projectile-enemy and enemy-player collision damage

### Milestones

**End of Week 1:**
- Babylon.js project running with arena scene
- Player moves smoothly with camera follow
- Scout Drone spawns and renders correctly
- XP and level system implemented (no level-up reward yet)

**End of Week 2:**
- Projectiles spawn on click and damage enemies
- Scout Drone health decreases, dies when health = 0
- XP gain triggers on enemy defeat
- Level-up grants passive ability (stat boost visible in player stats)
- Active ability casts on key press with cooldown
- HUD displays all stats accurately
- Smooth 60 FPS gameplay

### Success Criteria

- [ ] Player moves in all directions without clipping
- [ ] Camera follows smoothly with responsive mouse look
- [ ] Projectiles spawn correctly and travel in straight line
- [ ] Projectile-enemy collision is reliable and consistent
- [ ] Scout Drone (health 20) grants 10 XP when defeated
- [ ] Level 2 reached at 100 XP, Level 3 at 300 XP total, Level 4 at 600 XP total
- [ ] Passive ability (e.g., Overclock: +15% fire rate) applies immediately
- [ ] Active ability (e.g., Shock Pulse) casts on key 1-4 press, cooldown blocks reuse
- [ ] Health bar shows current/max energy accurately
- [ ] Score counter displays total XP earned
- [ ] Game runs at 60 FPS with 5+ drones on screen
- [ ] No crashes during 5-minute gameplay session

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Babylon.js steep learning curve | Low | Medium | Use official tutorials, sandbox examples |
| Collision detection false positives | Medium | High | Implement physics engine (Cannon.js), extensive testing |
| Performance issues on low-end hardware | Medium | High | Profile early, optimize mesh complexity, use LOD |
| Input lag on camera movement | Low | High | Buffer inputs, test mouse sensitivity settings |
| JSON schema validation errors | Low | Medium | Create TypeScript interfaces, validate at parse time |

---

## Phase 2: Wave System & Enemy Variety

**Duration:** Weeks 3-4  
**Effort:** 70 hours  
**Goal:** Deliver progressive difficulty with multiple drone types, elite variants, difficulty scaling, and crate system.

### Kevin's Tasks (Engine & Rendering)

| Task | Effort | Dependency | Critical |
|------|--------|-----------|----------|
| Multiple Enemy Models (6 types) | 14h | Phase 1 complete | ✅ YES |
| Mutation Visual Indicators | 10h | Multiple Enemy Models | ⚠️ High |
| Wave Spawning Visualization | 8h | Multiple Enemy Models | Medium |
| Particle Effects Foundation | 12h | Phase 1 complete | ⚠️ High |
| Crate Rendering | 8h | Arena Scene | Medium |

**Checklist:**
- [ ] Create distinct visuals for Pulse, Swarm, Shield, Phase, Overclocked, Regenerating drones
- [ ] Use color/scale variation for visual distinction (neon palette)
- [ ] Add aura glow for mutated drones (immediately recognizable)
- [ ] Implement wave start animation (visual indicator, counter update)
- [ ] Build basic particle system with emission, lifetime, color fade
- [ ] Create impact particles for projectile hits
- [ ] Design crate model with spawn animation and glow effect
- [ ] Implement crate pickup feedback (sound, particle burst)

### Julien's Tasks (Systems & Data)

| Task | Effort | Dependency | Critical |
|------|--------|-----------|----------|
| Elite Enemy Type Definitions | 10h | Phase 1 complete | ✅ YES |
| Difficulty Scaling Logic | 12h | Elite Definitions | ✅ YES |
| Mutation System | 14h | Difficulty Scaling | ⚠️ High |
| Wave Manager | 16h | Difficulty Scaling, Mutation System | ✅ YES |
| Crate System | 12h | Phase 1 Ability System | ⚠️ High |
| Temporary Buff System | 10h | XP System (Phase 1) | Medium |

**Checklist:**
- [ ] Define Shield Drone (health: 40, speed: 6, damage: 10, defense: 0.7x)
- [ ] Define Phase Drone (health: 25, speed: 14, damage: 7, evasion: 30%)
- [ ] Define Overclocked Drone (health: 35, speed: 10, damage: 12)
- [ ] Define Regenerating Drone (health: 30, speed: 8, damage: 8, regen: 2 HP/s)
- [ ] Implement difficulty multiplier: 1.0 + 0.15 * WaveNumber
- [ ] Apply multiplier to all spawned enemies
- [ ] Define mutation schema (name, effects object with multipliers, description)
- [ ] Create base mutation pool: Frenzied, Shielded, Regenerative, Overcharged
- [ ] Implement mutation application (modify enemy stats on spawn)
- [ ] Implement Wave Manager with structured spawning:
  - [ ] Wave 1: 3x Scout Drone
  - [ ] Wave 2: 2x Pulse Drone + 1x Scout Drone
  - [ ] Wave 3: 2x Swarm Drone + 1x Shield Drone
  - [ ] Wave 4+: Mixed elite + mutations
- [ ] Handle wave completion detection (all drones defeated)
- [ ] Implement 5-second delay between waves
- [ ] Implement crate spawn logic (20% chance per wave)
- [ ] Crate loot table: 50% ability, 30% stat upgrade, 20% temporary buff
- [ ] Implement crate pickup detection and reward application
- [ ] Crate lifetime: 30 seconds before despawn
- [ ] Implement temporary buff application (e.g., 2x damage for 15 sec)
- [ ] Track buff expiration and stat restoration

### Milestones

**End of Week 3:**
- All 6 elite drone types defined and rendering
- Difficulty scaling applied (visible stat increases each wave)
- Basic mutation pool implemented
- Wave Manager spawning Waves 1-3 correctly
- Particle system emitting on impact

**End of Week 4:**
- Crate system spawning and rewards applying
- Temporary buffs active for 15 seconds then expiring
- 5-minute session reaches Wave 8+ without crashing
- All visual effects readable and distinct

### Success Criteria

- [ ] Wave 1 spawns 3x Scout (phase 1 drone), Wave 2 spawns 2x Pulse + 1x Scout
- [ ] Wave 3 spawns 2x Swarm + 1x Shield, Wave 4+ has elite drones + mutations
- [ ] Difficulty multiplier applied: Wave 5 enemies have 1.75x stats
- [ ] Elite drones visually distinct (color, scale, effects)
- [ ] Mutations appear in Wave 3+ with visual indicator (aura)
- [ ] Frenzied mutation: speed 1.3x, durability 0.7x (verified by testing)
- [ ] Crate spawns on schedule (20% per wave)
- [ ] Crate reward applies correctly on pickup
- [ ] Temporary buff (2x damage) applies for exactly 15 seconds
- [ ] 5-minute session reaches Wave 8+ without performance degradation
- [ ] 20+ drones on screen maintain 60 FPS

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Difficulty scaling too aggressive | Medium | High | Playtest extensively, adjust to 1.1*N if 1.15*N unbalanced |
| Crate spawn causes FPS drop | Low | Medium | Limit to 3 concurrent crates, cap particle count |
| Mutation combinations break balance | Medium | High | Validate multipliers <2.0x, disable broken combos |
| Wave progression feels repetitive | Low | Medium | Add visual variety (arena segments, lighting changes) |

---

## Phase 3: Ability Combination System

**Duration:** Weeks 5-6  
**Effort:** 65 hours  
**Goal:** Deliver drag-and-drop ability merge UI with AI-powered combined ability generation.

### Kevin's Tasks (Engine & Rendering)

| Task | Effort | Dependency | Critical |
|------|--------|-----------|----------|
| Ability Merge UI (Drag-and-Drop) | 16h | Phase 1 HUD | ✅ YES |
| Merge Confirmation Animation | 8h | Ability Merge UI | Medium |
| Ability Hotbar Enhancement | 10h | Phase 1 HUD | ⚠️ High |
| Notification System (Toasts) | 10h | Phase 1 HUD | ⚠️ High |

**Checklist:**
- [ ] Create drag-and-drop interface with two ability slots
- [ ] Show preview of merge result before confirmation
- [ ] Add visual feedback on merge confirmation (particle burst, screen flash)
- [ ] Animate merged ability acquisition notification
- [ ] Update hotbar with ability icons and cooldown rings
- [ ] Add equip/unequip UI for active abilities
- [ ] Implement toast notification system with auto-dismiss
- [ ] Stack notifications without overlap
- [ ] Test drag-and-drop on target browsers (Chrome, Firefox, Edge, Safari)

### Julien's Tasks (Systems & Data)

| Task | Effort | Dependency | Critical |
|------|--------|-----------|----------|
| Merge Logic Framework | 12h | Phase 1 Ability System | ✅ YES |
| Base Ability Pool Expansion | 8h | Phase 1 Ability Pool | ⚠️ High |
| Merged Ability Generation (Mock) | 16h | Merge Logic | ✅ YES |
| Merge Counter & Limits | 6h | Merge Logic | Medium |
| ChatGPT Integration Preparation | 12h | Base Ability Pool Expansion | ⚠️ High |
| Ability Caching System | 8h | ChatGPT Preparation | Medium |

**Checklist:**
- [ ] Implement merge validation (both abilities different types)
- [ ] Combine effects arrays from both abilities
- [ ] Remove source abilities from inventory on merge
- [ ] Expand ability pool to 20+ base abilities covering elements (fire, ice, electric, gravity, nature, etc.)
- [ ] Create deterministic merge formula for Phase 3:
  - [ ] Damage = (damage1 + damage2) / 2 + 10
  - [ ] Cooldown = min(cooldown1, cooldown2) + 2
  - [ ] Effects = effects1 + effects2 (no duplicates)
- [ ] Generate merged ability name from elements (Fire + Ice = "Steam Eruption")
- [ ] Implement merge counter (0-4 per session)
- [ ] Display merge counter in UI
- [ ] Block merge when counter = 0
- [ ] Create ChatGPT prompt template for ability generation
- [ ] Implement async API call handler with 10-second timeout
- [ ] Implement fallback to mock generation if API fails
- [ ] Create in-memory cache for generated abilities (deduplicate requests)
- [ ] Test cache hit rate

### Milestones

**End of Week 5:**
- Drag-and-drop merge UI fully functional
- Mock AI merge system generates balanced abilities
- Merge counter displays and enforces 4-merge limit
- Toast notifications for all game events
- Hotbar allows equip/unequip of active abilities

**End of Week 6:**
- ChatGPT API integration complete (with fallback)
- Real AI-generated abilities appear on merge
- Caching prevents duplicate API calls
- Notification system polished

### Success Criteria

- [ ] Drag-and-drop interface responds without latency (<100ms)
- [ ] Merge validation prevents duplicate selections
- [ ] Merged ability stats calculated correctly (formula verified)
- [ ] Source abilities removed from inventory after merge
- [ ] Merged ability name reflects element combination
- [ ] Merge counter shows 0-4, blocks merge at 0
- [ ] ChatGPT API call completes within 10 seconds
- [ ] API timeout triggers fallback to mock generation
- [ ] Generated ability JSON matches schema (validate with TypeScript)
- [ ] Ability stats within acceptable ranges (damage 15-50, cooldown 4-20)
- [ ] Cache prevents >1 API call for identical input
- [ ] Notifications display without overlapping (max 3 on screen)
- [ ] 4 consecutive merges possible without crash
- [ ] Merged abilities balanced vs. base abilities

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| ChatGPT API rate limiting | High | Medium | Queue requests, cache aggressively, reduce calls/session |
| Merged ability stats unbalanced | Medium | High | Hardcode formula in Phase 3, refine in Phase 4 |
| Drag-and-drop not responsive | Low | Medium | Use native HTML5 drag API, profile render time |
| API key accidentally exposed | Medium | Critical | Use Vite environment variables, never commit keys |

---

## Phase 4: Full AI Integration

**Duration:** Weeks 7-8  
**Effort:** 75 hours  
**Goal:** Deliver fully AI-driven game with ChatGPT ability generation, Gemini enemy mutations, Claude event descriptions.

### Kevin's Tasks (Engine & Rendering)

| Task | Effort | Dependency | Critical |
|------|--------|-----------|----------|
| AI Event Toast Notifications | 10h | Notification System (Phase 3) | Medium |
| Enemy Mutation Animation | 8h | Phase 2 mutation visuals | Medium |
| Performance Monitoring UI | 6h | Phase 1 rendering | Low |

**Checklist:**
- [ ] Render AI-generated event descriptions as styled toast notifications
- [ ] Support long text wrapping in notifications
- [ ] Add visual transition when mutation applies (glow burst, stat display)
- [ ] Implement frame rate counter for performance monitoring
- [ ] Implement memory profiler (optional, for Phase 5 optimization)

### Julien's Tasks (Systems & Data)

| Task | Effort | Dependency | Critical |
|------|--------|-----------|----------|
| ChatGPT Service Implementation | 14h | ChatGPT Prep (Phase 3) | ✅ YES |
| Gemini Service Implementation | 14h | Phase 2 Mutation System | ✅ YES |
| Claude Service Implementation | 12h | Base event data | ✅ YES |
| API Error Handling & Fallback | 10h | All AI services | ✅ YES |
| AI Request Queueing | 8h | All AI services | ⚠️ High |
| Generated Content Integration | 10h | All AI services | ⚠️ High |

**Checklist:**

**ChatGPT Service:**
- [ ] Create ChatGPT API wrapper with error handling
- [ ] Implement timeout logic (10 seconds)
- [ ] Implement retry logic (up to 2 retries on timeout)
- [ ] Create ability generation prompts with context (player level, existing abilities)
- [ ] Create merge ability generation prompts
- [ ] Validate response JSON against ability schema
- [ ] Cache generated abilities to reduce API calls
- [ ] Log all requests and responses for debugging

**Gemini Service:**
- [ ] Create Gemini API wrapper with error handling
- [ ] Trigger mutation generation every 3 waves (30% chance per wave)
- [ ] Create mutation generation prompts with context
- [ ] Validate stat multipliers (max 2.0x)
- [ ] Return JSON matching mutation schema
- [ ] Cache generated mutations

**Claude Service:**
- [ ] Create Claude API wrapper with error handling
- [ ] Generate descriptions for: wave start, level up, ability unlock, mutation appearance, game over
- [ ] Create prompts for each event type with context
- [ ] Validate response length (1-2 sentences)
- [ ] Maintain futuristic training simulation tone
- [ ] Cache descriptions by event type

**Error Handling & Fallback:**
- [ ] Implement comprehensive error handling (network errors, timeouts, invalid JSON)
- [ ] Create fallback ability pool (20+ pre-generated abilities)
- [ ] Create fallback mutation pool (all base mutations)
- [ ] Create fallback description pool (generic event descriptions)
- [ ] Log all failures with context (request, response, error)
- [ ] Display non-critical errors as silent fallback (no crash)
- [ ] Display critical errors to user (API outage, etc.)

**Request Queueing:**
- [ ] Implement request queue to batch API calls
- [ ] Limit concurrent requests to 2 per service
- [ ] Implement exponential backoff on rate limit (429 response)
- [ ] Dequeue requests in FIFO order
- [ ] Log queue depth and response times

**Content Integration:**
- [ ] Replace level-up ability reward with ChatGPT-generated ability (60% of time, fallback 40%)
- [ ] Replace Wave 3+ mutations with Gemini-generated mutations (50% of time, fallback 50%)
- [ ] Display Claude descriptions in toast notifications on relevant events
- [ ] Verify AI content doesn't break game (schema validation)

### Milestones

**End of Week 7:**
- All three AI services operational with fallback behavior
- ChatGPT generates new abilities on level-up (50% success rate acceptable)
- Gemini mutations apply to Wave 3+ (30% chance per wave)
- Request queueing prevents API overload

**End of Week 8:**
- Full AI integration complete and tested
- Claude event descriptions display on screen
- Caching prevents duplicate AI calls
- Game seamlessly handles API failures (zero crashes)

### Success Criteria

- [ ] ChatGPT generates valid ability JSON on request
- [ ] Ability stats within ranges (damage 15-50, cooldown 4-20, radius 5-15)
- [ ] Gemini generates unique mutations with multipliers <2.0x
- [ ] Mutation descriptions accurate and balanced
- [ ] Claude descriptions are 1-2 sentences, maintain tone
- [ ] API timeout after 10 seconds, fallback used
- [ ] Request queue limits concurrent calls to 2
- [ ] Cache prevents duplicate calls for identical input
- [ ] Network error doesn't crash game; fallback applied silently
- [ ] All API calls and failures logged for debugging
- [ ] 5-minute session with full AI features completes without crash
- [ ] API key not exposed in client code or git history

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| API key exposed in source code | Medium | Critical | Use Vite .env files, never commit keys, rotate keys post-demo |
| Simultaneous calls exceed rate limits | High | High | Implement queue, exponential backoff, cache aggressively |
| Generated content incoherent/unbalanced | Medium | Medium | Validate output against strict schema, test extensively |
| API unavailable during demo | High | Critical | Extensive offline testing with mock data, pre-generated fallback |
| JSON parsing error from API | Medium | Medium | Strict schema validation, try-catch all parsing |

---

## Phase 5: Polish & Optimization

**Duration:** Weeks 9-10  
**Effort:** 60 hours  
**Goal:** Production-ready demo with optimized performance, polished visuals, balanced gameplay, and enhanced UX.

### Kevin's Tasks (Engine & Rendering)

| Task | Effort | Dependency | Critical |
|------|--------|-----------|----------|
| Particle Effects Implementation | 16h | Phase 2 Particle Foundation | ⚠️ High |
| Sound Design | 12h | All core mechanics | ⚠️ High |
| Performance Optimization | 14h | Performance Monitoring (Phase 4) | ✅ YES |
| UI Polish | 10h | All UI elements | Medium |
| Settings Menu | 8h | All mechanics | Medium |

**Checklist:**

**Particle Effects:**
- [ ] Full particle system for projectile impacts (spark burst)
- [ ] Ability cast effects (glow, directional burst, aura)
- [ ] Enemy disable animations (dissolve, spark fade)
- [ ] Level-up effects (gold particle shower)
- [ ] Crate pickup effects (item float-up, glow)
- [ ] Implement particle pooling for performance
- [ ] Test with 1000+ particles on screen

**Sound Design:**
- [ ] Shooting sound effect (crisp, immediate feedback)
- [ ] Projectile impact sound (varies by surface)
- [ ] Ability cast sound (unique per ability, distinguishable)
- [ ] Enemy defeat sound (satisfying, brief)
- [ ] Level-up sound effect (celebratory)
- [ ] Game over sound (climactic)
- [ ] UI click sounds (subtle, satisfying)
- [ ] Implement sound pool for performance
- [ ] Volume control in settings menu

**Performance Optimization:**
- [ ] Profile game with DevTools (FPS counter, memory)
- [ ] Mesh batching to reduce draw calls
- [ ] Texture atlasing for enemy/effect sprites
- [ ] LOD (Level of Detail) for distant drones
- [ ] Memory pooling for bullets, enemies, particles
- [ ] Lazy load assets not needed at start
- [ ] Target 60 FPS on mid-range hardware (verified on test device)
- [ ] Identify and fix bottleneck (CPU vs GPU)

**UI Polish:**
- [ ] Refine menu designs (consistent fonts, spacing, colors)
- [ ] Add smooth transitions between menu states
- [ ] Improve readability (contrast ratios meet WCAG AA)
- [ ] Animate ability hotbar (smoothly slide in cooldown)
- [ ] Add visual feedback for all interactive elements (hover states)
- [ ] Fix any clipping or overlap issues
- [ ] Test on multiple resolutions (1280x720, 1920x1080, etc.)

**Settings Menu:**
- [ ] Volume slider (0-100%, verify with sound)
- [ ] Resolution selector (1280x720, 1920x1080, etc.)
- [ ] Mouse sensitivity adjustment
- [ ] Difficulty level selector (optional)
- [ ] Graphics quality selector (optional)
- [ ] Keybind remapping (optional, stretch goal)

### Julien's Tasks (Systems & Data)

| Task | Effort | Dependency | Critical |
|------|--------|-----------|----------|
| Ability Balancing | 12h | Phase 4 AI Integration | ⚠️ High |
| Enemy Balance Tuning | 10h | Phase 4 complete | ⚠️ High |
| Leaderboard System | 12h | Game State (Phase 1) | Medium |
| Session Timer & Metrics | 8h | Game State | Medium |
| Stretch Goal: Arena Variation | 8h | Phase 1 Arena | Low |

**Checklist:**

**Ability Balancing:**
- [ ] Playtest extensively (20+ playthroughs)
- [ ] Measure ability usage rates (detect overpowered abilities)
- [ ] Adjust damage values (no single ability >20% of total DPS)
- [ ] Adjust cooldown times (no ability spammable)
- [ ] Verify passive ability stat boosts don't stack too high
- [ ] Test merged abilities balance vs. base abilities
- [ ] Document balance changes in spreadsheet

**Enemy Balance Tuning:**
- [ ] Playtest difficulty curve across all waves
- [ ] Adjust wave enemy composition
- [ ] Verify Wave 12 is ~3x harder than Wave 1
- [ ] Test mutation balance (no mutation breaking game)
- [ ] Ensure 5-minute sessions reach Wave 12+ consistently
- [ ] Tune crate spawn rate (should feel rewarding)
- [ ] Document tuning changes

**Leaderboard System:**
- [ ] Track session metrics: XP earned, wave reached, abilities acquired, merges performed
- [ ] Calculate session score (100*XP + 50*WaveReached + 25*AbilitiesAcquired)
- [ ] Store top 10 scores (local storage for now)
- [ ] Display leaderboard on game over screen
- [ ] Sort by score descending
- [ ] Show player stats (wave reached, final XP)

**Session Timer & Metrics:**
- [ ] Track session duration in seconds
- [ ] Display on game over screen
- [ ] Track total damage dealt (optional)
- [ ] Track crates collected
- [ ] Track merges performed
- [ ] Generate session summary for display

**Stretch Goal: Arena Variation:**
- [ ] Implement procedural arena layout (optional)
- [ ] Randomize wall placement (maintain playability)
- [ ] Vary lighting for visual interest
- [ ] Test performance (no FPS hit)

### Milestones

**End of Week 9:**
- All particle effects integrated
- Sound effects implemented and balanced
- Performance optimized to 60 FPS on target hardware
- UI polished and accessible
- Settings menu functional

**End of Week 10:**
- Ability and enemy balance tuned via playtesting
- Leaderboard displays top 10 scores
- Session metrics tracked and displayed
- Documentation complete (README, controls, build instructions)
- Production-ready demo ready for open day

### Success Criteria

- [ ] Game maintains 60 FPS with 20+ drones, full particles, all effects on screen
- [ ] Memory usage stays <500MB during gameplay
- [ ] All SFX and music volumes balanced (no clipping, clear feedback)
- [ ] Menu navigation smooth and intuitive
- [ ] Leaderboard displays top 10 scores accurately
- [ ] Session timer accurate to within 1 second
- [ ] No crashes or freezes in 10-minute stress test
- [ ] Ability balance: no single ability >20% total DPS
- [ ] Wave difficulty: Wave 12 = ~3x Wave 1 difficulty
- [ ] WCAG AA contrast on all UI text (verified with tool)
- [ ] README updated with controls, build, deployment instructions
- [ ] Codebase well-documented (comments on non-obvious logic)
- [ ] Git history clean and organized

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Performance still <60 FPS after optimization | Medium | High | Reduce particle count, disable shadows, profile bottleneck |
| Ability balance causes frustration | Medium | Medium | Extensive playtesting, balance hotfixes post-launch |
| Leaderboard reveals exploits | Low | Medium | Validate score calculations, implement anti-cheat checks |
| Sound design takes too long | Low | Medium | Use royalty-free sound library, skip if time-constrained |

---

## Critical Path & Dependencies

### Task Dependencies

```
Phase 1:
  Babylon.js Setup
  ↓
  Arena Scene → Player Controller → Projectile Rendering
  ↓
  Enemy Rendering ← Enemy Types Definition
  ↓
  Basic UI ← XP & Level System
  ↓
  Collision & Damage System

Phase 2:
  Phase 1 Complete
  ↓
  Multiple Enemy Models ← Elite Enemy Definitions
  ↓
  Difficulty Scaling Logic
  ↓
  Wave Manager ← Mutation System
  ↓
  Crate System

Phase 3:
  Phase 1 Complete (Ability System)
  ↓
  Merge Logic Framework ← Base Ability Pool Expansion
  ↓
  Merged Ability Generation
  ↓
  ChatGPT Integration Preparation

Phase 4:
  Phase 3 Complete (Merge UI, ChatGPT Prep)
  Phase 2 Complete (Mutations)
  ↓
  ChatGPT Service, Gemini Service, Claude Service (parallel)
  ↓
  Error Handling & Fallback
  ↓
  Generated Content Integration

Phase 5:
  Phase 4 Complete (All mechanics)
  ↓
  Particle Effects, Sound Design, Performance Optimization (parallel)
  ↓
  UI Polish, Settings Menu, Ability/Enemy Balance
  ↓
  Leaderboard, Documentation
```

### Critical Path Analysis

**Longest Path:** Babylon.js Setup → Arena → Player → Enemy Spawning → Wave System → Merge Logic → AI Integration → Polish

**Estimated Critical Path Duration:** 10 weeks (matches timeline)

**Parallel Work Opportunities:**
- Weeks 1-2: Kevin builds rendering while Julien builds data structures (parallel)
- Weeks 3-4: Kevin builds enemy visuals while Julien builds wave logic (parallel)
- Weeks 5-6: Kevin builds merge UI while Julien builds merge logic (parallel)
- Weeks 7-8: Kevin builds notifications while Julien builds AI services (parallel)
- Weeks 9-10: Kevin polishes rendering while Julien balances and leaderboards (parallel)

**Blockers to Avoid:**
- Phase 2 blocked if Phase 1 not complete (1-week delay = project slip)
- Phase 4 blocked if Phase 3 merge logic not complete
- Phase 5 blocked if Phase 4 AI not stable (needs fallback testing)

---

## Team Workload & Allocation

### Hours by Phase

| Phase | Kevin | Julien | Total |
|-------|-------|--------|-------|
| **1** | 38h | 42h | 80h |
| **2** | 32h | 38h | 70h |
| **3** | 34h | 31h | 65h |
| **4** | 24h | 51h | 75h |
| **5** | 47h | 13h | 60h |
| **Total** | 175h | 175h | 350h |

### Effort Distribution

- **Kevin:** 50% rendering, 30% UI, 20% systems integration
- **Julien:** 60% game systems, 30% AI integration, 10% data validation

### Recommendations

1. **Weekly Sync:** 1-hour standup Monday morning to sync on blockers
2. **Code Reviews:** Review pull requests before merging (pair programming optional)
3. **Playtesting:** Informal playtesting starting Week 4, formal playtesting Weeks 8-9
4. **Documentation:** Update README and code comments weekly

---

## Technical Setup Requirements

### Environment

- **Node.js:** v18+ (for TypeScript, Vite)
- **Package Manager:** npm 9+ or yarn 3+
- **Browsers:** Chrome 120+, Firefox 121+, Edge 120+, Safari 17+ (latest versions)
- **IDE:** JetBrains WebStorm or VS Code (with TypeScript support)
- **Version Control:** Git (GitHub repository)

### Dependencies

```json
{
  "dependencies": {
    "babylonjs": "^6.0.0",
    "babylonjs-loaders": "^6.0.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@types/node": "^20.0.0",
    "tsconfig-paths": "^4.2.0"
  }
}
```

### API Keys Required

- **OpenAI (ChatGPT):** Set `VITE_OPENAI_API_KEY` in `.env.local`
- **Google (Gemini):** Set `VITE_GEMINI_API_KEY` in `.env.local`
- **Anthropic (Claude):** Set `VITE_CLAUDE_API_KEY` in `.env.local`

**⚠️ SECURITY:** Never commit `.env.local` to git. Add to `.gitignore`.

### Development Tools

- **Babylon.js Sandbox:** https://www.babylonjs-playground.com/ (quick testing)
- **JSON Schema Validator:** https://www.jsonschemavalidator.net/
- **Browser DevTools:** For performance profiling and debugging
- **VS Code Extensions:** ES7+ React/Redux/React-Native snippets, TypeScript Vue Plugin

### Deployment Platform

- **Primary:** GitHub Pages or Vercel (free tier)
- **Alternative:** Netlify, AWS S3 + CloudFront

---

## Assumptions & Constraints

### Assumptions

1. **Team Skills:** Kevin and Julien have TypeScript/JavaScript proficiency
2. **Babylon.js:** Basic familiarity with 3D graphics concepts (not experts needed)
3. **Open Day Audience:** 2–5 minute engagement window; longer tutorials not viable
4. **Player Familiarity:** Basic knowledge of arena shooters (WASD + mouse controls)
5. **AI Content Quality:** AI-generated content acceptable as-is (doesn't require human review)
6. **No Persistence:** Player progression resets between sessions (no save system needed)
7. **API Availability:** AI APIs available during development and demo (not guaranteed)

### Constraints

| Constraint | Details | Impact |
|-----------|---------|--------|
| **Timeline** | 10 weeks to production-ready | No scope expansion allowed; strict prioritization |
| **Team Size** | 2 developers (Kevin + Julien) | Parallel work critical; minimal context switching |
| **Single-Player** | No multiplayer features in MVP | Scope reduction; simplifies architecture |
| **Web-Only** | No mobile optimization | Simplifies responsive design requirements |
| **API Rate Limits** | Assume <1000 requests/day per API | Implement caching and fallback heavily |
| **Performance Target** | 60 FPS on mid-range hardware | Profile early; optimize mesh complexity |
| **Deployment** | Free-tier hosting (GitHub Pages, Vercel) | No server-side infrastructure |
| **Scope Cutoff** | No PvP, procedural dungeons, complex tutorials | Focus on core gameplay demo |

---

## Success Metrics by Phase

| Phase | Metric | Target | Acceptance |
|-------|--------|--------|-----------|
| **1** | Playable 2-min session, XP/level-up working | 90% | 90%+ achieved |
| **2** | 8+ waves spawn, difficulty scales, crates functional | 85% | 85%+ achieved |
| **3** | 4 merges possible, merged abilities balanced | 80% | 80%+ achieved |
| **4** | AI generates 3+ unique abilities/session, no crashes on API fail | 75% | 75%+ achieved |
| **5** | 60 FPS sustained, polished UI, leaderboard working, balanced gameplay | 95% | 95%+ achieved |
| **Open Day Demo** | Visitors complete 2–5 min session, witness AI content generation, enjoy game | 100% | 100% achieved |

---

## Key Risks & Mitigation Summary

| Risk | Probability | Impact | Phase | Mitigation |
|------|-------------|--------|-------|-----------|
| Babylon.js performance on low-end hardware | Medium | High | 1 | Profile early, optimize mesh, use LOD |
| Collision detection issues | Medium | High | 1 | Use physics engine (Cannon.js), extensive testing |
| ChatGPT API rate limiting | High | High | 4 | Queue requests, cache heavily, fallback pool |
| API key exposed in source code | Medium | Critical | 4 | Use .env variables, .gitignore, rotate keys |
| Difficulty scaling unbalanced | Medium | High | 2 | Playtest extensively, adjust multipliers |
| Generated content incoherent | Medium | Medium | 4 | Strict schema validation, test offline |
| Performance <60 FPS after optimization | Medium | High | 5 | Profile bottleneck, reduce particles, use LOD |
| API unavailable during demo | High | Critical | 4 | Mock data offline testing, pre-generated fallback |

---

## Next Steps & Immediate Actions

### Before Week 1 Starts

- [ ] Create GitHub repository (public for transparency)
- [ ] Set up Vite + Babylon.js project template
- [ ] Create TypeScript interfaces for all data schemas
- [ ] Set up `.env.local` template with API key placeholders
- [ ] Add `.env.local` to `.gitignore`
- [ ] Schedule weekly 1-hour standups (Mondays)
- [ ] Create task tracking board (GitHub Projects or Trello)
- [ ] Assign Phase 1 tasks explicitly

### Week 1 Priorities

**Kevin:**
1. Initialize Babylon.js project and get rendering loop working
2. Create basic arena scene with grid texture
3. Implement player movement and camera

**Julien:**
1. Define TypeScript interfaces for Player, Ability, Enemy, GameState
2. Create 10 base abilities with JSON specs
3. Implement XP and level calculation functions

### Throughout Development

- Daily async updates in task tracking system
- Weekly code reviews (15 minutes)
- Informal playtesting starting Week 4
- Document all architectural decisions in git commits
- Weekly README updates

### For Open Day Demo Preparation (Week 9-10)

- [ ] Create demo checklist (copy launch checklist)
- [ ] Test on demo hardware (verify 60 FPS)
- [ ] Prepare talking points for visitors
- [ ] Create quick-start guide for open day staff
- [ ] Backup all code and assets
- [ ] Test deployment pipeline
- [ ] Dry-run demo session

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | March 5, 2026 | Plan Agent | Initial comprehensive plan from SPECIFICATION.md |
| 1.0 | March 5, 2026 | Technical Lead | Final development plan |

---

## Appendix A: Launch Checklist

Use this before open day deployment:

**Functionality:**
- [ ] Game launches without errors
- [ ] Player can move and shoot
- [ ] Enemies spawn and die correctly
- [ ] XP gain and level-up working
- [ ] Abilities equip and trigger correctly
- [ ] Waves progress and escalate difficulty
- [ ] Crates spawn and grant rewards
- [ ] Ability merging works without crashes
- [ ] AI services functional (or fallback active)
- [ ] Game over screen displays correctly

**Performance:**
- [ ] 60 FPS on target hardware
- [ ] <500MB RAM usage
- [ ] <3 second load time
- [ ] No lag spikes during gameplay

**UI/UX:**
- [ ] All text readable (WCAG AA)
- [ ] Menu navigation smooth
- [ ] No overlapping UI elements
- [ ] Notifications display and dismiss correctly
- [ ] Settings apply immediately

**Sound & Visuals:**
- [ ] Sound effects play correctly
- [ ] No audio glitches or overlaps
- [ ] Particle effects smooth and performant
- [ ] Enemy mutations visually distinct
- [ ] Neon aesthetic consistent

**Stability:**
- [ ] No crashes in 10-minute stress test
- [ ] API failures handled gracefully
- [ ] All JSON data validated
- [ ] Error logging functional

**Documentation:**
- [ ] README updated with controls and build instructions
- [ ] API setup documented (.env template)
- [ ] Deployment instructions clear
- [ ] Code commented where non-obvious

---

## Appendix B: Role Definitions

### Kevin's Responsibilities (Engine & Rendering)

**Primary Focus:**
- Babylon.js 3D rendering pipeline
- Player character and camera systems
- Enemy and projectile rendering
- Particle effects and visual feedback
- UI layout and rendering
- Performance optimization

**Decisions:**
- Mesh complexity and LOD strategies
- Particle system architecture
- UI framework choices
- Performance profiling approach

### Julien's Responsibilities (Systems & Data)

**Primary Focus:**
- Game logic and state management
- Ability and progression systems
- Wave and enemy management
- AI service integration
- Data validation and schemas
- Gameplay balance tuning

**Decisions:**
- Ability stat calculations
- Difficulty scaling parameters
- AI prompt design
- Balance tuning based on playtesting

---

This plan is comprehensive, actionable, and ready for team execution. Adjust tasks and timelines based on actual progress and team velocity.

