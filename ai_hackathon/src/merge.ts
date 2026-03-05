/**
 * Ability Merge System
 * Combines two abilities into a new, more powerful one
 */

import { Ability } from './types'
import { generateUUID } from './utils'

/**
 * Validate if two abilities can be merged
 */
export function canMerge(ability1: Ability | null, ability2: Ability | null): boolean {
  if (!ability1 || !ability2) return false
  if (ability1.id === ability2.id) return false // Can't merge same ability
  return true
}

/**
 * Generate a merged ability name from two abilities
 */
function generateMergedName(ability1: Ability, ability2: Ability): string {
  // Extract key words from ability names
  const words1 = ability1.name.split(' ')
  const words2 = ability2.name.split(' ')

  // Simple name generation based on effects
  const effects = [...new Set([...ability1.effects, ...ability2.effects])]

  // Name mapping based on effect combinations
  const nameMap: Record<string, string> = {
    'electric_fire': 'Plasma Storm',
    'fire_electric': 'Plasma Storm',
    'electric_gravity': 'Tesla Vortex',
    'gravity_electric': 'Tesla Vortex',
    'fire_gravity': 'Solar Collapse',
    'gravity_fire': 'Solar Collapse',
    'electric_stun': 'Shock Wave',
    'stun_electric': 'Shock Wave',
    'fire_burn': 'Inferno Blast',
    'burn_fire': 'Inferno Blast',
    'shield_protection': 'Fortress Field',
    'protection_shield': 'Fortress Field',
    'gravity_pull': 'Singularity',
    'pull_gravity': 'Singularity',
  }

  // Try to find a matching combination
  const effectKey = effects.slice(0, 2).sort().join('_')
  if (nameMap[effectKey]) {
    return nameMap[effectKey]
  }

  // Fallback: combine first words
  return `${words1[0]} ${words2[0]}`
}

/**
 * Merge two abilities into a new combined ability
 * Uses deterministic formula for balance
 */
export function mergeAbilities(ability1: Ability, ability2: Ability): Ability {
  if (!canMerge(ability1, ability2)) {
    throw new Error('Cannot merge these abilities')
  }

  // Combine effects (no duplicates)
  const combinedEffects = [...new Set([...ability1.effects, ...ability2.effects])]

  // Calculate merged stats
  const mergedDamage = Math.round((ability1.damage + ability2.damage) / 2 + 10)
  const mergedCooldown = Math.min(ability1.cooldown, ability2.cooldown) + 2
  const mergedRadius = Math.max(ability1.radius || 0, ability2.radius || 0)

  // Determine type (active if either is active)
  const mergedType: 'active' | 'passive' =
    ability1.type === 'active' || ability2.type === 'active' ? 'active' : 'passive'

  // Combine stat boosts for passive abilities
  const mergedStatBoosts = { ...ability1.statBoosts, ...ability2.statBoosts }
  if (ability1.statBoosts && ability2.statBoosts) {
    // Multiply boosts together
    Object.keys(mergedStatBoosts).forEach(key => {
      const k = key as keyof typeof mergedStatBoosts
      if (ability1.statBoosts?.[k] && ability2.statBoosts?.[k]) {
        mergedStatBoosts[k] = (ability1.statBoosts[k]! * ability2.statBoosts[k]!) as any
      }
    })
  }

  const mergedAbility: Ability = {
    id: generateUUID(),
    name: generateMergedName(ability1, ability2),
    type: mergedType,
    damage: mergedDamage,
    effects: combinedEffects,
    cooldown: mergedCooldown,
    radius: mergedRadius,
    description: `A powerful combination of ${ability1.name} and ${ability2.name}`,
    statBoosts: Object.keys(mergedStatBoosts).length > 0 ? mergedStatBoosts : undefined,
  }

  return mergedAbility
}

/**
 * Get merge preview (show what the result would be)
 */
export function getMergePreview(ability1: Ability | null, ability2: Ability | null): Ability | null {
  if (!canMerge(ability1, ability2)) return null
  return mergeAbilities(ability1!, ability2!)
}

