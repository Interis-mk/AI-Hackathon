/**
 * Main entry point for AI Arena game
 */

import {GameManager} from './game2d'

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) {
    console.error('Canvas element not found')
    return
  }

  // Create game manager
    (window as any).game = new GameManager(canvas)

  console.log('AI Arena (2D) initialized. Click "Start Game" button to begin.')
})

