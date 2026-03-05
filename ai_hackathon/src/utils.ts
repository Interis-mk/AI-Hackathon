/**
 * Utility functions
 */

/**
 * Generate a unique UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Vector 3 math utilities
 */
export class Vector3 {
  constructor(public x: number, public y: number, public z: number) {}

  static zero(): Vector3 {
    return new Vector3(0, 0, 0)
  }

  static from(obj: { x: number; y: number; z: number }): Vector3 {
    return new Vector3(obj.x, obj.y, obj.z)
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z)
  }

  subtract(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z)
  }

  multiply(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  normalize(): Vector3 {
    const len = this.length()
    if (len === 0) return new Vector3(0, 0, 0)
    return new Vector3(this.x / len, this.y / len, this.z / len)
  }

  distance(other: Vector3): number {
    return this.subtract(other).length()
  }

  static distance(a: Vector3, b: Vector3): number {
    return a.distance(b)
  }

  dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z
  }
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1)
}

/**
 * Ease out cubic
 */
export function easeOutCubic(t: number): number {
  t = clamp(t, 0, 1)
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Delay function (returns a promise)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Random int between min (inclusive) and max (exclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * Random float between min (inclusive) and max (exclusive)
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

