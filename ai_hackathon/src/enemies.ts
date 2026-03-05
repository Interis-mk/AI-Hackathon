/**
 * Enemy type definitions and spawning
 */

import { EnemyTemplate, Enemy } from './types'
import { generateUUID } from './utils'

/**
 * Enemy type definitions for Phase 1
 */
export const ENEMY_TYPES: Record<string, EnemyTemplate> = {
  scout: {
    id: 'scout',
    name: 'Scout Drone',
    health: 20,
    speed: 12,
    damage: 5,
    xpReward: 10,
    visuals: {
      color: '#00ffff', // Neon cyan
      scale: 0.8,
    },
  },

  pulse: {
    id: 'pulse',
    name: 'Pulse Drone',
    health: 30,
    speed: 8,
    damage: 8,
    xpReward: 15,
    visuals: {
      color: '#ff00ff', // Neon magenta
      scale: 1.0,
    },
  },

  swarm: {
    id: 'swarm',
    name: 'Swarm Drone',
    health: 15,
    speed: 10,
    damage: 3,
    xpReward: 7,
    visuals: {
      color: '#00ff00', // Neon green
      scale: 0.6,
    },
  },

  // Phase 2: Elite Enemy Types
  shield: {
    id: 'shield',
    name: 'Shield Drone',
    health: 40,
    speed: 6,
    damage: 10,
    xpReward: 20,
    visuals: {
      color: '#0088ff', // Blue
      scale: 1.2,
    },
    modifiers: {
      defenseMultiplier: 0.7, // Takes 30% less damage
    },
  },

  phase: {
    id: 'phase',
    name: 'Phase Drone',
    health: 25,
    speed: 14,
    damage: 7,
    xpReward: 18,
    visuals: {
      color: '#ff88ff', // Light purple
      scale: 0.9,
    },
    modifiers: {
      evasion: 0.3, // 30% chance to evade attacks
    },
  },

  overclocked: {
    id: 'overclocked',
    name: 'Overclocked Drone',
    health: 35,
    speed: 10,
    damage: 12,
    xpReward: 22,
    visuals: {
      color: '#ff4400', // Orange-red
      scale: 1.1,
    },
  },

  regenerating: {
    id: 'regenerating',
    name: 'Regenerating Drone',
    health: 30,
    speed: 8,
    damage: 8,
    xpReward: 19,
    visuals: {
      color: '#44ff44', // Bright green
      scale: 1.0,
    },
    modifiers: {
      regeneration: 2, // 2 HP per second
    },
  },
}

/**
 * Create an enemy instance from a template
 */
export function createEnemy(
  templateId: string,
  position: { x: number; y: number; z: number }
): Enemy {
  const template = ENEMY_TYPES[templateId]
  if (!template) {
    throw new Error(`Unknown enemy type: ${templateId}`)
  }

  return {
    id: generateUUID(),
    type: templateId,
    position: { ...position },
    velocity: { x: 0, y: 0, z: 0 },
    health: template.health,
    maxHealth: template.health,
    speed: template.speed,
    damage: template.damage,
    xpReward: template.xpReward,
    meshInstance: null,
    healthBar: undefined,
  }
}

/**
 * Apply difficulty multiplier to enemy stats
 * Formula: 1.0 + 0.15 * (WaveNumber - 1)
 */
export function applyDifficultyMultiplier(enemy: Enemy, waveNumber: number): void {
  const multiplier = 1.0 + 0.15 * (waveNumber - 1)
  enemy.health = Math.round(enemy.health * multiplier)
  enemy.maxHealth = enemy.health
  enemy.speed *= multiplier
  enemy.damage = Math.round(enemy.damage * multiplier)
}

/**
 * Damage an enemy
 * Returns true if enemy is defeated (health <= 0)
 * Handles special modifiers like shield defense and phase evasion
 */
export function damageEnemy(enemy: Enemy, damage: number): boolean {
  const template = ENEMY_TYPES[enemy.type]

  // Phase Drone - Evasion chance
  if (template?.modifiers?.evasion) {
    if (Math.random() < template.modifiers.evasion) {
      // Evaded the attack
      return false
    }
  }

  // Shield Drone - Damage reduction
  if (template?.modifiers?.defenseMultiplier) {
    damage *= template.modifiers.defenseMultiplier
  }

  enemy.health = Math.max(0, enemy.health - damage)
  return enemy.health <= 0
}

/**
 * Update enemy state (called every frame)
 * Handles regeneration and other time-based effects
 */
export function updateEnemy(enemy: Enemy, deltaTime: number): void {
  const template = ENEMY_TYPES[enemy.type]

  // Regenerating Drone - Health regeneration
  if (template?.modifiers?.regeneration && enemy.health > 0) {
    enemy.health = Math.min(
      enemy.maxHealth,
      enemy.health + template.modifiers.regeneration * deltaTime
    )
  }
}

/**
 * Get template for an enemy type
 */
export function getEnemyTemplate(typeId: string): EnemyTemplate | undefined {
  return ENEMY_TYPES[typeId]
}

/**
 * Get all enemy type IDs
 */
export function getAllEnemyTypes(): string[] {
  return Object.keys(ENEMY_TYPES)
}

