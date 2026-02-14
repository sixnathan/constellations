import { GRID_SIZE, SHAPES, COLORS } from "../constants.js";

export function emptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

export function cloneGrid(grid) {
  return grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export function allCells(grid) {
  const cells = [];
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
      if (grid[r][c]) cells.push({ r, c, ...grid[r][c] });
  return cells;
}

export function getNeighbors(r, c) {
  const n = [];
  if (r > 0) n.push([r - 1, c]);
  if (r < GRID_SIZE - 1) n.push([r + 1, c]);
  if (c > 0) n.push([r, c - 1]);
  if (c < GRID_SIZE - 1) n.push([r, c + 1]);
  return n;
}

export function getDiagonalNeighbors(r, c) {
  const n = [];
  if (r > 0 && c > 0) n.push([r - 1, c - 1]);
  if (r > 0 && c < GRID_SIZE - 1) n.push([r - 1, c + 1]);
  if (r < GRID_SIZE - 1 && c > 0) n.push([r + 1, c - 1]);
  if (r < GRID_SIZE - 1 && c < GRID_SIZE - 1) n.push([r + 1, c + 1]);
  return n;
}

export function randomSymbol() {
  return {
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

export function randomBoard(minSymbols = 2, maxSymbols = 12) {
  const grid = emptyGrid();
  const count =
    minSymbols + Math.floor(Math.random() * (maxSymbols - minSymbols + 1));
  const positions = [];
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++) positions.push([r, c]);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  for (let i = 0; i < Math.min(count, GRID_SIZE * GRID_SIZE); i++) {
    const [r, c] = positions[i];
    grid[r][c] = randomSymbol();
  }
  return grid;
}

export function generateExamples(rule) {
  const valid = [];
  const invalid = [];
  const ranges = [
    [2, 5],
    [5, 10],
    [8, 15],
  ];

  for (let tier = 0; tier < 3; tier++) {
    let found = false;
    for (let attempt = 0; attempt < 800; attempt++) {
      const g = randomBoard(ranges[tier][0], ranges[tier][1]);
      if (rule.evaluate(g)) {
        valid.push(g);
        found = true;
        break;
      }
    }
    if (!found) valid.push(emptyGrid());
  }

  for (let tier = 0; tier < 3; tier++) {
    let found = false;
    for (let attempt = 0; attempt < 800; attempt++) {
      const g = randomBoard(ranges[tier][0], ranges[tier][1]);
      if (!rule.evaluate(g)) {
        invalid.push(g);
        found = true;
        break;
      }
    }
    if (!found) {
      // Mutate a valid board to break the rule
      for (const v of valid) {
        for (let attempt = 0; attempt < 200; attempt++) {
          const g = cloneGrid(v);
          const r = Math.floor(Math.random() * GRID_SIZE);
          const c = Math.floor(Math.random() * GRID_SIZE);
          g[r][c] = g[r][c] ? null : randomSymbol();
          if (!rule.evaluate(g)) {
            invalid.push(g);
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) invalid.push(emptyGrid());
    }
  }

  return { valid, invalid };
}
