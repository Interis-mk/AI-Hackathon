/**
 * 2D Canvas Rendering
 * Handles all 2D game rendering using HTML5 Canvas
 */

export class SceneManager {
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  public width: number
  public height: number

  // Arena dimensions
  public arenaWidth = 800
  public arenaHeight = 600
  public arenaOffsetX: number
  public arenaOffsetY: number

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas')
    }
    this.ctx = ctx

    this.width = canvas.width
    this.height = canvas.height
    this.arenaOffsetX = (this.width - this.arenaWidth) / 2
    this.arenaOffsetY = (this.height - this.arenaHeight) / 2

    this.setupResizeHandler()
  }

  private setupResizeHandler(): void {
    window.addEventListener('resize', () => {
      // Canvas size is fixed in HTML, no need to resize
    })
  }

  /**
   * Clear the canvas with dark background
   */
  public clear(): void {
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.width, this.height)

    // Draw arena background
    this.ctx.fillStyle = '#001a00'
    this.ctx.fillRect(this.arenaOffsetX, this.arenaOffsetY, this.arenaWidth, this.arenaHeight)

    // Draw arena border
    this.ctx.strokeStyle = '#00ff00'
    this.ctx.lineWidth = 3
    this.ctx.strokeRect(this.arenaOffsetX, this.arenaOffsetY, this.arenaWidth, this.arenaHeight)

    // Draw grid pattern
    this.drawGrid()
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)'
    this.ctx.lineWidth = 1
    const gridSize = 50

    for (let x = this.arenaOffsetX; x < this.arenaOffsetX + this.arenaWidth; x += gridSize) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, this.arenaOffsetY)
      this.ctx.lineTo(x, this.arenaOffsetY + this.arenaHeight)
      this.ctx.stroke()
    }

    for (let y = this.arenaOffsetY; y < this.arenaOffsetY + this.arenaHeight; y += gridSize) {
      this.ctx.beginPath()
      this.ctx.moveTo(this.arenaOffsetX, y)
      this.ctx.lineTo(this.arenaOffsetX + this.arenaWidth, y)
      this.ctx.stroke()
    }
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
    this.ctx.lineWidth = lineWidth
    this.ctx.stroke()
  }

  /**
   * Draw a rectangle (used for projectiles)
   */
  public drawRect(x: number, y: number, width: number, height: number, color: string): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x - width / 2, y - height / 2, width, height)
  }

  /**
   * Draw a health bar above an entity
   */
  public drawHealthBar(x: number, y: number, health: number, maxHealth: number, width: number = 30): void {
    const barHeight = 4
    const healthPercentage = Math.max(0, health / maxHealth)

    // Background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(x - width / 2, y - 20, width, barHeight)

    // Health bar
    const healthColor = healthPercentage > 0.5 ? '#00ff00' : healthPercentage > 0.25 ? '#ffff00' : '#ff0000'
    this.ctx.fillStyle = healthColor
    this.ctx.fillRect(x - width / 2, y - 20, width * healthPercentage, barHeight)

    // Border
    this.ctx.strokeStyle = healthColor
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(x - width / 2, y - 20, width, barHeight)
  }

  /**
   * Draw text
   */
  public drawText(text: string, x: number, y: number, color: string = '#fff', fontSize: number = 14): void {
    this.ctx.fillStyle = color
    this.ctx.font = `${fontSize}px Arial`
    this.ctx.textAlign = 'center'
    this.ctx.fillText(text, x, y)
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  public worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: this.arenaOffsetX + worldX,
      y: this.arenaOffsetY + worldY,
    }
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  public screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX - this.arenaOffsetX,
      y: screenY - this.arenaOffsetY,
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

