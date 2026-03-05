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
    damage: 40,
    effects: ['electric', 'stun'],
    cooldown: 8,
    radius: 300,
    description: 'Releases a powerful electrical wave that stuns nearby drones. Radius: 300',
  },

  plasma_burst: {
    id: 'plasma_burst',
    name: 'Plasma Burst',
    type: 'active',
    damage: 60,
    effects: ['fire', 'burn'],
    cooldown: 10,
    radius: 250,
    description: 'Unleash a devastating burst of plasma that ignites enemies. Radius: 250',
  },

  energy_shield: {
    id: 'energy_shield',
    name: 'Energy Shield',
    type: 'active',
    damage: 0,
    effects: ['shield', 'protection'],
    cooldown: 15,
    radius: 200,
    description: 'Create a protective energy shield around you for 3 seconds. Radius: 200',
  },

  gravity_field: {
    id: 'gravity_field',
    name: 'Gravity Field',
    type: 'active',
    damage: 30,
    effects: ['gravity', 'pull'],
    cooldown: 12,
    radius: 350,
    description: 'Pull nearby drones toward the center and damage them. Radius: 350',
  },

  drone_emp: {
    id: 'drone_emp',
    name: 'Drone EMP',
    type: 'active',
    damage: 50,
    effects: ['electric', 'disable'],
    cooldown: 11,
    radius: 400,
    description: 'Emit a massive electromagnetic pulse to disable and damage drones. Radius: 400',
  },

  // Passive Abilities
  overclock: {
    id: 'overclock',
    name: 'Overclock',
    type: 'passive',
    damage: 0,
    effects: ['buff'],
    cooldown: 0,
    description: '+20% fire rate, +15% cooldown reduction',
    statBoosts: {
      fireRate: 1.2,
      cooldownReduction: 1.15,
    },
  },

  energy_boost: {
    id: 'energy_boost',
    name: 'Energy Boost',
    type: 'passive',
    damage: 0,
    effects: ['buff'],
    cooldown: 0,
    description: '+35% max health',
    statBoosts: {
      maxEnergy: 1.35,
    },
  },

  projectile_speed: {
    id: 'projectile_speed',
    name: 'Accelerator',
    type: 'passive',
    damage: 0,
    effects: ['buff'],
    cooldown: 0,
    description: '+30% projectile speed',
    statBoosts: {
      projectileSpeed: 1.3,
    },
  },

  xp_boost: {
    id: 'xp_boost',
    name: 'Experience Gain',
    type: 'passive',
    damage: 0,
    effects: ['buff'],
    cooldown: 0,
    description: '+40% XP from defeated drones',
    statBoosts: {
      xpBoost: 1.4,
    },
  },

  cooldown_reduction: {
    id: 'cooldown_reduction',
    name: 'Swift Hands',
    type: 'passive',
    damage: 0,
    effects: ['buff'],
    cooldown: 0,
    description: '+30% cooldown reduction',
    statBoosts: {
      cooldownReduction: 1.3,
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

function formatBoostPercent(multiplier: number): string {
  const percent = Math.round((multiplier - 1) * 100)
  return `${percent >= 0 ? '+' : ''}${percent}%`
}

/**
 * Build a rich multi-line tooltip for any ability.
 */
export function buildAbilityTooltip(ability: Ability): string {
  const lines: string[] = [ability.name]

  if (ability.type === 'active') {
    lines.push('Type: Active')
    lines.push(`Damage: ${ability.damage}`)
    lines.push(`Cooldown: ${ability.cooldown}s`)
    lines.push(`Radius: ${ability.radius ?? 0}`)
  } else {
    lines.push('Type: Passive')

    if (ability.statBoosts) {
      const boostLines: string[] = []

      if (ability.statBoosts.fireRate) {
        boostLines.push(`Fire Rate ${formatBoostPercent(ability.statBoosts.fireRate)}`)
      }
      if (ability.statBoosts.projectileSpeed) {
        boostLines.push(`Projectile Speed ${formatBoostPercent(ability.statBoosts.projectileSpeed)}`)
      }
      if (ability.statBoosts.maxEnergy) {
        boostLines.push(`Max Energy ${formatBoostPercent(ability.statBoosts.maxEnergy)}`)
      }
      if (ability.statBoosts.xpBoost) {
        boostLines.push(`XP Gain ${formatBoostPercent(ability.statBoosts.xpBoost)}`)
      }
      if (ability.statBoosts.cooldownReduction) {
        boostLines.push(`Cooldown Reduction ${formatBoostPercent(ability.statBoosts.cooldownReduction)}`)
      }

      if (boostLines.length > 0) {
        lines.push('Bonuses:')
        lines.push(...boostLines)
      }
    }
  }

  if (ability.effects.length > 0) {
    lines.push(`Effects: ${ability.effects.join(', ')}`)
  }

  if (ability.description) {
    lines.push(ability.description)
  }

  return lines.join('\n')
}
