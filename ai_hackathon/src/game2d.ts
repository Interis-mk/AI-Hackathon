/**
 * Main Game Manager for 2D Arena Shooter
 * Orchestrates all game systems using 2D canvas rendering
 */

import { SceneManager } from './rendering'
import {
  Player,
  Enemy,
  Projectile,
  GameState,
  Ability,
} from './types'
import {
  getCurrentLevel,
  getXPProgressToNextLevel,
  addXPToPlayer,
  grantLevelUpAbility,
  recalculatePlayerStats,
} from './progression'
import {
  createEnemy,
  applyDifficultyMultiplier,
  damageEnemy,
  ENEMY_TYPES,
} from './enemies'
import { Vector3, generateUUID, randomFloat, clamp } from './utils'

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
  private isGameOver = false
  private keys: Record<string, boolean> = {}
  private mousePos = { x: 0, y: 0 }
  private shootDirection = { x: 1, y: 0 }

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
        fireRate: 3.0,
        projectileSpeed: 250.0,
        maxEnergy: 100.0,
        xpBoost: 1.0,
        cooldownReduction: 1.0,
      },
      position: { x: 400, y: 300 },
      velocity: { x: 0, y: 0 },
      meshInstance: null,
    }

    return player
  }

  private setupInputHandlers(): void {
    const canvas = this.sceneManager.canvas

    // Keyboard input
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true

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
      this.keys[e.key.toLowerCase()] = false
    })

    // Mouse input
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect()
      this.mousePos.x = e.clientX - rect.left
      this.mousePos.y = e.clientY - rect.top

      // Calculate shoot direction
      const dx = this.mousePos.x - this.player.position.x
      const dy = this.mousePos.y - this.player.position.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 0) {
        this.shootDirection.x = dx / dist
        this.shootDirection.y = dy / dist
      }
    })

    canvas.addEventListener('click', () => {
      if (!this.gameState.isRunning || this.gameState.isPaused) return
      this.shoot()
    })
  }

  private shoot(): void {
    if (Date.now() - this.lastInputTime < 1000 / this.player.stats.fireRate) {
      return
    }

    this.lastInputTime = Date.now()

    const projectile: Projectile = {
      id: generateUUID(),
      position: { x: this.player.position.x, y: this.player.position.y, z: 0 },
      velocity: {
        x: this.shootDirection.x * this.player.stats.projectileSpeed,
        y: this.shootDirection.y * this.player.stats.projectileSpeed,
        z: 0,
      },
      damage: 10,
      lifespan: 5,
      elapsed: 0,
      meshInstance: null,
    }

    this.projectiles.set(projectile.id, projectile)
  }

  private castAbility(slot: number): void {
    const ability = this.player.equippedAbilities[slot - 1]
    if (!ability || ability.type !== 'active') {
      return
    }

    const abilityRadius = ability.radius || 100
    const abilityDamage = ability.damage || 20

    this.enemies.forEach((enemy) => {
      const dx = enemy.position.x - this.player.position.x
      const dy = enemy.position.y - this.player.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < abilityRadius) {
        this.damageEnemyInternal(enemy, abilityDamage)
      }
    })
  }

  private startGameLoop(): void {
    this.sceneManager.render(() => {
      if (!this.gameState.isRunning) return

      this.frameCount++
      this.fpsCounter = Math.round(1000 / 16)

      // Update FPS counter
      const fpsDisplay = document.getElementById('fps-counter')
      if (fpsDisplay && fpsDisplay.style.display !== 'none') {
        fpsDisplay.textContent = `FPS: ${this.fpsCounter}`
      }

      this.update(1 / 60)
      this.render()
    })
  }

  private update(deltaTime: number): void {
    // Update player movement
    this.updatePlayerMovement(deltaTime)

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

  private updatePlayerMovement(deltaTime: number): void {
    let moveX = 0
    let moveY = 0

    if (this.keys['w']) moveY -= 1
    if (this.keys['s']) moveY += 1
    if (this.keys['a']) moveX -= 1
    if (this.keys['d']) moveX += 1

    if (moveX !== 0 || moveY !== 0) {
      const len = Math.sqrt(moveX * moveX + moveY * moveY)
      moveX /= len
      moveY /= len

      const moveSpeed = 150
      const newX = this.player.position.x + moveX * moveSpeed * deltaTime
      const newY = this.player.position.y + moveY * moveSpeed * deltaTime

      // Clamp to arena bounds
      const padding = 20
      this.player.position.x = clamp(newX, this.sceneManager.arenaOffsetX + padding,
                                      this.sceneManager.arenaOffsetX + this.sceneManager.arenaWidth - padding)
      this.player.position.y = clamp(newY, this.sceneManager.arenaOffsetY + padding,
                                      this.sceneManager.arenaOffsetY + this.sceneManager.arenaHeight - padding)
    }
  }

  private updateProjectiles(deltaTime: number): void {
    const projectilesToRemove: string[] = []

    this.projectiles.forEach((projectile) => {
      projectile.elapsed += deltaTime
      projectile.position.x += projectile.velocity.x * deltaTime
      projectile.position.y += projectile.velocity.y * deltaTime

      // Check lifespan
      if (projectile.elapsed > projectile.lifespan) {
        projectilesToRemove.push(projectile.id)
      }

      // Check collision with enemies
      this.enemies.forEach((enemy) => {
        const dx = projectile.position.x - enemy.position.x
        const dy = projectile.position.y - enemy.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 15) {
          this.damageEnemyInternal(enemy, projectile.damage)
          projectilesToRemove.push(projectile.id)
        }
      })
    })

    projectilesToRemove.forEach((id) => {
      this.projectiles.delete(id)
    })
  }

  private updateEnemies(deltaTime: number): void {
    const enemiesToRemove: string[] = []

    this.enemies.forEach((enemy) => {
      // Move towards player
      const dx = this.player.position.x - enemy.position.x
      const dy = this.player.position.y - enemy.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 0) {
        const moveX = (dx / distance) * enemy.speed * deltaTime
        const moveY = (dy / distance) * enemy.speed * deltaTime

        enemy.position.x += moveX
        enemy.position.y += moveY
      }

      // Check collision with player
      if (distance < 25) {
        this.player.currentEnergy = Math.max(0, this.player.currentEnergy - enemy.damage * deltaTime)
        this.updateUIHealth()
      }

      // Check if enemy is defeated
      if (enemy.health <= 0) {
        enemiesToRemove.push(enemy.id)
      }
    })

    enemiesToRemove.forEach((id) => {
      this.enemies.delete(id)
      this.gameState.totalEnemiesDefeated++
    })
  }

  private updateWaves(): void {
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

    waveConfig.forEach(({ type, count }) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2
        const radius = 150
        const position = {
          x: this.player.position.x + Math.cos(angle) * radius,
          y: this.player.position.y + Math.sin(angle) * radius,
          z: 0,
        }

        const enemy = createEnemy(type, position)
        applyDifficultyMultiplier(enemy, this.gameState.currentWave)
        this.enemies.set(enemy.id, enemy)
      }
    })
  }

  private damageEnemyInternal(enemy: Enemy, damage: number): void {
    if (damageEnemy(enemy, damage)) {
      const xpReward = Math.round(enemy.xpReward * this.player.stats.xpBoost)
      const leveledUp = addXPToPlayer(this.player, xpReward)

      if (leveledUp) {
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

  private render(): void {
    this.sceneManager.clear()

    // Draw player
    const playerScreen = this.sceneManager.worldToScreen(this.player.position.x, this.player.position.y)
    this.sceneManager.drawCircle(playerScreen.x, playerScreen.y, 12, '#00ff00')

    // Draw player direction indicator
    const dirX = playerScreen.x + this.shootDirection.x * 15
    const dirY = playerScreen.y + this.shootDirection.y * 15
    this.sceneManager.ctx.strokeStyle = '#00ff00'
    this.sceneManager.ctx.lineWidth = 2
    this.sceneManager.ctx.beginPath()
    this.sceneManager.ctx.moveTo(playerScreen.x, playerScreen.y)
    this.sceneManager.ctx.lineTo(dirX, dirY)
    this.sceneManager.ctx.stroke()

    // Draw enemies
    this.enemies.forEach((enemy) => {
      const enemyScreen = this.sceneManager.worldToScreen(enemy.position.x, enemy.position.y)
      const template = ENEMY_TYPES[enemy.type]
      const color = template?.visuals?.color || '#ff00ff'
      const size = template?.visuals?.scale ? 8 * template.visuals.scale : 8

      this.sceneManager.drawCircle(enemyScreen.x, enemyScreen.y, size, color)
      this.sceneManager.drawHealthBar(enemyScreen.x, enemyScreen.y, enemy.health, enemy.maxHealth, 20)
    })

    // Draw projectiles
    this.projectiles.forEach((projectile) => {
      const projScreen = this.sceneManager.worldToScreen(projectile.position.x, projectile.position.y)
      this.sceneManager.drawRect(projScreen.x, projScreen.y, 4, 4, '#ffff00')
    })
  }

  public startGame(): void {
    this.gameState.isRunning = true
    this.isGameOver = false
    this.gameState.currentWave = 0

    const menuElement = document.getElementById('menu')
    if (menuElement) menuElement.style.display = 'none'

    this.spawnWave()
  }

  public returnToMenu(): void {
    window.location.reload()
  }

  private endGame(): void {
    this.isGameOver = true
    this.gameState.isRunning = false

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

