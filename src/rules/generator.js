import { SHAPES, COLORS } from "../constants.js";
import { allCells, getNeighbors, getDiagonalNeighbors } from "./helpers.js";

// ─── Utility ─────────────────────────────────────────────────────────────────

function otherValues(arr, val) {
  return arr.filter((v) => v !== val);
}

// ─── Template Generators ─────────────────────────────────────────────────────
// Each generator returns an array of { description, evaluate } objects.

function everyColorIsShape() {
  const rules = [];
  for (const color of COLORS) {
    for (const shape of SHAPES) {
      rules.push({
        description: `Every ${color} symbol is a ${shape}.`,
        evaluate: (grid) =>
          allCells(grid).every((c) => c.color !== color || c.shape === shape),
      });
    }
  }
  return rules;
}

function everyShapeIsColor() {
  const rules = [];
  for (const shape of SHAPES) {
    for (const color of COLORS) {
      rules.push({
        description: `Every ${shape} is ${color}.`,
        evaluate: (grid) =>
          allCells(grid).every((c) => c.shape !== shape || c.color === color),
      });
    }
  }
  return rules;
}

function noAxisMoreThanNShape() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const n of [1, 2, 3]) {
      for (const shape of SHAPES) {
        rules.push({
          description: `No ${axis} contains more than ${n} ${shape}${n > 1 ? "s" : ""}.`,
          evaluate: (grid) => {
            const size = grid.length;
            for (let i = 0; i < size; i++) {
              let count = 0;
              for (let j = 0; j < size; j++) {
                const cell = axis === "row" ? grid[i][j] : grid[j][i];
                if (cell?.shape === shape) count++;
              }
              if (count > n) return false;
            }
            return true;
          },
        });
      }
    }
  }
  return rules;
}

function noAxisMoreThanNColor() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const n of [1, 2, 3]) {
      for (const color of COLORS) {
        rules.push({
          description: `No ${axis} contains more than ${n} ${color} symbol${n > 1 ? "s" : ""}.`,
          evaluate: (grid) => {
            const size = grid.length;
            for (let i = 0; i < size; i++) {
              let count = 0;
              for (let j = 0; j < size; j++) {
                const cell = axis === "row" ? grid[i][j] : grid[j][i];
                if (cell?.color === color) count++;
              }
              if (count > n) return false;
            }
            return true;
          },
        });
      }
    }
  }
  return rules;
}

function noAxisMoreThanNSymbols() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const n of [1, 2, 3]) {
      rules.push({
        description: `No ${axis} contains more than ${n} symbol${n > 1 ? "s" : ""}.`,
        evaluate: (grid) => {
          const size = grid.length;
          for (let i = 0; i < size; i++) {
            let count = 0;
            for (let j = 0; j < size; j++) {
              const cell = axis === "row" ? grid[i][j] : grid[j][i];
              if (cell) count++;
            }
            if (count > n) return false;
          }
          return true;
        },
      });
    }
  }
  return rules;
}

function axisMinDifferentColors() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const n of [2, 3]) {
      rules.push({
        description: `Every ${axis} containing symbols has at least ${n} different colors.`,
        evaluate: (grid) => {
          const size = grid.length;
          for (let i = 0; i < size; i++) {
            const colors = new Set();
            let hasSymbol = false;
            for (let j = 0; j < size; j++) {
              const cell = axis === "row" ? grid[i][j] : grid[j][i];
              if (cell) {
                hasSymbol = true;
                colors.add(cell.color);
              }
            }
            if (hasSymbol && colors.size < n) return false;
          }
          return true;
        },
      });
    }
  }
  return rules;
}

function axisMinDifferentShapes() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const n of [2, 3]) {
      rules.push({
        description: `Every ${axis} containing symbols has at least ${n} different shapes.`,
        evaluate: (grid) => {
          const size = grid.length;
          for (let i = 0; i < size; i++) {
            const shapes = new Set();
            let hasSymbol = false;
            for (let j = 0; j < size; j++) {
              const cell = axis === "row" ? grid[i][j] : grid[j][i];
              if (cell) {
                hasSymbol = true;
                shapes.add(cell.shape);
              }
            }
            if (hasSymbol && shapes.size < n) return false;
          }
          return true;
        },
      });
    }
  }
  return rules;
}

function noSamePropertyAdjacent() {
  const rules = [];
  for (const prop of ["shape", "color"]) {
    rules.push({
      description: `No two symbols of the same ${prop} are orthogonally adjacent.`,
      evaluate: (grid) => {
        const size = grid.length;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c]) {
              for (const [nr, nc] of getNeighbors(r, c, size)) {
                if (grid[nr][nc]?.[prop] === grid[r][c][prop]) return false;
              }
            }
          }
        }
        return true;
      },
    });
  }
  return rules;
}

function noSpecificShapeAdjacent() {
  const rules = [];
  for (const shape of SHAPES) {
    rules.push({
      description: `No two ${shape}s are orthogonally adjacent.`,
      evaluate: (grid) => {
        const size = grid.length;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c]?.shape === shape) {
              for (const [nr, nc] of getNeighbors(r, c, size)) {
                if (grid[nr][nc]?.shape === shape) return false;
              }
            }
          }
        }
        return true;
      },
    });
  }
  return rules;
}

function noSpecificColorAdjacent() {
  const rules = [];
  for (const color of COLORS) {
    rules.push({
      description: `No two ${color} symbols are orthogonally adjacent.`,
      evaluate: (grid) => {
        const size = grid.length;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c]?.color === color) {
              for (const [nr, nc] of getNeighbors(r, c, size)) {
                if (grid[nr][nc]?.color === color) return false;
              }
            }
          }
        }
        return true;
      },
    });
  }
  return rules;
}

function everyShapeAdjacentToOtherShape() {
  const rules = [];
  for (const s1 of SHAPES) {
    for (const s2 of otherValues(SHAPES, s1)) {
      rules.push({
        description: `Every ${s1} is orthogonally adjacent to at least one ${s2}.`,
        evaluate: (grid) => {
          const size = grid.length;
          for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
              if (grid[r][c]?.shape === s1) {
                const hasAdj = getNeighbors(r, c, size).some(
                  ([nr, nc]) => grid[nr][nc]?.shape === s2,
                );
                if (!hasAdj) return false;
              }
            }
          }
          return true;
        },
      });
    }
  }
  return rules;
}

function everyShapeAdjacentToColor() {
  const rules = [];
  for (const shape of SHAPES) {
    for (const color of COLORS) {
      rules.push({
        description: `Every ${shape} is orthogonally adjacent to at least one ${color} symbol.`,
        evaluate: (grid) => {
          const size = grid.length;
          for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
              if (grid[r][c]?.shape === shape) {
                const hasAdj = getNeighbors(r, c, size).some(
                  ([nr, nc]) => grid[nr][nc]?.color === color,
                );
                if (!hasAdj) return false;
              }
            }
          }
          return true;
        },
      });
    }
  }
  return rules;
}

function everyColorAdjacentToShape() {
  const rules = [];
  for (const color of COLORS) {
    for (const shape of SHAPES) {
      rules.push({
        description: `Every ${color} symbol is orthogonally adjacent to at least one ${shape}.`,
        evaluate: (grid) => {
          const size = grid.length;
          for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
              if (grid[r][c]?.color === color) {
                const hasAdj = getNeighbors(r, c, size).some(
                  ([nr, nc]) => grid[nr][nc]?.shape === shape,
                );
                if (!hasAdj) return false;
              }
            }
          }
          return true;
        },
      });
    }
  }
  return rules;
}

function everyColorAdjacentToOtherColor() {
  const rules = [];
  for (const c1 of COLORS) {
    for (const c2 of otherValues(COLORS, c1)) {
      rules.push({
        description: `Every ${c1} symbol is orthogonally adjacent to at least one ${c2} symbol.`,
        evaluate: (grid) => {
          const size = grid.length;
          for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
              if (grid[r][c]?.color === c1) {
                const hasAdj = getNeighbors(r, c, size).some(
                  ([nr, nc]) => grid[nr][nc]?.color === c2,
                );
                if (!hasAdj) return false;
              }
            }
          }
          return true;
        },
      });
    }
  }
  return rules;
}

function axisWithShapeAlsoHasOtherShape() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const s1 of SHAPES) {
      for (const s2 of otherValues(SHAPES, s1)) {
        rules.push({
          description: `Every ${axis} containing a ${s1} also contains a ${s2}.`,
          evaluate: (grid) => {
            const size = grid.length;
            for (let i = 0; i < size; i++) {
              let hasS1 = false;
              let hasS2 = false;
              for (let j = 0; j < size; j++) {
                const cell = axis === "row" ? grid[i][j] : grid[j][i];
                if (cell?.shape === s1) hasS1 = true;
                if (cell?.shape === s2) hasS2 = true;
              }
              if (hasS1 && !hasS2) return false;
            }
            return true;
          },
        });
      }
    }
  }
  return rules;
}

function axisWithColorAlsoHasOtherColor() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const c1 of COLORS) {
      for (const c2 of otherValues(COLORS, c1)) {
        rules.push({
          description: `Every ${axis} containing a ${c1} symbol also contains a ${c2} symbol.`,
          evaluate: (grid) => {
            const size = grid.length;
            for (let i = 0; i < size; i++) {
              let hasC1 = false;
              let hasC2 = false;
              for (let j = 0; j < size; j++) {
                const cell = axis === "row" ? grid[i][j] : grid[j][i];
                if (cell?.color === c1) hasC1 = true;
                if (cell?.color === c2) hasC2 = true;
              }
              if (hasC1 && !hasC2) return false;
            }
            return true;
          },
        });
      }
    }
  }
  return rules;
}

function axisWithShapeAlsoHasColor() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const shape of SHAPES) {
      for (const color of COLORS) {
        rules.push({
          description: `Every ${axis} containing a ${shape} also contains a ${color} symbol.`,
          evaluate: (grid) => {
            const size = grid.length;
            for (let i = 0; i < size; i++) {
              let hasShape = false;
              let hasColor = false;
              for (let j = 0; j < size; j++) {
                const cell = axis === "row" ? grid[i][j] : grid[j][i];
                if (cell?.shape === shape) hasShape = true;
                if (cell?.color === color) hasColor = true;
              }
              if (hasShape && !hasColor) return false;
            }
            return true;
          },
        });
      }
    }
  }
  return rules;
}

function axisWithColorAlsoHasShape() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const color of COLORS) {
      for (const shape of SHAPES) {
        rules.push({
          description: `Every ${axis} containing a ${color} symbol also contains a ${shape}.`,
          evaluate: (grid) => {
            const size = grid.length;
            for (let i = 0; i < size; i++) {
              let hasColor = false;
              let hasShape = false;
              for (let j = 0; j < size; j++) {
                const cell = axis === "row" ? grid[i][j] : grid[j][i];
                if (cell?.color === color) hasColor = true;
                if (cell?.shape === shape) hasShape = true;
              }
              if (hasColor && !hasShape) return false;
            }
            return true;
          },
        });
      }
    }
  }
  return rules;
}

function allFilterInSameAxis() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const shape of SHAPES) {
      rules.push({
        description: `All ${shape}s are in the same ${axis}.`,
        evaluate: (grid) => {
          const cells = allCells(grid).filter((c) => c.shape === shape);
          if (cells.length <= 1) return true;
          const key = axis === "row" ? "r" : "c";
          return cells.every((c) => c[key] === cells[0][key]);
        },
      });
    }
    for (const color of COLORS) {
      rules.push({
        description: `All ${color} symbols are in the same ${axis}.`,
        evaluate: (grid) => {
          const cells = allCells(grid).filter((c) => c.color === color);
          if (cells.length <= 1) return true;
          const key = axis === "row" ? "r" : "c";
          return cells.every((c) => c[key] === cells[0][key]);
        },
      });
    }
  }
  return rules;
}

function moreAThanB() {
  const rules = [];
  for (const s1 of SHAPES) {
    for (const s2 of otherValues(SHAPES, s1)) {
      rules.push({
        description: `There are more ${s1}s than ${s2}s on the board.`,
        evaluate: (grid) => {
          const cells = allCells(grid);
          const count1 = cells.filter((c) => c.shape === s1).length;
          const count2 = cells.filter((c) => c.shape === s2).length;
          return count1 > count2;
        },
      });
    }
  }
  for (const c1 of COLORS) {
    for (const c2 of otherValues(COLORS, c1)) {
      rules.push({
        description: `There are more ${c1} symbols than ${c2} symbols on the board.`,
        evaluate: (grid) => {
          const cells = allCells(grid);
          const count1 = cells.filter((c) => c.color === c1).length;
          const count2 = cells.filter((c) => c.color === c2).length;
          return count1 > count2;
        },
      });
    }
  }
  return rules;
}

function equalCounts() {
  const rules = [];
  for (let i = 0; i < SHAPES.length; i++) {
    for (let j = i + 1; j < SHAPES.length; j++) {
      const s1 = SHAPES[i];
      const s2 = SHAPES[j];
      rules.push({
        description: `The number of ${s1}s equals the number of ${s2}s.`,
        evaluate: (grid) => {
          const cells = allCells(grid);
          return (
            cells.filter((c) => c.shape === s1).length ===
            cells.filter((c) => c.shape === s2).length
          );
        },
      });
    }
  }
  for (let i = 0; i < COLORS.length; i++) {
    for (let j = i + 1; j < COLORS.length; j++) {
      const c1 = COLORS[i];
      const c2 = COLORS[j];
      rules.push({
        description: `The number of ${c1} symbols equals the number of ${c2} symbols.`,
        evaluate: (grid) => {
          const cells = allCells(grid);
          return (
            cells.filter((c) => c.color === c1).length ===
            cells.filter((c) => c.color === c2).length
          );
        },
      });
    }
  }
  return rules;
}

function noAxisAllThree() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    rules.push({
      description: `No ${axis} contains all three shapes.`,
      evaluate: (grid) => {
        const size = grid.length;
        for (let i = 0; i < size; i++) {
          const shapes = new Set();
          for (let j = 0; j < size; j++) {
            const cell = axis === "row" ? grid[i][j] : grid[j][i];
            if (cell) shapes.add(cell.shape);
          }
          if (shapes.size === 3) return false;
        }
        return true;
      },
    });
    rules.push({
      description: `No ${axis} contains all three colors.`,
      evaluate: (grid) => {
        const size = grid.length;
        for (let i = 0; i < size; i++) {
          const colors = new Set();
          for (let j = 0; j < size; j++) {
            const cell = axis === "row" ? grid[i][j] : grid[j][i];
            if (cell) colors.add(cell.color);
          }
          if (colors.size === 3) return false;
        }
        return true;
      },
    });
  }
  return rules;
}

function samePropertyConsistency() {
  return [
    {
      description: "All symbols of the same shape are the same color.",
      evaluate: (grid) => {
        const cells = allCells(grid);
        for (const shape of SHAPES) {
          const shapeCells = cells.filter((c) => c.shape === shape);
          if (shapeCells.length > 1) {
            if (!shapeCells.every((c) => c.color === shapeCells[0].color))
              return false;
          }
        }
        return true;
      },
    },
    {
      description: "All symbols of the same color are the same shape.",
      evaluate: (grid) => {
        const cells = allCells(grid);
        for (const color of COLORS) {
          const colorCells = cells.filter((c) => c.color === color);
          if (colorCells.length > 1) {
            if (!colorCells.every((c) => c.shape === colorCells[0].shape))
              return false;
          }
        }
        return true;
      },
    },
  ];
}

function neighborCountRules() {
  const rules = [];
  for (const n of [1, 2, 3]) {
    rules.push({
      description: `Every symbol has at least ${n} empty orthogonal neighbor${n > 1 ? "s" : ""}.`,
      evaluate: (grid) => {
        const size = grid.length;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c]) {
              const emptyCount = getNeighbors(r, c, size).filter(
                ([nr, nc]) => !grid[nr][nc],
              ).length;
              if (emptyCount < n) return false;
            }
          }
        }
        return true;
      },
    });
  }
  for (const n of [0, 1, 2, 3]) {
    rules.push({
      description: `Every symbol has at most ${n} occupied orthogonal neighbor${n !== 1 ? "s" : ""}.`,
      evaluate: (grid) => {
        const size = grid.length;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c]) {
              const occCount = getNeighbors(r, c, size).filter(
                ([nr, nc]) => grid[nr][nc],
              ).length;
              if (occCount > n) return false;
            }
          }
        }
        return true;
      },
    });
  }
  rules.push({
    description:
      "Every symbol is orthogonally adjacent to at least one other symbol.",
    evaluate: (grid) => {
      const size = grid.length;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c]) {
            const hasNeighbor = getNeighbors(r, c, size).some(
              ([nr, nc]) => grid[nr][nc],
            );
            if (!hasNeighbor) return false;
          }
        }
      }
      return true;
    },
  });
  return rules;
}

function noComboInSameAxis() {
  const rules = [];
  for (const axis of ["row", "column"]) {
    for (const shape of SHAPES) {
      for (const color of COLORS) {
        rules.push({
          description: `No ${axis} contains more than one ${color} ${shape}.`,
          evaluate: (grid) => {
            const size = grid.length;
            for (let i = 0; i < size; i++) {
              let count = 0;
              for (let j = 0; j < size; j++) {
                const cell = axis === "row" ? grid[i][j] : grid[j][i];
                if (cell?.shape === shape && cell?.color === color) count++;
              }
              if (count > 1) return false;
            }
            return true;
          },
        });
      }
    }
  }
  return rules;
}

function diagonalRules() {
  const rules = [];
  for (const prop of ["shape", "color"]) {
    rules.push({
      description: `No two symbols of the same ${prop} are diagonally adjacent.`,
      evaluate: (grid) => {
        const size = grid.length;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c]) {
              for (const [nr, nc] of getDiagonalNeighbors(r, c, size)) {
                if (grid[nr][nc]?.[prop] === grid[r][c][prop]) return false;
              }
            }
          }
        }
        return true;
      },
    });
  }
  for (const shape of SHAPES) {
    rules.push({
      description: `No two ${shape}s are diagonally adjacent.`,
      evaluate: (grid) => {
        const size = grid.length;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c]?.shape === shape) {
              for (const [nr, nc] of getDiagonalNeighbors(r, c, size)) {
                if (grid[nr][nc]?.shape === shape) return false;
              }
            }
          }
        }
        return true;
      },
    });
  }
  for (const color of COLORS) {
    rules.push({
      description: `No two ${color} symbols are diagonally adjacent.`,
      evaluate: (grid) => {
        const size = grid.length;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c]?.color === color) {
              for (const [nr, nc] of getDiagonalNeighbors(r, c, size)) {
                if (grid[nr][nc]?.color === color) return false;
              }
            }
          }
        }
        return true;
      },
    });
  }
  return rules;
}

function connectedGroup() {
  return [
    {
      description: "All symbols form a single orthogonally connected group.",
      evaluate: (grid) => {
        const cells = allCells(grid);
        if (cells.length <= 1) return true;
        const size = grid.length;
        const visited = new Set();
        const queue = [[cells[0].r, cells[0].c]];
        visited.add(`${cells[0].r},${cells[0].c}`);
        while (queue.length > 0) {
          const [r, c] = queue.shift();
          for (const [nr, nc] of getNeighbors(r, c, size)) {
            const key = `${nr},${nc}`;
            if (grid[nr][nc] && !visited.has(key)) {
              visited.add(key);
              queue.push([nr, nc]);
            }
          }
        }
        return visited.size === cells.length;
      },
    },
  ];
}

function exactCountRules() {
  const rules = [];
  for (const n of [2, 3, 4, 5]) {
    for (const shape of SHAPES) {
      rules.push({
        description: `The board contains exactly ${n} ${shape}${n > 1 ? "s" : ""}.`,
        evaluate: (grid) =>
          allCells(grid).filter((c) => c.shape === shape).length === n,
      });
    }
    for (const color of COLORS) {
      rules.push({
        description: `The board contains exactly ${n} ${color} symbol${n > 1 ? "s" : ""}.`,
        evaluate: (grid) =>
          allCells(grid).filter((c) => c.color === color).length === n,
      });
    }
  }
  return rules;
}

// ─── Generate All Rules ──────────────────────────────────────────────────────

export function generateAllRules() {
  const allTemplates = [
    ...everyColorIsShape(),
    ...everyShapeIsColor(),
    ...noAxisMoreThanNShape(),
    ...noAxisMoreThanNColor(),
    ...noAxisMoreThanNSymbols(),
    ...axisMinDifferentColors(),
    ...axisMinDifferentShapes(),
    ...noSamePropertyAdjacent(),
    ...noSpecificShapeAdjacent(),
    ...noSpecificColorAdjacent(),
    ...everyShapeAdjacentToOtherShape(),
    ...everyShapeAdjacentToColor(),
    ...everyColorAdjacentToShape(),
    ...everyColorAdjacentToOtherColor(),
    ...axisWithShapeAlsoHasOtherShape(),
    ...axisWithColorAlsoHasOtherColor(),
    ...axisWithShapeAlsoHasColor(),
    ...axisWithColorAlsoHasShape(),
    ...allFilterInSameAxis(),
    ...moreAThanB(),
    ...equalCounts(),
    ...noAxisAllThree(),
    ...samePropertyConsistency(),
    ...neighborCountRules(),
    ...noComboInSameAxis(),
    ...diagonalRules(),
    ...connectedGroup(),
    ...exactCountRules(),
  ];

  return allTemplates.map((rule, index) => ({
    id: index + 1,
    description: rule.description,
    evaluate: rule.evaluate,
  }));
}
