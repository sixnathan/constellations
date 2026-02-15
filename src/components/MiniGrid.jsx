import { COLOR_HEX, SHAPE_CHAR } from "../constants.js";

export default function MiniGrid({ grid, size = 78, borderColor = "#333" }) {
  const gridSize = grid.length;
  const cellSize = Math.floor(size / gridSize);

  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        border: `2px solid ${borderColor}`,
        borderRadius: 3,
        background: "#161616",
        flexShrink: 0,
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: cellSize,
              height: cellSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: cellSize * 0.55,
              lineHeight: 1,
              color: cell ? COLOR_HEX[cell.color] : "transparent",
              borderRight: c < gridSize - 1 ? "1px solid #1e1e1e" : "none",
              borderBottom: r < gridSize - 1 ? "1px solid #1e1e1e" : "none",
            }}
          >
            {cell ? SHAPE_CHAR[cell.shape] : ""}
          </div>
        )),
      )}
    </div>
  );
}
