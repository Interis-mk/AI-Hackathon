import { GridCell, NavGrid, Obstacle, TerrainPatch } from './types'

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function buildNavGrid(
  arenaWidth: number,
  arenaHeight: number,
  cellSize: number,
  obstacles: Obstacle[],
  terrainPatches: TerrainPatch[],
  padding: number = 10
): NavGrid {
  const cols = Math.ceil(arenaWidth / cellSize)
  const rows = Math.ceil(arenaHeight / cellSize)
  const blocked: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))
  const terrainCost: number[][] = Array.from({ length: rows }, () => Array(cols).fill(1.0))

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * cellSize + cellSize / 2
      const cy = row * cellSize + cellSize / 2

      blocked[row][col] = obstacles.some((o) =>
        cx >= o.x - padding &&
        cx <= o.x + o.width + padding &&
        cy >= o.y - padding &&
        cy <= o.y + o.height + padding
      )

      // Apply terrain cost
      for (const patch of terrainPatches) {
        if (cx >= patch.x && cx <= patch.x + patch.width &&
            cy >= patch.y && cy <= patch.y + patch.height) {
          terrainCost[row][col] = patch.pathfindingCost
          break
        }
      }
    }
  }

  return { cellSize, cols, rows, blocked, terrainCost }
}

export function worldToGrid(grid: NavGrid, x: number, y: number): GridCell {
  return {
    col: clamp(Math.floor(x / grid.cellSize), 0, grid.cols - 1),
    row: clamp(Math.floor(y / grid.cellSize), 0, grid.rows - 1),
  }
}

export function gridToWorld(grid: NavGrid, cell: GridCell): { x: number; y: number } {
  return {
    x: cell.col * grid.cellSize + grid.cellSize / 2,
    y: cell.row * grid.cellSize + grid.cellSize / 2,
  }
}

export function isWalkable(grid: NavGrid, cell: GridCell): boolean {
  if (cell.col < 0 || cell.col >= grid.cols || cell.row < 0 || cell.row >= grid.rows) {
    return false
  }
  return !grid.blocked[cell.row][cell.col]
}

export function findNearestWalkableCell(grid: NavGrid, start: GridCell): GridCell {
  if (isWalkable(grid, start)) return start

  const maxRadius = Math.max(grid.cols, grid.rows)
  for (let radius = 1; radius <= maxRadius; radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue
        const candidate = { col: start.col + dx, row: start.row + dy }
        if (isWalkable(grid, candidate)) return candidate
      }
    }
  }

  return start
}

interface NodeRec {
  cell: GridCell
  g: number
  f: number
  key: string
}

function keyOf(cell: GridCell): string {
  return `${cell.col},${cell.row}`
}

function heuristic(a: GridCell, b: GridCell): number {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row)
}

function neighbors(grid: NavGrid, c: GridCell): GridCell[] {
  const out: GridCell[] = []
  const dirs = [
    { dc: 1, dr: 0 },
    { dc: -1, dr: 0 },
    { dc: 0, dr: 1 },
    { dc: 0, dr: -1 },
    { dc: 1, dr: 1 },
    { dc: 1, dr: -1 },
    { dc: -1, dr: 1 },
    { dc: -1, dr: -1 },
  ]

  for (const d of dirs) {
    const n = { col: c.col + d.dc, row: c.row + d.dr }
    if (!isWalkable(grid, n)) continue

    if (d.dc !== 0 && d.dr !== 0) {
      const sideA = { col: c.col + d.dc, row: c.row }
      const sideB = { col: c.col, row: c.row + d.dr }
      if (!isWalkable(grid, sideA) || !isWalkable(grid, sideB)) {
        continue
      }
    }

    out.push(n)
  }

  return out
}

export function findPathAStar(grid: NavGrid, startRaw: GridCell, goalRaw: GridCell): GridCell[] {
  const start = findNearestWalkableCell(grid, startRaw)
  const goal = findNearestWalkableCell(grid, goalRaw)

  if (!isWalkable(grid, start) || !isWalkable(grid, goal)) return []

  const open: NodeRec[] = []
  const cameFrom = new Map<string, string>()
  const gScore = new Map<string, number>()
  const closed = new Set<string>()

  const startKey = keyOf(start)
  gScore.set(startKey, 0)
  open.push({ cell: start, g: 0, f: heuristic(start, goal), key: startKey })

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f)
    const current = open.shift()!

    if (current.cell.col === goal.col && current.cell.row === goal.row) {
      const path: GridCell[] = [goal]
      let k = keyOf(goal)
      while (cameFrom.has(k)) {
        const prevKey = cameFrom.get(k)!
        const [col, row] = prevKey.split(',').map(Number)
        path.push({ col, row })
        k = prevKey
      }
      return path.reverse()
    }

    closed.add(current.key)

    for (const n of neighbors(grid, current.cell)) {
      const nKey = keyOf(n)
      if (closed.has(nKey)) continue

      const stepCost = (n.col !== current.cell.col && n.row !== current.cell.row) ? 1.414 : 1
      const terrainCost = grid.terrainCost[n.row][n.col]
      const tentativeG = (gScore.get(current.key) ?? Infinity) + (stepCost * terrainCost)

      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        cameFrom.set(nKey, current.key)
        gScore.set(nKey, tentativeG)
        const f = tentativeG + heuristic(n, goal)

        const existing = open.find((o) => o.key === nKey)
        if (existing) {
          existing.g = tentativeG
          existing.f = f
        } else {
          open.push({ cell: n, g: tentativeG, f, key: nKey })
        }
      }
    }
  }

  return []
}

export function toWorldPath(grid: NavGrid, cells: GridCell[]): Array<{ x: number; y: number }> {
  return cells.map((c) => gridToWorld(grid, c))
}

