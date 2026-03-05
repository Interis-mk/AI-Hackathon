/**
 * Main entry point for AI Arena game
 */

import { GameManager } from './game'

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) {
    console.error('Canvas element not found')
    return
  }

  // Create game manager
  const game = new GameManager(canvas)

  // Expose to window for HTML onclick handlers
  ;(window as any).game = game

  console.log('AI Arena initialized. Click "Start Game" button to begin.')
})

