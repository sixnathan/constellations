import { SHAPES, COLORS } from "../constants.js";

export function emptyGrid(gridSize) {
  return Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
}

export function cloneGrid(grid) {
  return grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export function allCells(grid) {
  const cells = [];
  const size = grid.length;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c]) cells.push({ r, c, ...grid[r][c] });
  return cells;
}

export function getNeighbors(r, c, gridSize) {
  const n = [];
  if (r > 0) n.push([r - 1, c]);
  if (r < gridSize - 1) n.push([r + 1, c]);
  if (c > 0) n.push([r, c - 1]);
  if (c < gridSize - 1) n.push([r, c + 1]);
  return n;
}

export function getDiagonalNeighbors(r, c, gridSize) {
  const n = [];
  if (r > 0 && c > 0) n.push([r - 1, c - 1]);
  if (r > 0 && c < gridSize - 1) n.push([r - 1, c + 1]);
  if (r < gridSize - 1 && c > 0) n.push([r + 1, c - 1]);
  if (r < gridSize - 1 && c < gridSize - 1) n.push([r + 1, c + 1]);
  return n;
}

export function randomSymbol() {
  return {
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

export function randomBoard(minSymbols, maxSymbols, gridSize) {
  const grid = emptyGrid(gridSize);
  const count =
    minSymbols + Math.floor(Math.random() * (maxSymbols - minSymbols + 1));
  const positions = [];
  for (let r = 0; r < gridSize; r++)
    for (let c = 0; c < gridSize; c++) positions.push([r, c]);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  for (let i = 0; i < Math.min(count, gridSize * gridSize); i++) {
    const [r, c] = positions[i];
    grid[r][c] = randomSymbol();
  }
  return grid;
}

function getDensityRanges(gridSize, density) {
  const totalCells = gridSize * gridSize;
  const ranges = {
    few: [
      [Math.max(3, Math.ceil(totalCells * 0.05)), Math.ceil(totalCells * 0.15)],
      [Math.max(4, Math.ceil(totalCells * 0.15)), Math.ceil(totalCells * 0.25)],
    ],
    moderate: [
      [Math.max(3, Math.ceil(totalCells * 0.1)), Math.ceil(totalCells * 0.25)],
      [Math.max(4, Math.ceil(totalCells * 0.25)), Math.ceil(totalCells * 0.4)],
    ],
    many: [
      [Math.max(4, Math.ceil(totalCells * 0.25)), Math.ceil(totalCells * 0.4)],
      [Math.max(5, Math.ceil(totalCells * 0.4)), Math.ceil(totalCells * 0.6)],
    ],
  };
  return ranges[density] || ranges.moderate;
}

export function generateExamples(rule, { gridSize, count, types, density }) {
  const ranges = getDensityRanges(gridSize, density);
  const valid = [];
  const invalid = [];

  let validTarget, invalidTarget;
  if (types === "valid only") {
    validTarget = count;
    invalidTarget = 0;
  } else if (types === "invalid only") {
    validTarget = 0;
    invalidTarget = count;
  } else {
    // mixed: half and half (round up valid if odd)
    validTarget = Math.ceil(count / 2);
    invalidTarget = count - validTarget;
  }

  // generate valid examples
  for (let i = 0; i < validTarget; i++) {
    const tierRange = ranges[i % ranges.length];
    let found = false;
    for (let attempt = 0; attempt < 800; attempt++) {
      const g = randomBoard(tierRange[0], tierRange[1], gridSize);
      if (rule.evaluate(g)) {
        valid.push(g);
        found = true;
        break;
      }
    }
    if (!found) valid.push(emptyGrid(gridSize));
  }

  // generate invalid examples
  for (let i = 0; i < invalidTarget; i++) {
    const tierRange = ranges[i % ranges.length];
    let found = false;
    for (let attempt = 0; attempt < 800; attempt++) {
      const g = randomBoard(tierRange[0], tierRange[1], gridSize);
      if (!rule.evaluate(g)) {
        invalid.push(g);
        found = true;
        break;
      }
    }
    if (!found) {
      // mutate a valid board to break the rule
      const sources = valid.length > 0 ? valid : [emptyGrid(gridSize)];
      let mutated = false;
      for (const v of sources) {
        for (let attempt = 0; attempt < 200; attempt++) {
          const g = cloneGrid(v);
          const r = Math.floor(Math.random() * gridSize);
          const c = Math.floor(Math.random() * gridSize);
          g[r][c] = g[r][c] ? null : randomSymbol();
          if (!rule.evaluate(g)) {
            invalid.push(g);
            mutated = true;
            break;
          }
        }
        if (mutated) break;
      }
      if (!mutated) invalid.push(emptyGrid(gridSize));
    }
  }

  return { valid, invalid };
}
