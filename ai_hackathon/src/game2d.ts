/**
 * Main Game Manager for 2D Arena Shooter
 * Orchestrates all game systems using 2D canvas rendering
 */

import {SceneManager} from './rendering'
import {
    Player,
    Enemy,
    Projectile,
    GameState,
    Ability,
    Obstacle,
    NavGrid,
} from './types'
import {
    getCurrentLevel,
    getXPProgressToNextLevel,
    addXPToPlayer,
    grantLevelUpAbility,
    recalculatePlayerStats,
    equipAbility,
    unequipAbility,
} from './progression'
import {
    createEnemy,
    applyDifficultyMultiplier,
    damageEnemy,
    updateEnemy,
    ENEMY_TYPES,
} from './enemies'

import {
    spawnWaveEnemies,
    getWaveDescription,
    getDifficultyIndicator,
    calculateDifficultyMultiplier,
} from './waves'

import {ABILITIES, buildAbilityTooltip} from './abilities'

import {Vector3, generateUUID, randomFloat, clamp} from './utils'
import {canMerge, mergeAbilities} from './merge'
import {ParticleSystem} from './particles'
import {
    buildNavGrid,
    findNearestWalkableCell,
    findPathAStar,
    toWorldPath,
    worldToGrid,
} from './pathfinding'

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
    private mouseWorldPos = {x: 800, y: 600}
    private shootDirection = {x: 1, y: 0}
    private debugMode = false
    private autoAimEnabled = true
    private abilityCooldowns: Map<string, number> = new Map()

    // Merge UI state
    private mergeSlot1: Ability | null = null
    private mergeSlot2: Ability | null = null
    private activeSelectSlot: 1 | 2 | null = null
    private hotbarEditSlot: 1 | 2 | 3 | 4 = 1
    private isMergeUIOpen = false

    // Particle system
    private particleSystem = new ParticleSystem()

    // Navigation / obstacles
    private readonly navCellSize = 80
    private obstacles: Obstacle[] = []
    private navGrid!: NavGrid
    private enemyPathState: Map<string, {
        waypoints: Array<{ x: number; y: number }>;
        nextIndex: number;
        repathTimer: number
    }> = new Map()

    private canAddAbilityToInventory(ability: Ability): boolean {
        const count = this.player.inventory.filter(a => a.id === ability.id).length
        return count < 6
    }

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

        this.obstacles = this.createObstacles()
        this.navGrid = buildNavGrid(
            this.sceneManager.arenaWidth,
            this.sceneManager.arenaHeight,
            this.navCellSize,
            this.obstacles,
            20
        )

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
            mergesRemaining: 14,
            stats: {
                fireRate: 3.0,
                projectileSpeed: 250.0,
                maxEnergy: 100.0,
                xpBoost: 5.0,
                cooldownReduction: 1.0,
            },
            position: {
                x: 8000, y: 6000,
                z: 0
            },
            velocity: {
                x: 0, y: 0,
                z: 0
            },
            meshInstance: null,
        }

        // Add starting abilities to inventory (unequipped)
        player.inventory.push({ ...ABILITIES.shock_pulse })
        player.inventory.push({ ...ABILITIES.plasma_burst })
        player.inventory.push({ ...ABILITIES.gravity_field })
        player.inventory.push({ ...ABILITIES.drone_emp })

        return player
    }

    private createObstacles(): Obstacle[] {
        const obstacles: Obstacle[] = []
        let id = 0

        // Generate a grid-based obstacle field with procedural variation
        const gridSize = 400
        const gridCols = Math.ceil(this.sceneManager.arenaWidth / gridSize)
        const gridRows = Math.ceil(this.sceneManager.arenaHeight / gridSize)

        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                const baseX = col * gridSize + 50
                const baseY = row * gridSize + 50

                const obstaclesPerCell = Math.floor(Math.random() * 6)

                for (let i = 0; i < obstaclesPerCell; i++) {
                    const offsetX = Math.random() * (gridSize - 150)
                    const offsetY = Math.random() * (gridSize - 150)

                    const width = 50 + Math.random() * 150
                    const height = 50 + Math.random() * 150

                    const x = Math.max(20, Math.min(baseX + offsetX, this.sceneManager.arenaWidth - width - 20))
                    const y = Math.max(20, Math.min(baseY + offsetY, this.sceneManager.arenaHeight - height - 20))

                    const distToPlayer = Math.sqrt((x - 8000) ** 2 + (y - 6000) ** 2)
                    if (distToPlayer < 1500) {
                        continue
                    }

                    obstacles.push({
                        id: `obs-${id++}`,
                        x,
                        y,
                        width,
                        height,
                    })
                }
            }
        }

        return obstacles.slice(0, 2000)
    }

    private collidesWithObstacle(x: number, y: number, radius: number): boolean {
        return this.obstacles.some((o) => {
            const nearestX = Math.max(o.x, Math.min(x, o.x + o.width))
            const nearestY = Math.max(o.y, Math.min(y, o.y + o.height))
            const dx = x - nearestX
            const dy = y - nearestY
            return dx * dx + dy * dy < radius * radius
        })
    }

    private moveWithObstacleCollision(
        currentX: number,
        currentY: number,
        targetX: number,
        targetY: number,
        radius: number
    ): { x: number; y: number } {
        let x = targetX
        let y = currentY

        if (this.collidesWithObstacle(x, y, radius)) {
            x = currentX
        }

        y = targetY
        if (this.collidesWithObstacle(x, y, radius)) {
            y = currentY
        }

        return {x, y}
    }

    private getEnemyRadius(enemy: Enemy): number {
        const scale = ENEMY_TYPES[enemy.type]?.visuals?.scale ?? 1
        return 12 * scale
    }

    private updateAutoAim(): void {
        if (!this.autoAimEnabled || this.enemies.size === 0) {
            return
        }

        let nearestEnemy: Enemy | null = null
        let nearestDistance = Infinity

        this.enemies.forEach((enemy) => {
            const dx = enemy.position.x - this.player.position.x
            const dy = enemy.position.y - this.player.position.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < nearestDistance) {
                nearestDistance = distance
                nearestEnemy = enemy
            }
        })

        if (nearestEnemy) {
            const dx = nearestEnemy.position.x - this.player.position.x
            const dy = nearestEnemy.position.y - this.player.position.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance > 0) {
                this.shootDirection.x = dx / distance
                this.shootDirection.y = dy / distance

                this.mouseWorldPos.x = this.player.position.x + this.shootDirection.x * 300
                this.mouseWorldPos.y = this.player.position.y + this.shootDirection.y * 300
            }
        }
    }

    private setupInputHandlers(): void {
        const canvas = this.sceneManager.canvas

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase()
            this.keys[key] = true

            if (key === 'escape' && this.isMergeUIOpen) {
                this.closeMergeUI()
                return
            }

            if (key === 'm' && this.gameState.isRunning) {
                if (this.isMergeUIOpen) {
                    this.closeMergeUI()
                } else {
                    this.openMergeUI()
                }
                return
            }

            if (this.gameState.isPaused) {
                return
            }

            const slot = parseInt(e.key)
            if (slot >= 1 && slot <= 4 && this.gameState.isRunning) {
                this.castAbility(slot)
            }

            if (key === 'p') {
                this.debugMode = !this.debugMode
                const fpsCounter = document.getElementById('fps-counter')
                if (fpsCounter) {
                    fpsCounter.style.display = this.debugMode ? 'block' : 'none'
                }
            }

            if (key === 'o') {
                this.autoAimEnabled = !this.autoAimEnabled
                this.showNotification(`Auto-aim ${this.autoAimEnabled ? 'ON' : 'OFF'}`)
            }
        })

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false
        })

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect()
            const screenX = e.clientX - rect.left
            const screenY = e.clientY - rect.top

            const worldPos = this.sceneManager.screenToWorld(screenX, screenY)
            this.mouseWorldPos = worldPos

            if (!this.autoAimEnabled) {
                const dx = worldPos.x - this.player.position.x
                const dy = worldPos.y - this.player.position.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist > 0) {
                    this.shootDirection.x = dx / dist
                    this.shootDirection.y = dy / dist
                }
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
            position: {x: this.player.position.x, y: this.player.position.y, z: 0},
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

        const lastCastTime = this.abilityCooldowns.get(ability.id) || 0
        const effectiveCooldown = ability.cooldown / this.player.stats.cooldownReduction
        if (Date.now() - lastCastTime < effectiveCooldown * 1000) {
            return
        }

        this.abilityCooldowns.set(ability.id, Date.now())

        const abilityRadius = ability.radius || 100
        const abilityDamage = ability.damage || 20

        if (ability.id === 'shock_pulse') {
            this.particleSystem.createShockWave(this.player.position.x, this.player.position.y)
        } else if (ability.id === 'plasma_burst') {
            this.particleSystem.createPlasmaBurst(this.player.position.x, this.player.position.y)
        } else if (ability.id === 'gravity_field') {
            this.particleSystem.createGravityField(this.player.position.x, this.player.position.y)
        } else if (ability.id === 'drone_emp') {
            this.particleSystem.createEMPBlast(this.player.position.x, this.player.position.y)
        } else if (ability.id === 'energy_shield') {
            this.particleSystem.createShield(this.player.position.x, this.player.position.y, abilityRadius)
        }

        this.enemies.forEach((enemy) => {
            const dx = enemy.position.x - this.player.position.x
            const dy = enemy.position.y - this.player.position.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < abilityRadius) {
                this.damageEnemyInternal(enemy, abilityDamage)

                if (ability.id === 'shock_pulse' || ability.id === 'drone_emp') {
                    const enemyRef = enemy as any
                    enemyRef.stunned = true
                    enemyRef.stunEndTime = Date.now() + 1000
                } else if (ability.id === 'gravity_field') {
                    const pullStrength = 200
                    const angle = Math.atan2(dy, dx)
                    enemy.velocity.x = -Math.cos(angle) * pullStrength
                    enemy.velocity.y = -Math.sin(angle) * pullStrength
                } else if (ability.id === 'plasma_burst') {
                    const knockbackStrength = 150
                    const angle = Math.atan2(dy, dx)
                    enemy.velocity.x = Math.cos(angle) * knockbackStrength
                    enemy.velocity.y = Math.sin(angle) * knockbackStrength
                }

                this.particleSystem.createHit(enemy.position.x, enemy.position.y, '#ff00ff')
            }
        })
    }

    private startGameLoop(): void {
        this.sceneManager.render(() => {
            if (!this.gameState.isRunning) return

            this.frameCount++
            this.fpsCounter = Math.round(1000 / 16)

            const fpsDisplay = document.getElementById('fps-counter')
            if (fpsDisplay && fpsDisplay.style.display !== 'none') {
                fpsDisplay.textContent = `FPS: ${this.fpsCounter}`
            }

            this.update(1 / 60)
            this.render()
        })
    }

    private update(deltaTime: number): void {
        if (this.gameState.isPaused) {
            return
        }

        this.updateAutoAim()
        this.updatePlayerMovement(deltaTime)
        this.updateProjectiles(deltaTime)
        this.updateEnemies(deltaTime)
        this.updateAbilityCooldowns()
        this.particleSystem.update(deltaTime)
        this.updateWaves()

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

            const moveSpeed = 200
            const newX = this.player.position.x + moveX * moveSpeed * deltaTime
            const newY = this.player.position.y + moveY * moveSpeed * deltaTime

            const padding = 30
            const clampedX = clamp(newX, padding, this.sceneManager.arenaWidth - padding)
            const clampedY = clamp(newY, padding, this.sceneManager.arenaHeight - padding)

            const moved = this.moveWithObstacleCollision(
                this.player.position.x,
                this.player.position.y,
                clampedX,
                clampedY,
                15
            )
            this.player.position.x = moved.x
            this.player.position.y = moved.y
        }
    }

    private updateProjectiles(deltaTime: number): void {
        const projectilesToRemove: string[] = []

        this.projectiles.forEach((projectile) => {
            projectile.elapsed += deltaTime
            projectile.position.x += projectile.velocity.x * deltaTime
            projectile.position.y += projectile.velocity.y * deltaTime

            if (projectile.elapsed > projectile.lifespan) {
                projectilesToRemove.push(projectile.id)
            }

            if (this.collidesWithObstacle(projectile.position.x, projectile.position.y, 3)) {
                projectilesToRemove.push(projectile.id)
                return
            }

            this.enemies.forEach((enemy) => {
                const dx = projectile.position.x - enemy.position.x
                const dy = projectile.position.y - enemy.position.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 15) {
                    const template = ENEMY_TYPES[enemy.type]
                    const color = template?.visuals?.color || '#ff00ff'
                    this.particleSystem.createHit(projectile.position.x, projectile.position.y, color)

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
            updateEnemy(enemy, deltaTime)

            const enemyRef = enemy as any
            if (enemyRef.stunned && enemyRef.stunEndTime && Date.now() > enemyRef.stunEndTime) {
                enemyRef.stunned = false
            }

            if (enemyRef.stunned) {
                return
            }

            const radius = this.getEnemyRadius(enemy)
            const state = this.enemyPathState.get(enemy.id) ?? {
                waypoints: [] as Array<{ x: number; y: number }>,
                nextIndex: 0,
                repathTimer: 0,
            }
            state.repathTimer -= deltaTime

            if (state.repathTimer <= 0 || state.waypoints.length === 0 || state.nextIndex >= state.waypoints.length) {
                const startCell = worldToGrid(this.navGrid, enemy.position.x, enemy.position.y)
                const goalCell = worldToGrid(this.navGrid, this.player.position.x, this.player.position.y)
                const cellPath = findPathAStar(this.navGrid, startCell, goalCell)
                state.waypoints = toWorldPath(this.navGrid, cellPath)
                state.nextIndex = Math.min(1, Math.max(0, state.waypoints.length - 1))
                state.repathTimer = 0.45
            }

            if (state.waypoints.length > 0 && state.nextIndex < state.waypoints.length) {
                const target = state.waypoints[state.nextIndex]
                const toX = target.x - enemy.position.x
                const toY = target.y - enemy.position.y
                const dist = Math.sqrt(toX * toX + toY * toY)

                if (dist < 12) {
                    state.nextIndex++
                } else if (dist > 0) {
                    const moveX = (toX / dist) * enemy.speed * deltaTime
                    const moveY = (toY / dist) * enemy.speed * deltaTime
                    const moved = this.moveWithObstacleCollision(
                        enemy.position.x,
                        enemy.position.y,
                        enemy.position.x + moveX,
                        enemy.position.y + moveY,
                        radius
                    )
                    enemy.position.x = moved.x
                    enemy.position.y = moved.y
                }
            }

            this.enemyPathState.set(enemy.id, state)

            const dxToPlayer = this.player.position.x - enemy.position.x
            const dyToPlayer = this.player.position.y - enemy.position.y
            const distanceToPlayer = Math.sqrt(dxToPlayer * dxToPlayer + dyToPlayer * dyToPlayer)

            if (distanceToPlayer < 25) {
                this.player.currentEnergy = Math.max(0, this.player.currentEnergy - enemy.damage * deltaTime)
                this.updateUIHealth()
            }

            if (enemy.health <= 0) {
                const template = ENEMY_TYPES[enemy.type]
                const color = template?.visuals?.color || '#ff00ff'
                this.particleSystem.createExplosion(enemy.position.x, enemy.position.y, color, 30)
                enemiesToRemove.push(enemy.id)
            }
        })

        enemiesToRemove.forEach((id) => {
            this.enemies.delete(id)
            this.enemyPathState.delete(id)
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

        const waveDescription = getWaveDescription(this.gameState.currentWave)
        const difficultyIndicator = getDifficultyIndicator(this.gameState.currentWave)

        this.showNotification(`Wave ${this.gameState.currentWave}: ${waveDescription}`)
        console.log(`Wave ${this.gameState.currentWave} - Difficulty: ${difficultyIndicator}`)

        const spawnedEnemies = spawnWaveEnemies(
            this.gameState.currentWave,
            this.player.position.x,
            this.player.position.y
        )

        spawnedEnemies.forEach((enemy) => {
            const snappedCell = findNearestWalkableCell(
                this.navGrid,
                worldToGrid(this.navGrid, enemy.position.x, enemy.position.y)
            )
            const snapped = toWorldPath(this.navGrid, [snappedCell])[0]
            enemy.position.x = snapped.x
            enemy.position.y = snapped.y
            this.enemies.set(enemy.id, enemy)
        })
    }

    private damageEnemyInternal(enemy: Enemy, damage: number): void {
        if (damageEnemy(enemy, damage)) {
            const xpReward = Math.round(enemy.xpReward * this.player.stats.xpBoost)
            const leveledUp = addXPToPlayer(this.player, xpReward)

            if (leveledUp) {
                const ability = grantLevelUpAbility(this.player)

                if (ability) {
                    if (ability.type === 'active') {
                        for (let i = 0; i < 4; i++) {
                            if (!this.player.equippedAbilities[i]) {
                                this.player.equippedAbilities[i] = ability
                                break
                            }
                        }
                    } else {
                        recalculatePlayerStats(this.player)
                    }

                    this.particleSystem.createLevelUpBurst(this.player.position.x, this.player.position.y)
                    this.showNotification(`Level Up! Ability: ${ability.name}`)
                } else {
                    this.showNotification('Level Up! Ability pool exhausted')
                }

                this.updateUILevelAndXP()
                this.updateAbilityHotbar()
            } else {
                this.updateUILevelAndXP()
            }

            this.updateUIScore()
        }
    }

    private render(): void {
        this.sceneManager.updateCamera(this.player.position.x, this.player.position.y)

        this.sceneManager.clear()

        this.sceneManager.beginWorldRender()

        this.sceneManager.drawCircle(this.player.position.x, this.player.position.y, 15, '#00ff00')

        const dirX = this.player.position.x + this.shootDirection.x * 25
        const dirY = this.player.position.y + this.shootDirection.y * 25
        this.sceneManager.ctx.strokeStyle = '#00ff00'
        this.sceneManager.ctx.lineWidth = 3 / this.sceneManager.cameraZoom
        this.sceneManager.ctx.beginPath()
        this.sceneManager.ctx.moveTo(this.player.position.x, this.player.position.y)
        this.sceneManager.ctx.lineTo(dirX, dirY)
        this.sceneManager.ctx.stroke()

        if (this.gameState.isRunning) {
            this.sceneManager.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
            this.sceneManager.ctx.lineWidth = 1 / this.sceneManager.cameraZoom
            this.sceneManager.ctx.setLineDash([5 / this.sceneManager.cameraZoom, 5 / this.sceneManager.cameraZoom])
            this.sceneManager.ctx.beginPath()
            this.sceneManager.ctx.moveTo(this.player.position.x, this.player.position.y)
            this.sceneManager.ctx.lineTo(this.mouseWorldPos.x, this.mouseWorldPos.y)
            this.sceneManager.ctx.stroke()
            this.sceneManager.ctx.setLineDash([])
        }

        this.obstacles.forEach((obstacle) => {
            this.sceneManager.drawObstacle(obstacle)
        })

        this.enemies.forEach((enemy) => {
            const template = ENEMY_TYPES[enemy.type]
            const color = template?.visuals?.color || '#ff00ff'
            const size = template?.visuals?.scale ? 12 * template.visuals.scale : 12

            const eliteTypes = ['shield', 'phase', 'overclocked', 'regenerating']
            if (eliteTypes.includes(enemy.type)) {
                this.sceneManager.ctx.shadowBlur = 20
                this.sceneManager.ctx.shadowColor = color
                this.sceneManager.drawCircle(enemy.position.x, enemy.position.y, size + 3, color)
                this.sceneManager.ctx.shadowBlur = 0
            }

            this.sceneManager.drawCircle(enemy.position.x, enemy.position.y, size, color)
            this.sceneManager.drawHealthBar(enemy.position.x, enemy.position.y, enemy.health, enemy.maxHealth, 30)

            const pathState = this.enemyPathState.get(enemy.id)
            if (pathState && pathState.waypoints.length > 0) {
                this.sceneManager.ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)'
                this.sceneManager.ctx.lineWidth = 2 / this.sceneManager.cameraZoom
                this.sceneManager.ctx.beginPath()
                this.sceneManager.ctx.moveTo(enemy.position.x, enemy.position.y)

                for (let i = pathState.nextIndex; i < pathState.waypoints.length; i++) {
                    const waypoint = pathState.waypoints[i]
                    this.sceneManager.ctx.lineTo(waypoint.x, waypoint.y)
                }
                this.sceneManager.ctx.stroke()

                for (let i = pathState.nextIndex; i < pathState.waypoints.length; i++) {
                    const waypoint = pathState.waypoints[i]
                    this.sceneManager.ctx.fillStyle = 'rgba(255, 0, 255, 0.3)'
                    this.sceneManager.ctx.beginPath()
                    this.sceneManager.ctx.arc(waypoint.x, waypoint.y, 3 / this.sceneManager.cameraZoom, 0, Math.PI * 2)
                    this.sceneManager.ctx.fill()
                }
            }
        })

        this.projectiles.forEach((projectile) => {
            this.sceneManager.drawRect(projectile.position.x, projectile.position.y, 6, 6, '#ffff00')
        })

        if (this.gameState.isRunning) {
            const crosshairSize = 10
            this.sceneManager.ctx.strokeStyle = '#ffffff'
            this.sceneManager.ctx.lineWidth = 2 / this.sceneManager.cameraZoom

            this.sceneManager.ctx.beginPath()
            this.sceneManager.ctx.moveTo(this.mouseWorldPos.x, this.mouseWorldPos.y - crosshairSize)
            this.sceneManager.ctx.lineTo(this.mouseWorldPos.x, this.mouseWorldPos.y + crosshairSize)
            this.sceneManager.ctx.stroke()

            this.sceneManager.ctx.beginPath()
            this.sceneManager.ctx.moveTo(this.mouseWorldPos.x - crosshairSize, this.mouseWorldPos.y)
            this.sceneManager.ctx.lineTo(this.mouseWorldPos.x + crosshairSize, this.mouseWorldPos.y)
            this.sceneManager.ctx.stroke()

            this.sceneManager.ctx.beginPath()
            this.sceneManager.ctx.arc(this.mouseWorldPos.x, this.mouseWorldPos.y, 5, 0, Math.PI * 2)
            this.sceneManager.ctx.stroke()
        }

        this.particleSystem.render(this.sceneManager.ctx, this.sceneManager.cameraZoom)

        this.sceneManager.endWorldRender()
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

            const enemiesDefeated = document.getElementById('final-enemies')
            if (enemiesDefeated) {
                enemiesDefeated.textContent = this.gameState.totalEnemiesDefeated.toString()
            }
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

    private updateAbilityHotbar(): void {
        for (let i = 0; i < 4; i++) {
            const slot = document.querySelector(`.ability-slot[data-slot="${i + 1}"]`) as HTMLElement
            if (slot) {
                const ability = this.player.equippedAbilities[i]
                if (ability) {
                    slot.textContent = ability.name
                    slot.classList.add('has-ability')
                    slot.setAttribute('data-ability-id', ability.id)
                    slot.setAttribute('data-tooltip', buildAbilityTooltip(ability))
                } else {
                    slot.textContent = `${i + 1}`
                    slot.classList.remove('has-ability')
                    slot.removeAttribute('data-ability-id')
                    slot.removeAttribute('data-tooltip')
                }
                // Remove cooldown classes
                slot.classList.remove('cooldown')
                slot.style.opacity = '1'
            }
        }
    }

    private updateAbilityCooldowns(): void {
        for (let i = 0; i < 4; i++) {
            const ability = this.player.equippedAbilities[i]
            const slot = document.querySelector(`.ability-slot[data-slot="${i + 1}"]`) as HTMLElement

            if (!slot || !ability) continue

            const lastCastTime = this.abilityCooldowns.get(ability.id) || 0
            const effectiveCooldown = ability.cooldown / this.player.stats.cooldownReduction
            const timeSinceCast = (Date.now() - lastCastTime) / 1000
            const cooldownRemaining = Math.max(0, effectiveCooldown - timeSinceCast)

            if (cooldownRemaining > 0) {
                slot.classList.add('cooldown')
                const cooldownPercent = (cooldownRemaining / effectiveCooldown) * 100
                slot.style.opacity = String(0.4 + (cooldownPercent / 100) * 0.6)

                // Create or update cooldown text
                let cooldownText = slot.querySelector('.cooldown-text') as HTMLElement
                if (!cooldownText) {
                    cooldownText = document.createElement('div')
                    cooldownText.className = 'cooldown-text'
                    cooldownText.style.position = 'absolute'
                    cooldownText.style.top = '50%'
                    cooldownText.style.left = '50%'
                    cooldownText.style.transform = 'translate(-50%, -50%)'
                    cooldownText.style.color = '#fff'
                    cooldownText.style.fontSize = '14px'
                    cooldownText.style.fontWeight = 'bold'
                    cooldownText.style.textShadow = '0 0 4px #000'
                    cooldownText.style.zIndex = '10'
                    slot.appendChild(cooldownText)
                }
                cooldownText.textContent = cooldownRemaining.toFixed(1)
            } else {
                slot.classList.remove('cooldown')
                slot.style.opacity = '1'
                const cooldownText = slot.querySelector('.cooldown-text')
                if (cooldownText) cooldownText.remove()
            }
        }
    }

    public openMergeUI(): void {
        if (!this.gameState.isRunning) {
            return
        }

        const mergeUI = document.getElementById('merge-ui')
        if (mergeUI) {
            mergeUI.style.display = 'flex'
            this.isMergeUIOpen = true
            this.gameState.isPaused = true
            this.mergeSlot1 = null
            this.mergeSlot2 = null
            this.activeSelectSlot = null
            this.hotbarEditSlot = 1
            this.updateMergeCounter()
            this.updateMergeSlots()
            this.updateMergeButton()
            this.updateInventoryHotbarEditor()
            this.renderAbilityList()
        }
    }

    public closeMergeUI(): void {
        const mergeUI = document.getElementById('merge-ui')
        if (mergeUI) mergeUI.style.display = 'none'

        this.isMergeUIOpen = false
        this.mergeSlot1 = null
        this.mergeSlot2 = null
        this.activeSelectSlot = null
        this.gameState.isPaused = false
        this.updateMergeSlots()
    }

    public selectHotbarSlot(slot: 1 | 2 | 3 | 4): void {
        this.hotbarEditSlot = slot
        this.activeSelectSlot = null
        this.updateMergeSlots()
        this.updateInventoryHotbarEditor()
        this.renderAbilityList()
    }

    public clearSelectedHotbarSlot(): void {
        unequipAbility(this.player, this.hotbarEditSlot)
        this.updateAbilityHotbar()
        this.updateInventoryHotbarEditor()
    }

    private assignActiveAbilityToSelectedSlot(ability: Ability): void {
        if (ability.type !== 'active') {
            return
        }

        for (let i = 0; i < 4; i++) {
            const equipped = this.player.equippedAbilities[i]
            if (equipped?.id === ability.id && i !== this.hotbarEditSlot - 1) {
                unequipAbility(this.player, i + 1)
            }
        }

        equipAbility(this.player, ability, this.hotbarEditSlot)
        this.updateAbilityHotbar()
        this.updateInventoryHotbarEditor()
    }

    public selectMergeSlot(slot: 1 | 2): void {
        this.activeSelectSlot = slot
        this.updateMergeSlots()
        this.renderAbilityList()
    }

    public selectAbilityForMerge(ability: Ability): void {
        if (!this.activeSelectSlot) {
            this.activeSelectSlot = this.mergeSlot1 ? 2 : 1
        }

        if (this.activeSelectSlot === 1) {
            this.mergeSlot1 = ability
            this.activeSelectSlot = 2
        } else {
            this.mergeSlot2 = ability
            this.activeSelectSlot = this.mergeSlot1 ? null : 1
        }

        this.updateMergeSlots()
        this.updateMergeButton()
        this.renderAbilityList()
    }

    public confirmMerge(): void {
        if (this.player.mergesRemaining <= 0) {
            this.showNotification('No merges remaining this session!')
            return
        }

        if (!canMerge(this.mergeSlot1, this.mergeSlot2)) return

        const mergedAbility = mergeAbilities(this.mergeSlot1!, this.mergeSlot2!)

        for (let i = 0; i < 4; i++) {
            const equipped = this.player.equippedAbilities[i]
            if (equipped && (equipped.id === this.mergeSlot1!.id || equipped.id === this.mergeSlot2!.id)) {
                this.player.equippedAbilities[i] = null
            }
        }

        this.player.inventory = this.player.inventory.filter(
            a => a.id !== this.mergeSlot1!.id && a.id !== this.mergeSlot2!.id
        )

        this.player.inventory.push(mergedAbility)

        if (mergedAbility.type === 'active') {
            for (let i = 0; i < 4; i++) {
                if (!this.player.equippedAbilities[i]) {
                    this.player.equippedAbilities[i] = mergedAbility
                    break
                }
            }
        }

        this.player.mergesRemaining--

        if (mergedAbility.type === 'passive') {
            recalculatePlayerStats(this.player)
        }

        this.showNotification(`Created: ${mergedAbility.name}!`)
        this.updateAbilityHotbar()
        this.closeMergeUI()
    }

    private renderAbilityList(): void {
        const activeList = document.getElementById('ability-list-active')
        const passiveList = document.getElementById('ability-list-passive')
        if (!activeList || !passiveList) return

        activeList.innerHTML = ''
        passiveList.innerHTML = ''

        const availableForMerge = (ability: Ability): boolean => {
            if (this.activeSelectSlot === 1) {
                return ability.id !== this.mergeSlot2?.id
            }
            if (this.activeSelectSlot === 2) {
                return ability.id !== this.mergeSlot1?.id
            }
            return true
        }

        const createAbilityItem = (ability: Ability): HTMLElement => {
            const item = document.createElement('div')
            item.className = 'ability-item'
            item.textContent = ability.name
            item.setAttribute('data-tooltip', buildAbilityTooltip(ability))

            const isSelectedForMerge = ability.id === this.mergeSlot1?.id || ability.id === this.mergeSlot2?.id
            if (isSelectedForMerge) {
                item.classList.add('selected')
            }

            if (!availableForMerge(ability)) {
                item.classList.add('disabled')
            }

            item.onclick = () => {
                if (ability.type === 'active' && this.activeSelectSlot === null) {
                    this.assignActiveAbilityToSelectedSlot(ability)
                    return
                }

                if (this.activeSelectSlot === null) {
                    return
                }

                this.selectAbilityForMerge(ability)
            }

            return item
        }

        const activeAbilities = this.player.inventory.filter((ability) => ability.type === 'active')
        const passiveAbilities = this.player.inventory.filter((ability) => ability.type === 'passive')

        if (activeAbilities.length === 0) {
            activeList.innerHTML = '<div style="color: #888; padding: 10px;">No active abilities</div>'
        } else {
            activeAbilities.forEach((ability) => activeList.appendChild(createAbilityItem(ability)))
        }

        if (passiveAbilities.length === 0) {
            passiveList.innerHTML = '<div style="color: #888; padding: 10px;">No passive abilities</div>'
        } else {
            passiveAbilities.forEach((ability) => passiveList.appendChild(createAbilityItem(ability)))
        }
    }

    private updateInventoryHotbarEditor(): void {
        for (let i = 1; i <= 4; i++) {
            const slotButton = document.getElementById(`inv-hotbar-slot-${i}`) as HTMLButtonElement | null
            if (!slotButton) continue

            const ability = this.player.equippedAbilities[i - 1]
            slotButton.classList.toggle('active', i === this.hotbarEditSlot)
            slotButton.innerHTML = `
                <span class="slot-number">Slot ${i}</span>
                <span class="slot-ability ${ability ? '' : 'slot-empty'}">${ability ? ability.name : 'Empty'}</span>
            `
        }
    }

    private updateMergeSlots(): void {
        const slot1 = document.getElementById('merge-slot-1')
        const slot2 = document.getElementById('merge-slot-2')

        if (slot1) {
            slot1.innerHTML = this.mergeSlot1
                ? `<span>${this.mergeSlot1.name}</span>`
                : '<span>Select Ability 1</span>'
            slot1.className = `merge-slot${this.mergeSlot1 ? ' selected' : ''}${this.activeSelectSlot === 1 ? ' active' : ''}`
        }

        if (slot2) {
            slot2.innerHTML = this.mergeSlot2
                ? `<span>${this.mergeSlot2.name}</span>`
                : '<span>Select Ability 2</span>'
            slot2.className = `merge-slot${this.mergeSlot2 ? ' selected' : ''}${this.activeSelectSlot === 2 ? ' active' : ''}`
        }
    }

    private updateMergeButton(): void {
        const btn = document.getElementById('merge-confirm-btn') as HTMLButtonElement
        if (btn) {
            btn.disabled = this.player.mergesRemaining <= 0 || !canMerge(this.mergeSlot1, this.mergeSlot2)
        }
    }

    private updateMergeCounter(): void {
        const counter = document.getElementById('merge-counter')
        if (counter) {
            counter.textContent = `Merges Remaining: ${this.player.mergesRemaining}`
        }
    }
}

