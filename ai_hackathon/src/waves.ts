/**
 * Wave and Difficulty System
 * Manages wave progression, spawning patterns, and difficulty scaling
 */

import { Enemy } from './types'
import { createEnemy, applyDifficultyMultiplier, ENEMY_TYPES } from './enemies'

export interface WaveSpawnConfig {
  wave: number
  spawns: Array<{ type: string; count: number }>
  difficultyMultiplier: number
  description: string
}

/**
 * Calculate difficulty multiplier for a given wave
 * Formula: 1.0 + 0.15 * (WaveNumber - 1)
 * Wave 1 = 1.0x
 * Wave 5 = 1.6x
 * Wave 10 = 2.35x
 */
export function calculateDifficultyMultiplier(waveNumber: number): number {
  return 1.0 + 0.15 * (waveNumber - 1)
}

/**
 * Generate wave configuration for a given wave number
 * Provides structured enemy spawns
 */
export function getWaveConfig(waveNumber: number): WaveSpawnConfig {
  let spawns: Array<{ type: string; count: number }> = []
  let description = ''

  if (waveNumber === 1) {
    spawns = [{ type: 'scout', count: 3 }]
    description = 'Scout drones incoming!'
  } else if (waveNumber === 2) {
    spawns = [
      { type: 'pulse', count: 2 },
      { type: 'scout', count: 1 },
    ]
    description = 'Pulse drones detected!'
  } else if (waveNumber === 3) {
    spawns = [
      { type: 'swarm', count: 3 },
      { type: 'scout', count: 1 },
    ]
    description = 'Swarm incoming! Watch for small drones!'
  } else if (waveNumber === 4) {
    spawns = [
      { type: 'pulse', count: 3 },
      { type: 'scout', count: 2 },
    ]
    description = 'Heavy pulse wave!'
  } else if (waveNumber === 5) {
    spawns = [
      { type: 'scout', count: 2 },
      { type: 'pulse', count: 2 },
      { type: 'swarm', count: 2 },
    ]
    description = 'Mixed enemy wave!'
  } else if (waveNumber <= 10) {
    // Waves 6-10: Increase difficulty
    const difficulty = waveNumber - 5
    spawns = [
      { type: 'scout', count: 2 + difficulty },
      { type: 'pulse', count: 1 + difficulty },
      { type: 'swarm', count: difficulty },
    ]
    description = `Heavy combat approaching! (Wave ${waveNumber})`
  } else {
    // Waves 11+: Intense waves
    spawns = [
      { type: 'scout', count: 5 },
      { type: 'pulse', count: 4 },
      { type: 'swarm', count: 3 },
    ]
    description = `EXTREME THREAT LEVEL! (Wave ${waveNumber})`
  }

  const difficultyMultiplier = calculateDifficultyMultiplier(waveNumber)

  return {
    wave: waveNumber,
    spawns,
    difficultyMultiplier,
    description,
  }
}

/**
 * Spawn enemies for a wave
 * Returns array of spawned enemies
 */
export function spawnWaveEnemies(
  waveNumber: number,
  playerX: number,
  playerY: number
): Enemy[] {
  const config = getWaveConfig(waveNumber)
  const spawnedEnemies: Enemy[] = []

  config.spawns.forEach(({ type, count }) => {
    for (let i = 0; i < count; i++) {
      const angle = (i / Math.max(1, count)) * Math.PI * 2
      const radius = 250
      const position = {
        x: playerX + Math.cos(angle) * radius,
        y: playerY + Math.sin(angle) * radius,
        z: 0,
      }

      const enemy = createEnemy(type, position)
      applyDifficultyMultiplier(enemy, waveNumber)
      spawnedEnemies.push(enemy)
    }
  })

  return spawnedEnemies
}

/**
 * Calculate enemy stats with difficulty scaling
 * Shows what the final stats will be
 */
export function calculateEnemyStatsWithDifficulty(
  baseHealth: number,
  baseSpeed: number,
  baseDamage: number,
  waveNumber: number
): { health: number; speed: number; damage: number } {
  const multiplier = calculateDifficultyMultiplier(waveNumber)
  return {
    health: Math.round(baseHealth * multiplier),
    speed: baseSpeed * multiplier,
    damage: Math.round(baseDamage * multiplier),
  }
}

/**
 * Get wave description for UI display
 */
export function getWaveDescription(waveNumber: number): string {
  return getWaveConfig(waveNumber).description
}

/**
 * Calculate remaining enemies estimate for difficulty
 * Returns a visual difficulty indicator
 */
export function getDifficultyIndicator(waveNumber: number): string {
  const multiplier = calculateDifficultyMultiplier(waveNumber)
  if (multiplier < 1.2) return '★☆☆☆☆ Easy'
  if (multiplier < 1.5) return '★★☆☆☆ Normal'
  if (multiplier < 2.0) return '★★★☆☆ Hard'
  if (multiplier < 2.5) return '★★★★☆ Very Hard'
  return '★★★★★ Extreme'
}

