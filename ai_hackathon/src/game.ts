/**
 * Main Game Manager
 * Orchestrates all game systems
 */

import * as BABYLON from 'babylonjs'
import { SceneManager } from './rendering'
import {
  Player,
  Enemy,
  Projectile,
  GameState,
  Ability,
  PlayerStats,
} from './types'
import {
  getCurrentLevel,
  getXPProgressToNextLevel,
  addXPToPlayer,
  grantLevelUpAbility,
  applyPassiveAbility,
  recalculatePlayerStats,
} from './progression'
import {
  createEnemy,
  applyDifficultyMultiplier,
  damageEnemy,
  ENEMY_TYPES,
} from './enemies'
import { Vector3, generateUUID, randomFloat, clamp } from './utils'
import { ABILITIES } from './abilities'

export class GameManager {
  private sceneManager: SceneManager
  private gameState: GameState
  private player: Player
  private enemies: Map<string, Enemy> = new Map()
  private projectiles: Map<string, Projectile> = new Map()
  private lastInputTime = 0
  private frameCount = 0
  private fpsCounter = 0
  private waveTimer = 0
  private waveDelay = 5
  private nextEnemyId = 0
  private isGameOver = false

  constructor(canvas: HTMLCanvasElement) {
    this.sceneManager = new SceneManager(canvas)
    this.player = this.createPlayerState()
    this.gameState = {
      isRunning: false,
      isPaused: false,
      currentWave: 1,
      totalEnemiesDefeated: 0,
      sessionStartTime: Date.now(),
      player: this.player,
    }

    this.setupInputHandlers()
    this.startGameLoop()
  }

  private createPlayerState(): Player {
    const player: Player = {
      level: 1,
      xp: 0,
      currentEnergy: 100,
      maxEnergy: 100,
      inventory: [],
      equippedAbilities: [null, null, null, null],
      activeBuffs: [],
      mergesRemaining: 4,
      stats: {
        fireRate: 3.0, // 3 shots/second
        projectileSpeed: 50.0,
        maxEnergy: 100.0,
        xpBoost: 1.0,
        cooldownReduction: 1.0,
      },
      position: { x: 0, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      meshInstance: null,
    }

    // Create player mesh
    player.meshInstance = this.sceneManager.createPlayerMesh(player.position)

    return player
  }

  private setupInputHandlers(): void {
    const canvas = this.sceneManager.canvas
    const keys: Record<string, boolean> = {}

    // Keyboard input
    document.addEventListener('keydown', (e) => {
      keys[e.key.toLowerCase()] = true

      // Check for ability hotkeys (1-4)
      const slot = parseInt(e.key)
      if (slot >= 1 && slot <= 4) {
        this.castAbility(slot)
      }

      // Debug: toggle FPS counter
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        const fpsCounter = document.getElementById('fps-counter')
        if (fpsCounter) {
          fpsCounter.style.display = fpsCounter.style.display === 'none' ? 'block' : 'none'
        }
      }
    })

    document.addEventListener('keyup', (e) => {
      keys[e.key.toLowerCase()] = false
    })

    // Mouse input for camera and shooting
    canvas.addEventListener('mousemove', (e) => {
      if (!this.gameState.isRunning) return

      const deltaMove = {
        x: e.movementX || e.movementX || 0,
        y: e.movementY || e.movementX || 0,
      }

      this.updateCameraLook(deltaMove)
    })

    canvas.addEventListener('click', () => {
      if (!this.gameState.isRunning || this.gameState.isPaused) return

      this.shoot()
    })

    // Lock pointer on click
    canvas.addEventListener('click', () => {
      canvas.requestPointerLock()
    })

    // Player movement
    setInterval(() => {
      if (!this.gameState.isRunning) return

      const moveDir = new Vector3(0, 0, 0)
      if (keys['w']) moveDir.z += 1
      if (keys['s']) moveDir.z -= 1
      if (keys['a']) moveDir.x -= 1
      if (keys['d']) moveDir.x += 1

      if (moveDir.length() > 0) {
        const normalized = moveDir.normalize()
        const moveSpeed = 15 // units/sec
        const moveAmount = normalized.multiply(moveSpeed / 60) // 60 FPS assumed

        const newPos = {
          x: this.player.position.x + moveAmount.x,
          y: this.player.position.y,
          z: this.player.position.z + moveAmount.z,
        }

        // Clamp to arena bounds
        const bounds = (this.sceneManager.scene as any).arenaBounds
        newPos.x = clamp(newPos.x, bounds.minX, bounds.maxX)
        newPos.z = clamp(newPos.z, bounds.minZ, bounds.maxZ)

        this.player.position = newPos
        this.player.meshInstance.position = new BABYLON.Vector3(newPos.x, newPos.y, newPos.z)

        // Update camera position
        const camera = this.sceneManager.scene.activeCamera as BABYLON.UniversalCamera
        if (camera) {
          camera.position = new BABYLON.Vector3(newPos.x, newPos.y + 2, newPos.z)
        }
      }
    }, 16) // ~60 FPS
  }

  private updateCameraLook(deltaMove: { x: number; y: number }): void {
    const camera = this.sceneManager.scene.activeCamera as BABYLON.UniversalCamera
    if (!camera) return

    const sensitivity = 0.005
    camera.inertia = 0

    // Update camera rotation
    const currentRotation = BABYLON.Vector3.Zero()
    camera.rotation.addInPlace(new BABYLON.Vector3(deltaMove.y * sensitivity, -deltaMove.x * sensitivity, 0))
  }

  private shoot(): void {
    if (Date.now() - this.lastInputTime < 1000 / this.player.stats.fireRate) {
      return // Cooldown not met
    }

    this.lastInputTime = Date.now()

    const camera = this.sceneManager.scene.activeCamera as BABYLON.UniversalCamera
    if (!camera) return

    // Get camera direction
    const direction = BABYLON.Vector3.Zero()
    BABYLON.Vector3.TransformCoordinates(
      BABYLON.Vector3.Forward(),
      BABYLON.Matrix.RotationYawPitchRoll(camera.rotation.y, camera.rotation.x, camera.rotation.z)
    )

    const direction3 = new Vector3(
      Math.sin(camera.rotation.y),
      -Math.sin(camera.rotation.x),
      Math.cos(camera.rotation.y)
    ).normalize()

    const projectile: Projectile = {
      id: generateUUID(),
      position: {
        x: this.player.position.x,
        y: this.player.position.y + 1,
        z: this.player.position.z,
      },
      velocity: direction3.multiply(this.player.stats.projectileSpeed),
      damage: 10, // Base projectile damage
      lifespan: 20, // seconds
      elapsed: 0,
      meshInstance: null,
    }

    projectile.meshInstance = this.sceneManager.createProjectileMesh(projectile.position)
    this.projectiles.set(projectile.id, projectile)
  }

  private castAbility(slot: number): void {
    const ability = this.player.equippedAbilities[slot - 1]
    if (!ability || ability.type !== 'active') {
      return
    }

    // TODO: Implement ability casting
    // For now, just damage nearby enemies
    const abilityRadius = ability.radius || 10
    const abilityDamage = ability.damage || 20

    this.enemies.forEach((enemy) => {
      const distance = Vector3.distance(
        new Vector3(this.player.position.x, this.player.position.y, this.player.position.z),
        new Vector3(enemy.position.x, enemy.position.y, enemy.position.z)
      )

      if (distance < abilityRadius) {
        this.damageEnemyInternal(enemy, abilityDamage)
      }
    })
  }

  private startGameLoop(): void {
    this.sceneManager.render(() => {
      if (!this.gameState.isRunning) return

      this.frameCount++
      this.fpsCounter = Math.round(1000 / 16) // Approximate

      // Update FPS counter
      const fpsDisplay = document.getElementById('fps-counter')
      if (fpsDisplay && fpsDisplay.style.display !== 'none') {
        fpsDisplay.textContent = `FPS: ${this.fpsCounter}`
      }

      // Update game
      this.update()
    })
  }

  private update(): void {
    const deltaTime = 1 / 60 // Assume 60 FPS

    // Update projectiles
    this.updateProjectiles(deltaTime)

    // Update enemies
    this.updateEnemies(deltaTime)

    // Update waves
    this.updateWaves()

    // Check for game over
    if (this.player.currentEnergy <= 0 && !this.isGameOver) {
      this.endGame()
    }
  }

  private updateProjectiles(deltaTime: number): void {
    const projectilesToRemove: string[] = []

    this.projectiles.forEach((projectile) => {
      projectile.elapsed += deltaTime
      projectile.position.x += projectile.velocity.x * deltaTime
      projectile.position.y += projectile.velocity.y * deltaTime
      projectile.position.z += projectile.velocity.z * deltaTime

      // Update mesh position
      if (projectile.meshInstance) {
        projectile.meshInstance.position = new BABYLON.Vector3(
          projectile.position.x,
          projectile.position.y,
          projectile.position.z
        )
      }

      // Check lifespan
      if (projectile.elapsed > projectile.lifespan) {
        projectilesToRemove.push(projectile.id)
        projectile.meshInstance?.dispose()
      }

      // Check collision with enemies
      this.enemies.forEach((enemy) => {
        const distance = Vector3.distance(
          new Vector3(projectile.position.x, projectile.position.y, projectile.position.z),
          new Vector3(enemy.position.x, enemy.position.y, enemy.position.z)
        )

        if (distance < 1.5) {
          // Collision detected
          this.damageEnemyInternal(enemy, projectile.damage)
          projectilesToRemove.push(projectile.id)
          projectile.meshInstance?.dispose()
        }
      })
    })

    // Remove dead projectiles
    projectilesToRemove.forEach((id) => {
      this.projectiles.delete(id)
    })
  }

  private updateEnemies(deltaTime: number): void {
    const enemiesToRemove: string[] = []

    this.enemies.forEach((enemy) => {
      // Move towards player
      const direction = new Vector3(
        this.player.position.x - enemy.position.x,
        this.player.position.y - enemy.position.y,
        this.player.position.z - enemy.position.z
      ).normalize()

      enemy.position.x += direction.x * enemy.speed * deltaTime
      enemy.position.y += direction.y * enemy.speed * deltaTime
      enemy.position.z += direction.z * enemy.speed * deltaTime

      // Update mesh position
      if (enemy.meshInstance) {
        enemy.meshInstance.position = new BABYLON.Vector3(
          enemy.position.x,
          enemy.position.y,
          enemy.position.z
        )
      }

      // Check collision with player
      const distance = Vector3.distance(
        new Vector3(this.player.position.x, this.player.position.y, this.player.position.z),
        new Vector3(enemy.position.x, enemy.position.y, enemy.position.z)
      )

      if (distance < 2) {
        // Damage player
        this.player.currentEnergy = Math.max(0, this.player.currentEnergy - enemy.damage * deltaTime)
        this.updateUIHealth()
      }

      // Check if enemy is defeated
      if (enemy.health <= 0) {
        enemiesToRemove.push(enemy.id)
        enemy.meshInstance?.dispose()
      }
    })

    // Remove dead enemies
    enemiesToRemove.forEach((id) => {
      this.enemies.delete(id)
      this.gameState.totalEnemiesDefeated++
    })
  }

  private updateWaves(): void {
    // Check if all enemies defeated
    if (this.enemies.size === 0) {
      this.waveTimer += 1 / 60

      if (this.waveTimer >= this.waveDelay) {
        this.spawnWave()
        this.waveTimer = 0
      }
    }
  }

  private spawnWave(): void {
    this.gameState.currentWave++
    this.updateUIWave()

    // Wave 1: 3x Scout
    // Wave 2: 2x Pulse + 1x Scout
    // Wave 3+: Mixed

    const waveConfig: Array<{ type: string; count: number }> = []

    if (this.gameState.currentWave === 1) {
      waveConfig.push({ type: 'scout', count: 3 })
    } else if (this.gameState.currentWave === 2) {
      waveConfig.push({ type: 'pulse', count: 2 })
      waveConfig.push({ type: 'scout', count: 1 })
    } else {
      waveConfig.push({ type: 'swarm', count: 2 })
      waveConfig.push({ type: 'pulse', count: 1 })
    }

    // Spawn enemies
    waveConfig.forEach(({ type, count }) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2
        const radius = 30
        const position = {
          x: Math.cos(angle) * radius,
          y: 2,
          z: Math.sin(angle) * radius,
        }

        const enemy = createEnemy(type, position)
        applyDifficultyMultiplier(enemy, this.gameState.currentWave)

        // Create mesh
        const template = ENEMY_TYPES[type]
        if (template && template.visuals) {
          enemy.meshInstance = this.sceneManager.createEnemyMesh(
            position,
            template.visuals.color,
            template.visuals.scale
          )
        }

        this.enemies.set(enemy.id, enemy)
      }
    })
  }

  private damageEnemyInternal(enemy: Enemy, damage: number): void {
    if (damageEnemy(enemy, damage)) {
      // Enemy defeated
      const xpReward = Math.round(enemy.xpReward * this.player.stats.xpBoost)
      const leveledUp = addXPToPlayer(this.player, xpReward)

      if (leveledUp) {
        // Grant ability on level-up
        const ability = grantLevelUpAbility(this.player)
        recalculatePlayerStats(this.player)

        this.showNotification(`Level Up! Ability: ${ability.name}`)
        this.updateUILevelAndXP()
      } else {
        this.updateUILevelAndXP()
      }

      this.updateUIScore()
    }
  }

  public startGame(): void {
    this.gameState.isRunning = true
    this.isGameOver = false
    this.gameState.currentWave = 0

    // Hide menu, show game
    const menuElement = document.getElementById('menu')
    if (menuElement) menuElement.style.display = 'none'

    const canvas = this.sceneManager.canvas
    canvas.requestPointerLock()

    this.spawnWave()
  }

  public returnToMenu(): void {
    window.location.reload()
  }

  private endGame(): void {
    this.isGameOver = true
    this.gameState.isRunning = false

    // Show game over screen
    const gameOverElement = document.getElementById('game-over')
    if (gameOverElement) {
      gameOverElement.style.display = 'flex'
      document.getElementById('final-wave')!.textContent = this.gameState.currentWave.toString()
      document.getElementById('final-xp')!.textContent = this.player.xp.toString()
      document.getElementById('final-level')!.textContent = this.player.level.toString()
      document.getElementById('final-abilities')!.textContent = this.player.inventory.length.toString()
    }
  }

  private showNotification(message: string): void {
    const container = document.createElement('div')
    container.className = 'notification'
    container.textContent = message
    document.getElementById('ui')!.appendChild(container)

    setTimeout(() => {
      container.remove()
    }, 3000)
  }

  private updateUIHealth(): void {
    const percentage = (this.player.currentEnergy / this.player.stats.maxEnergy) * 100
    const healthBar = document.getElementById('health-bar')
    if (healthBar) healthBar.style.width = `${percentage}%`

    const healthText = document.getElementById('health-text')
    if (healthText) {
      healthText.textContent = `Health: ${Math.round(this.player.currentEnergy)}/${Math.round(this.player.stats.maxEnergy)}`
    }
  }

  private updateUILevelAndXP(): void {
    const progress = getXPProgressToNextLevel(this.player.xp, this.player.level)
    const percentage = (progress.current / progress.threshold) * 100
    const xpBar = document.getElementById('xp-bar')
    if (xpBar) xpBar.style.width = `${clamp(percentage, 0, 100)}%`

    const xpText = document.getElementById('xp-text')
    if (xpText) {
      xpText.textContent = `XP: ${progress.current}/${progress.threshold}`
    }

    const levelNumber = document.getElementById('level-number')
    if (levelNumber) levelNumber.textContent = this.player.level.toString()
  }

  private updateUIScore(): void {
    const scoreElement = document.getElementById('score')
    if (scoreElement) scoreElement.textContent = this.player.xp.toString()
  }

  private updateUIWave(): void {
    const waveElement = document.getElementById('wave')
    if (waveElement) waveElement.textContent = this.gameState.currentWave.toString()
  }
}

