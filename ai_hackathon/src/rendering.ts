/**
 * 2D Canvas Rendering
 * Handles all 2D game rendering using HTML5 Canvas
 */

import { Obstacle } from './types'

export class SceneManager {
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  public width: number
  public height: number

  // Arena dimensions - much larger world space
  public arenaWidth = 16000
  public arenaHeight = 12000

  // Camera system for zooming and following player
  public cameraX: number = 800
  public cameraY: number = 600
  public cameraZoom: number = 0.75 // 0.6 = zoomed out (see more), 1.0 = normal

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas')
    }
    this.ctx = ctx

    // Set canvas resolution to match display size
    // This is CRITICAL for accurate mouse coordinate conversion
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    this.width = canvas.width
    this.height = canvas.height

    this.setupResizeHandler()
  }

  /**
   * Update camera to follow a position (like the player)
   */
  public updateCamera(targetX: number, targetY: number): void {
    // No smoothing for perfectly accurate mouse aiming
    this.cameraX = targetX
    this.cameraY = targetY
  }

  private setupResizeHandler(): void {
    window.addEventListener('resize', () => {
      const rect = this.canvas.getBoundingClientRect()
      this.canvas.width = rect.width
      this.canvas.height = rect.height
      this.width = this.canvas.width
      this.height = this.canvas.height
    })
  }

  /**
   * Clear the canvas with dark background and apply camera transform
   */
  public clear(): void {
    // Clear entire canvas
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.width, this.height)

    // Save context and apply camera transformation
    this.ctx.save()
    this.ctx.translate(this.width / 2, this.height / 2)
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
    this.ctx.translate(-this.cameraX, -this.cameraY)

    // Draw arena background
    this.ctx.fillStyle = '#001a00'
    this.ctx.fillRect(0, 0, this.arenaWidth, this.arenaHeight)

    // Draw arena border
    this.ctx.strokeStyle = '#00ff00'
    this.ctx.lineWidth = 4 / this.cameraZoom // Scale line width for zoom
    this.ctx.strokeRect(0, 0, this.arenaWidth, this.arenaHeight)

    // Draw grid pattern
    this.drawGrid()

    // Restore context for UI elements drawn later
    this.ctx.restore()
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.15)'
    this.ctx.lineWidth = 1 / this.cameraZoom
    const gridSize = 100

    for (let x = 0; x <= this.arenaWidth; x += gridSize) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, this.arenaHeight)
      this.ctx.stroke()
    }

    for (let y = 0; y <= this.arenaHeight; y += gridSize) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(this.arenaWidth, y)
      this.ctx.stroke()
    }
  }

  /**
   * Begin drawing in world space (with camera transform)
   */
  public beginWorldRender(): void {
    this.ctx.save()
    this.ctx.translate(this.width / 2, this.height / 2)
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
    this.ctx.translate(-this.cameraX, -this.cameraY)
  }

  /**
   * End world space rendering
   */
  public endWorldRender(): void {
    this.ctx.restore()
  }

  /**
   * Draw a circle (used for player and enemies)
   */
  public drawCircle(x: number, y: number, radius: number, color: string, lineWidth: number = 2): void {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    this.ctx.lineWidth = lineWidth / this.cameraZoom
    this.ctx.stroke()
  }

  /**
   * Draw a rectangle (used for projectiles)
   */
  public drawRect(x: number, y: number, width: number, height: number, color: string): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x - width / 2, y - height / 2, width, height)
  }

  public drawObstacle(obstacle: Obstacle): void {
    this.ctx.fillStyle = '#2b2b2b'
    this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)

    this.ctx.strokeStyle = '#00aaff'
    this.ctx.lineWidth = 2 / this.cameraZoom
    this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
  }

  /**
   * Draw a health bar above an entity
   */
  public drawHealthBar(x: number, y: number, health: number, maxHealth: number, width: number = 40): void {
    const barHeight = 5 / this.cameraZoom;
    const healthPercentage = Math.max(0, health / maxHealth);
    const offsetY = 25 / this.cameraZoom;

    // Background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(x - width / 2, y - offsetY, width, barHeight);

    // Health bar
    const healthColor = healthPercentage > 0.5 ? '#00ff00' : healthPercentage > 0.25 ? '#ffff00' : '#ff0000'
    this.ctx.fillStyle = healthColor;
    this.ctx.fillRect(x - width / 2, y - offsetY, width * healthPercentage, barHeight)

    // Border
    this.ctx.strokeStyle = healthColor
    this.ctx.lineWidth = 1 / this.cameraZoom
    this.ctx.strokeRect(x - width / 2, y - offsetY, width, barHeight)
  }

  /**
   * Draw text
   */
  public drawText(text: string, x: number, y: number, color: string = '#fff', fontSize: number = 14): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize / this.cameraZoom}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x, y)
  }

  /**
   * Convert screen coordinates to world coordinates (for mouse input)
   */
  public screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    const centerX = this.width / 2
    const centerY = this.height / 2

    return {
      x: (screenX - centerX) / this.cameraZoom + this.cameraX,
      y: (screenY - centerY) / this.cameraZoom + this.cameraY,
    }
  }

  /**
   * Check if world coordinates are in bounds
   */
  public isInBounds(x: number, y: number): boolean {
    return x >= 0 && x <= this.arenaWidth && y >= 0 && y <= this.arenaHeight
  }

  /**
   * Run the render loop
   */
  public render(callback: () => void): void {
    const loop = () => {
      callback()
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }

  /**
   * Dispose of resources (no-op for canvas)
   */
  public dispose(): void {
    // Canvas doesn't need cleanup
  }
}
