/**
 * Base ability pool for Phase 1
 * 10 hardcoded abilities covering active and passive types
 */

import { Ability } from './types'

export const ABILITIES: Record<string, Ability> = {
  // Active Abilities
  shock_pulse: {
    id: 'shock_pulse',
    name: 'Shock Pulse',
    type: 'active',
    damage: 25,
    effects: ['electric', 'stun'],
    cooldown: 12,
    radius: 10,
    description: 'Releases an electrical wave that stuns nearby drones',
  },

  plasma_burst: {
    id: 'plasma_burst',
    name: 'Plasma Burst',
    type: 'active',
    damage: 35,
    effects: ['fire', 'burn'],
    cooldown: 15,
    radius: 8,
    description: 'Unleash a burst of plasma that ignites enemies',
  },

  energy_shield: {
    id: 'energy_shield',
    name: 'Energy Shield',
    type: 'active',
    damage: 0,
    effects: ['shield', 'protection'],
    cooldown: 20,
    radius: 5,
    description: 'Create a protective energy shield around you',
  },

  gravity_field: {
    id: 'gravity_field',
    name: 'Gravity Field',
    type: 'active',
    damage: 15,
    effects: ['gravity', 'pull'],
    cooldown: 18,
    radius: 12,
    description: 'Pull nearby drones toward the center',
  },

  drone_emp: {
    id: 'drone_emp',
    name: 'Drone EMP',
    type: 'active',
    damage: 20,
    effects: ['electric', 'disable'],
    cooldown: 16,
    radius: 15,
    description: 'Emit an electromagnetic pulse to disable drones',
  },

  // Passive Abilities
  overclock: {
    id: 'overclock',
    name: 'Overclock',
    type: 'passive',
    damage: 0,
    effects: ['buff'],
    cooldown: 0,
    description: '+15% fire rate, +10% cooldown reduction',
    statBoosts: {
      fireRate: 1.15,
      cooldownReduction: 1.1,
    },
  },

  energy_boost: {
    id: 'energy_boost',
    name: 'Energy Boost',
    type: 'passive',
    damage: 0,
    effects: ['buff'],
    cooldown: 0,
    description: '+25% max health',
    statBoosts: {
      maxEnergy: 1.25,
    },
  },

  projectile_speed: {
    id: 'projectile_speed',
    name: 'Accelerator',
    type: 'passive',
    damage: 0,
    effects: ['buff'],
    cooldown: 0,
    description: '+20% projectile speed',
    statBoosts: {
      projectileSpeed: 1.2,
    },
  },

  xp_boost: {
    id: 'xp_boost',
    name: 'Experience Gain',
    type: 'passive',
    damage: 0,
    effects: ['buff'],
    cooldown: 0,
    description: '+30% XP from defeated drones',
    statBoosts: {
      xpBoost: 1.3,
    },
  },

  cooldown_reduction: {
    id: 'cooldown_reduction',
    name: 'Swift Hands',
    type: 'passive',
    damage: 0,
    effects: ['buff'],
    cooldown: 0,
    description: '+20% cooldown reduction',
    statBoosts: {
      cooldownReduction: 1.2,
    },
  },
}

/**
 * Get a random ability from the pool
 */
export function getRandomAbility(): Ability {
  const abilityKeys = Object.keys(ABILITIES)
  const randomKey = abilityKeys[Math.floor(Math.random() * abilityKeys.length)]
  return { ...ABILITIES[randomKey] }
}

/**
 * Get a specific ability by ID
 */
export function getAbilityById(id: string): Ability | undefined {
  return ABILITIES[id] ? { ...ABILITIES[id] } : undefined
}

/**
 * Get all passive abilities
 */
export function getPassiveAbilities(): Ability[] {
  return Object.values(ABILITIES)
    .filter((a) => a.type === 'passive')
    .map((a) => ({ ...a }))
}

/**
 * Get all active abilities
 */
export function getActiveAbilities(): Ability[] {
  return Object.values(ABILITIES)
    .filter((a) => a.type === 'active')
    .map((a) => ({ ...a }))
}

