import { useRef, useEffect } from "react";
import MiniGrid from "./MiniGrid.jsx";

export default function HistoryPanel({ history, onLoadBoard }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [history.length]);

  if (history.length === 0) {
    return (
      <div
        style={{
          color: "#555",
          fontSize: 13,
          padding: 16,
          textAlign: "center",
        }}
      >
        No tests yet. Place symbols and test your board.
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      style={{
        overflowY: "auto",
        flex: 1,
        padding: "8px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {[...history].reverse().map((entry, idx) => {
        const realIndex = history.length - 1 - idx;
        const borderColor = entry.isValid ? "#3B82F6" : "#F97316";
        const symbolCount = entry.grid.flat().filter(Boolean).length;

        return (
          <div
            key={realIndex}
            onClick={() => onLoadBoard(entry.grid)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 8px",
              background: "#151515",
              borderRadius: 4,
              cursor: "pointer",
              border: "1px solid #222",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1c1c1c")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#151515")}
          >
            <MiniGrid grid={entry.grid} size={66} borderColor={borderColor} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#666",
                    fontFamily: "monospace",
                  }}
                >
                  {entry.isInitial ? "INIT" : `#${entry.testNumber}`}
                </span>
                {entry.isInitial && (
                  <span
                    style={{
                      fontSize: 9,
                      padding: "1px 5px",
                      borderRadius: 3,
                      background: "#222",
                      color: "#555",
                      textTransform: "uppercase",
                    }}
                  >
                    Example
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "monospace",
                  color: borderColor,
                }}
              >
                {entry.isValid ? "VALID" : "INVALID"}
              </div>
              <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>
                {symbolCount} symbols
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
