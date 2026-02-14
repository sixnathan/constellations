import { SHAPES, COLORS, COLOR_HEX, SHAPE_CHAR } from "../constants.js";

export default function Palette({ selectedTool, onSelect, disabled }) {
  const symbols = [];
  for (const shape of SHAPES) {
    for (const color of COLORS) {
      symbols.push({ shape, color });
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {symbols.map(({ shape, color }) => {
        const isSelected =
          selectedTool?.type === "symbol" &&
          selectedTool.shape === shape &&
          selectedTool.color === color;
        return (
          <button
            key={`${shape}-${color}`}
            onClick={() =>
              !disabled && onSelect({ type: "symbol", shape, color })
            }
            disabled={disabled}
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: COLOR_HEX[color],
              background: isSelected ? "rgba(255,255,255,0.1)" : "#1a1a1a",
              border: isSelected ? "2px solid #888" : "1px solid #333",
              borderRadius: 4,
              cursor: disabled ? "default" : "pointer",
              opacity: disabled ? 0.35 : 1,
            }}
          >
            {SHAPE_CHAR[shape]}
          </button>
        );
      })}
      <button
        onClick={() => !disabled && onSelect({ type: "eraser" })}
        disabled={disabled}
        style={{
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          color: selectedTool?.type === "eraser" ? "#fff" : "#777",
          background:
            selectedTool?.type === "eraser"
              ? "rgba(255,255,255,0.1)"
              : "#1a1a1a",
          border:
            selectedTool?.type === "eraser"
              ? "2px solid #888"
              : "1px solid #333",
          borderRadius: 4,
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.35 : 1,
        }}
      >
        X
      </button>
    </div>
  );
}
