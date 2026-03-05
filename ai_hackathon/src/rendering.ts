/**
 * Babylon.js Scene Management
 * Handles rendering, camera, lighting, and 3D objects
 */

import * as BABYLON from 'babylonjs'

export class SceneManager {
  public engine: BABYLON.Engine
  public scene: BABYLON.Scene
  public canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true })
    this.scene = new BABYLON.Scene(this.engine)

    this.initializeScene()
    this.setupResizeHandler()
  }

  private initializeScene(): void {
    // Set clear color (dark space background)
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)

    // Setup lighting
    this.setupLighting()

    // Setup arena
    this.createArena()

    // Setup camera
    this.setupCamera()

    // Enable physics if needed
    this.scene.enablePhysics()
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new BABYLON.HemisphericLight('ambient', new BABYLON.Vector3(0, 1, 0), this.scene)
    ambientLight.intensity = 0.6
    ambientLight.specular = new BABYLON.Color3(0, 0, 0)

    // Main directional light
    const dirLight = new BABYLON.PointLight('dirLight', new BABYLON.Vector3(0, 50, 0), this.scene)
    dirLight.intensity = 0.8
    dirLight.range = 200

    // Neon glow lights
    const redLight = new BABYLON.PointLight('redLight', new BABYLON.Vector3(-40, 20, 40), this.scene)
    redLight.diffuse = new BABYLON.Color3(1, 0, 0)
    redLight.intensity = 0.3
    redLight.range = 100

    const blueLight = new BABYLON.PointLight('blueLight', new BABYLON.Vector3(40, 20, -40), this.scene)
    blueLight.diffuse = new BABYLON.Color3(0, 0, 1)
    blueLight.intensity = 0.3
    blueLight.range = 100
  }

  private createArena(): void {
    // Arena floor (grid pattern)
    const floorMaterial = new BABYLON.StandardMaterial('floorMat', this.scene)
    floorMaterial.emissiveColor = new BABYLON.Color3(0, 0.5, 0)
    floorMaterial.backFaceCulling = false

    const floor = BABYLON.MeshBuilder.CreateGround('floor', { width: 100, height: 100 }, this.scene)
    floor.material = floorMaterial
    floor.position.y = 0

    // Arena walls
    const wallMaterial = new BABYLON.StandardMaterial('wallMat', this.scene)
    wallMaterial.emissiveColor = new BABYLON.Color3(0, 0.3, 0.5)
    wallMaterial.backFaceCulling = false

    const wallThickness = 2
    const wallHeight = 30
    const arenaSize = 100

    // North wall
    const wallNorth = BABYLON.MeshBuilder.CreateBox(
      'wallNorth',
      { width: arenaSize, height: wallHeight, depth: wallThickness },
      this.scene
    )
    wallNorth.position = new BABYLON.Vector3(0, wallHeight / 2, -arenaSize / 2)
    wallNorth.material = wallMaterial

    // South wall
    const wallSouth = BABYLON.MeshBuilder.CreateBox(
      'wallSouth',
      { width: arenaSize, height: wallHeight, depth: wallThickness },
      this.scene
    )
    wallSouth.position = new BABYLON.Vector3(0, wallHeight / 2, arenaSize / 2)
    wallSouth.material = wallMaterial

    // East wall
    const wallEast = BABYLON.MeshBuilder.CreateBox(
      'wallEast',
      { width: wallThickness, height: wallHeight, depth: arenaSize },
      this.scene
    )
    wallEast.position = new BABYLON.Vector3(arenaSize / 2, wallHeight / 2, 0)
    wallEast.material = wallMaterial

    // West wall
    const wallWest = BABYLON.MeshBuilder.CreateBox(
      'wallWest',
      { width: wallThickness, height: wallHeight, depth: arenaSize },
      this.scene
    )
    wallWest.position = new BABYLON.Vector3(-arenaSize / 2, wallHeight / 2, 0)
    wallWest.material = wallMaterial

    // Store arena bounds for collision
    ;(this.scene as any).arenaBounds = {
      minX: -arenaSize / 2 + wallThickness,
      maxX: arenaSize / 2 - wallThickness,
      minZ: -arenaSize / 2 + wallThickness,
      maxZ: arenaSize / 2 - wallThickness,
    }
  }

  private setupCamera(): void {
    const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 5, 0), this.scene)
    camera.attachControl(this.canvas, true)
    camera.speed = 0
    camera.inertia = 0
    camera.angularSensibility = 1000
    camera.minZ = 0.1
    camera.fov = 1.2
  }

  private setupResizeHandler(): void {
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }

  /**
   * Create a player mesh (capsule shape)
   */
  public createPlayerMesh(position: { x: number; y: number; z: number }): BABYLON.Mesh {
    const material = new BABYLON.StandardMaterial('playerMat', this.scene)
    material.emissiveColor = new BABYLON.Color3(0, 1, 0)

    // Create a capsule (cylinder + spheres)
    const cylinder = BABYLON.MeshBuilder.CreateCylinder('playerBody', { height: 3, diameter: 1 }, this.scene)
    const sphere = BABYLON.MeshBuilder.CreateSphere('playerHead', { diameter: 1 }, this.scene)
    sphere.position.y = 1.8

    const player = BABYLON.Mesh.CreateBox('player', 1, this.scene)
    cylinder.parent = player
    sphere.parent = player

    player.material = material
    player.position = new BABYLON.Vector3(position.x, position.y, position.z)

    return player
  }

  /**
   * Create an enemy mesh (sphere with color)
   */
  public createEnemyMesh(
    position: { x: number; y: number; z: number },
    color: string,
    scale: number = 1
  ): BABYLON.Mesh {
    const enemy = BABYLON.MeshBuilder.CreateSphere('enemy', { diameter: 1.5 }, this.scene)

    const material = new BABYLON.StandardMaterial('enemyMat_' + Math.random(), this.scene)
    material.emissiveColor = BABYLON.Color3.FromHexString(color)

    enemy.material = material
    enemy.position = new BABYLON.Vector3(position.x, position.y, position.z)
    enemy.scaling = new BABYLON.Vector3(scale, scale, scale)

    return enemy
  }

  /**
   * Create a projectile mesh (small sphere)
   */
  public createProjectileMesh(
    position: { x: number; y: number; z: number }
  ): BABYLON.Mesh {
    const projectile = BABYLON.MeshBuilder.CreateSphere('projectile', { diameter: 0.5 }, this.scene)

    const material = new BABYLON.StandardMaterial('projectileMat_' + Math.random(), this.scene)
    material.emissiveColor = new BABYLON.Color3(1, 1, 0)

    projectile.material = material
    projectile.position = new BABYLON.Vector3(position.x, position.y, position.z)

    return projectile
  }

  /**
   * Create a health bar GUI above an object
   */
  public createHealthBar(owner: BABYLON.Mesh, health: number, maxHealth: number): BABYLON.GUI.TextBlock {
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')

    const healthBar = new BABYLON.GUI.TextBlock()
    healthBar.text = `${Math.round(health)}/${maxHealth}`
    healthBar.color = 'white'
    healthBar.fontSize = 12
    healthBar.linkOffsetYInPixels = -100

    advancedTexture.addControl(healthBar)

    // Link to world position (will update each frame)
    ;(healthBar as any).linkedMesh = owner

    return healthBar
  }

  /**
   * Update health bar position (called each frame)
   */
  public updateHealthBars(): void {
    // This will be called from the game loop
  }

  /**
   * Run render loop
   */
  public render(callback: () => void): void {
    this.engine.runRenderLoop(() => {
      callback()
      this.scene.render()
    })
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    this.scene.dispose()
    this.engine.dispose()
  }
}

