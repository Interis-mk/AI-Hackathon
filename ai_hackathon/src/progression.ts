/**
 * XP and Level-Up System
 */

import { Player, Ability } from './types'
import { getRandomAbility, getPassiveAbilities, getActiveAbilities } from './abilities'

/**
 * Calculate XP reward from defeating an enemy
 * Formula: enemy_health / 2
 */
export function calculateXPReward(enemyHealth: number, xpBoostMultiplier: number = 1.0): number {
  const baseXP = enemyHealth / 2
  return Math.round(baseXP * xpBoostMultiplier)
}

/**
 * Calculate XP threshold for a given level
 * Formula: 100 * N * (N+1) / 2
 * Level 1 = 0 XP
 * Level 2 = 100 XP
 * Level 3 = 300 XP total
 * Level 4 = 600 XP total
 */
export function getXPThresholdForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.round(100 * level * (level + 1) / 2)
}

/**
 * Get current level based on total XP
 */
export function getCurrentLevel(totalXP: number): number {
  let level = 1
  while (getXPThresholdForLevel(level + 1) <= totalXP) {
    level++
  }
  return level
}

/**
 * Calculate XP progress to next level
 */
export function getXPProgressToNextLevel(
  totalXP: number,
  currentLevel: number
): { current: number; threshold: number } {
  const currentThreshold = getXPThresholdForLevel(currentLevel)
  const nextThreshold = getXPThresholdForLevel(currentLevel + 1)
  const current = totalXP - currentThreshold
  const threshold = nextThreshold - currentThreshold

  return { current, threshold }
}

/**
 * Add XP to player and check for level-up
 * Returns true if leveled up
 */
export function addXPToPlayer(player: Player, xpAmount: number): boolean {
  const oldLevel = player.level
  player.xp += xpAmount

  const newLevel = getCurrentLevel(player.xp)
  player.level = newLevel

  return newLevel > oldLevel
}

/**
 * Grant an ability to the player on level-up
 * 50% chance for active, 50% chance for passive
 */
export function grantLevelUpAbility(player: Player): Ability {
  const isActive = Math.random() < 0.5
  const ability = isActive ? getRandomActiveAbility() : getRandomPassiveAbility()

  player.inventory.push(ability)

  return ability
}

/**
 * Get random passive ability
 */
export function getRandomPassiveAbility(): Ability {
  const passives = getPassiveAbilities()
  return passives[Math.floor(Math.random() * passives.length)]
}

/**
 * Get random active ability
 */
export function getRandomActiveAbility(): Ability {
  const actives = getActiveAbilities()
  return actives[Math.floor(Math.random() * actives.length)]
}

/**
 * Equip an ability to a hotbar slot (1-4)
 */
export function equipAbility(player: Player, ability: Ability, slot: number): void {
  if (slot < 1 || slot > 4) {
    console.warn(`Invalid ability slot: ${slot}`)
    return
  }

  if (ability.type !== 'active') {
    console.warn(`Cannot equip passive ability to hotbar`)
    return
  }

  const slotIndex = slot - 1
  player.equippedAbilities[slotIndex] = ability
}

/**
 * Unequip an ability from a hotbar slot
 */
export function unequipAbility(player: Player, slot: number): void {
  if (slot < 1 || slot > 4) {
    console.warn(`Invalid ability slot: ${slot}`)
    return
  }

  const slotIndex = slot - 1
  player.equippedAbilities[slotIndex] = null
}

/**
 * Apply passive ability to player stats (multiplicative)
 */
export function applyPassiveAbility(player: Player, ability: Ability): void {
  if (ability.type !== 'passive' || !ability.statBoosts) {
    return
  }

  const boosts = ability.statBoosts
  if (boosts.fireRate) player.stats.fireRate *= boosts.fireRate
  if (boosts.projectileSpeed) player.stats.projectileSpeed *= boosts.projectileSpeed
  if (boosts.maxEnergy) player.stats.maxEnergy *= boosts.maxEnergy
  if (boosts.xpBoost) player.stats.xpBoost *= boosts.xpBoost
  if (boosts.cooldownReduction) player.stats.cooldownReduction *= boosts.cooldownReduction
}

/**
 * Recalculate all player stats from inventory
 * Called when inventory changes
 */
export function recalculatePlayerStats(player: Player): void {
  // Reset to base stats
  player.stats = {
    fireRate: 3.0, // 3 shots per second
    projectileSpeed: 50.0, // units per second
    maxEnergy: 100.0,
    xpBoost: 1.0,
    cooldownReduction: 1.0,
  }

  // Reapply all passive abilities
  player.inventory
    .filter((a) => a.type === 'passive')
    .forEach((ability) => {
      applyPassiveAbility(player, ability)
    })

  // Apply active buffs (temporary)
  player.activeBuffs.forEach((buff) => {
    Object.entries(buff.modifier).forEach(([key, value]) => {
      const statKey = key as keyof typeof player.stats
      if (player.stats[statKey] && typeof value === 'number') {
        player.stats[statKey] *= value
      }
    })
  })

  // Adjust max energy if player has current energy beyond new max
  if (player.currentEnergy > player.stats.maxEnergy) {
    player.currentEnergy = player.stats.maxEnergy
  }
}

