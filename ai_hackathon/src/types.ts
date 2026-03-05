/**
 * Core data schemas and TypeScript interfaces for AI Arena
 */

export interface AbilityStats {
  fireRate?: number;
  projectileSpeed?: number;
  maxEnergy?: number;
  xpBoost?: number;
  cooldownReduction?: number;
}

export interface Ability {
  id: string;
  name: string;
  type: 'active' | 'passive';
  damage: number;
  effects: string[];
  cooldown: number;
  description: string;
  radius?: number;
  statBoosts?: AbilityStats;
}

export interface EnemyTemplate {
  id: string;
  name: string;
  health: number;
  speed: number;
  damage: number;
  xpReward: number;
  visuals?: {
    color: string;
    scale: number;
  };
  modifiers?: {
    defenseMultiplier?: number; // Shield drone damage reduction
    evasion?: number; // Phase drone evasion chance
    regeneration?: number; // Regenerating drone HP/sec
  };
}

export interface Enemy {
  id: string;
  type: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  xpReward: number;
  meshInstance: any; // Babylon.js mesh
  healthBar?: any; // Babylon.js GUI element
}

export interface Projectile {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  damage: number;
  lifespan: number;
  elapsed: number;
  meshInstance: any;
}

export interface PlayerStats {
  fireRate: number;
  projectileSpeed: number;
  maxEnergy: number;
  xpBoost: number;
  cooldownReduction: number;
}

export interface Player {
  level: number;
  xp: number;
  currentEnergy: number;
  maxEnergy: number;
  inventory: Ability[];
  equippedAbilities: (Ability | null)[];
  activeBuffs: BuffEffect[];
  mergesRemaining: number;
  stats: PlayerStats;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  meshInstance: any;
}

export interface BuffEffect {
  name: string;
  duration: number;
  elapsed: number;
  modifier: Partial<PlayerStats>;
}

export interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  currentWave: number;
  totalEnemiesDefeated: number;
  sessionStartTime: number;
  player: Player;
}

export interface WaveConfig {
  waveNumber: number;
  enemySpawns: Array<{ type: string; count: number }>;
  difficultyMultiplier: number;
}

