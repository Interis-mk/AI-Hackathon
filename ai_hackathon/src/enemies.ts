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
 */
export function damageEnemy(enemy: Enemy, damage: number): boolean {
  enemy.health = Math.max(0, enemy.health - damage)
  return enemy.health <= 0
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

