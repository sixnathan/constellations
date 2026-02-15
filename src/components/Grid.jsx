import { useState } from "react";
import { COLOR_HEX, SHAPE_CHAR } from "../constants.js";

export default function Grid({ grid, onCellClick, resultBorder, disabled }) {
  const [hoverCell, setHoverCell] = useState(null);
  const borderColor = resultBorder || "#333";
  const gridSize = grid.length;
  const cellSize = Math.max(32, Math.min(56, Math.floor(300 / gridSize)));
  const fontSize = Math.max(16, Math.floor(cellSize * 0.54));

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          display: "inline-grid",
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
          border: `2px solid ${borderColor}`,
          borderRadius: 4,
          background: "#161616",
          transition: "border-color 0.3s ease",
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isHover = hoverCell?.[0] === r && hoverCell?.[1] === c;
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => !disabled && onCellClick?.(r, c)}
                onMouseEnter={() => setHoverCell([r, c])}
                onMouseLeave={() => setHoverCell(null)}
                style={{
                  width: cellSize,
                  height: cellSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize,
                  fontWeight: 700,
                  cursor: disabled ? "default" : "pointer",
                  color: cell ? COLOR_HEX[cell.color] : "transparent",
                  background: cell
                    ? "rgba(255,255,255,0.04)"
                    : isHover && !disabled
                      ? "rgba(255,255,255,0.02)"
                      : "transparent",
                  borderRight: c < gridSize - 1 ? "1px solid #222" : "none",
                  borderBottom: r < gridSize - 1 ? "1px solid #222" : "none",
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                {cell ? SHAPE_CHAR[cell.shape] : ""}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
