/**
 * Simple Particle System for 2D Canvas
 * Handles visual effects like explosions, hits, trails
 */

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
}

export class ParticleSystem {
  private particles: Particle[] = []

  /**
   * Create an explosion effect at a position
   */
  public createExplosion(x: number, y: number, color: string, count: number = 20): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 50 + Math.random() * 100

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.5,
        size: 2 + Math.random() * 3,
        color,
        alpha: 1,
      })
    }
  }

  /**
   * Create a hit effect (small burst)
   */
  public createHit(x: number, y: number, color: string): void {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 30 + Math.random() * 50

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.3 + Math.random() * 0.3,
        size: 1 + Math.random() * 2,
        color,
        alpha: 1,
      })
    }
  }

  /**
   * Create a level-up burst effect
   */
  public createLevelUpBurst(x: number, y: number): void {
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40
      const speed = 80 + Math.random() * 120

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 1.0,
        size: 3 + Math.random() * 4,
        color: i % 2 === 0 ? '#00ff00' : '#ffff00',
        alpha: 1,
      })
    }
  }

  /**
   * Create a lightning/shock effect
   */
  public createShockWave(x: number, y: number): void {
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60
      const speed = 100 + Math.random() * 200

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.6,
        size: 2 + Math.random() * 4,
        color: '#00ffff',
        alpha: 1,
      })
    }
  }

  /**
   * Create a plasma burst effect
   */
  public createPlasmaBurst(x: number, y: number): void {
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80
      const speed = 80 + Math.random() * 250

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.8,
        size: 3 + Math.random() * 5,
        color: i % 2 === 0 ? '#ff6600' : '#ffff00',
        alpha: 1,
      })
    }
  }

  /**
   * Create a gravity field effect (inward spiral)
   */
  public createGravityField(x: number, y: number): void {
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = 200 + Math.random() * 400

      this.particles.push({
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        vx: -Math.cos(angle) * 150,
        vy: -Math.sin(angle) * 150,
        life: 0,
        maxLife: 0.7,
        size: 2 + Math.random() * 3,
        color: '#aa00ff',
        alpha: 1,
      })
    }
  }

  /**
   * Create an EMP blast effect
   */
  public createEMPBlast(x: number, y: number): void {
    for (let i = 0; i < 100; i++) {
      const angle = (Math.PI * 2 * i) / 100
      const speed = 150 + Math.random() * 250

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.5,
        size: 1 + Math.random() * 3,
        color: '#ffff00',
        alpha: 1,
      })
    }
  }

  /**
   * Create a protective shield effect
   */
  public createShield(x: number, y: number, radius: number = 150): void {
    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50
      const r = radius + Math.random() * 30

      this.particles.push({
        x: x + Math.cos(angle) * r,
        y: y + Math.sin(angle) * r,
        vx: Math.cos(angle) * 50,
        vy: Math.sin(angle) * 50,
        life: 0,
        maxLife: 0.8,
        size: 2 + Math.random() * 3,
        color: '#00ff88',
        alpha: 1,
      })
    }
  }

  /**
   * Create a ring/wave effect expanding outward
   */
  public createWave(x: number, y: number, maxRadius: number, color: string): void {
    const rings = 5
    for (let ring = 0; ring < rings; ring++) {
      const particlesPerRing = 40
      for (let i = 0; i < particlesPerRing; i++) {
        const angle = (Math.PI * 2 * i) / particlesPerRing
        const initialDistance = (maxRadius / rings) * ring
        const speed = 200 + ring * 50

        this.particles.push({
          x: x + Math.cos(angle) * initialDistance,
          y: y + Math.sin(angle) * initialDistance,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 0.6,
          size: 2 + Math.random() * 2,
          color,
          alpha: 1,
        })
      }
    }
  }

  /**
   * Update all particles
   */
  public update(deltaTime: number): void {
    this.particles = this.particles.filter(p => {
      p.life += deltaTime

      // Update position
      p.x += p.vx * deltaTime
      p.y += p.vy * deltaTime

      // Apply gravity/drag
      p.vy += 100 * deltaTime // Slight downward pull
      p.vx *= 0.98

      // Fade out
      p.alpha = 1 - (p.life / p.maxLife)

      // Remove dead particles
      return p.life < p.maxLife
    })
  }

  /**
   * Render all particles
   */
  public render(ctx: CanvasRenderingContext2D, cameraZoom: number): void {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size / cameraZoom, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
  }

  /**
   * Get particle count for performance monitoring
   */
  public getCount(): number {
    return this.particles.length
  }

  /**
   * Clear all particles
   */
  public clear(): void {
    this.particles = []
  }
}

