import { useState } from "react";
import {
  TIME_OPTIONS,
  GRID_SIZE_OPTIONS,
  EXAMPLE_COUNT_OPTIONS,
  EXAMPLE_TYPES,
  DENSITY_OPTIONS,
} from "../constants.js";
import { isConvexEnabled } from "../lib/convexClient.js";
import PlayerBadge from "./PlayerBadge.jsx";

const sectionLabel = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#555",
  display: "block",
  marginBottom: 10,
};

function OptionRow({ options, selected, onSelect, format }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          style={{
            padding: "8px 16px",
            fontSize: 13,
            borderRadius: 4,
            border: selected === opt ? "1px solid #888" : "1px solid #333",
            background:
              selected === opt ? "rgba(255,255,255,0.08)" : "transparent",
            color: selected === opt ? "#e0e0e0" : "#666",
            cursor: "pointer",
            fontWeight: selected === opt ? 600 : 400,
          }}
        >
          {format ? format(opt) : opt}
        </button>
      ))}
    </div>
  );
}

export default function SetupScreen({
  onStart,
  onRules,
  onStats,
  onLeaderboard,
  onConvexSolvedIds,
}) {
  const [selectedTime, setSelectedTime] = useState(10);
  const [gridSize, setGridSize] = useState(6);
  const [exampleCount, setExampleCount] = useState(6);
  const [exampleTypes, setExampleTypes] = useState("mixed");
  const [density, setDensity] = useState("moderate");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 440, padding: 32 }}>
        <div
          style={{
            fontSize: 28,
            color: "#888",
            marginBottom: 4,
            letterSpacing: "0.2em",
          }}
        >
          + ● ★
        </div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#e0e0e0",
            marginBottom: 4,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Constellations
        </h1>
        <div
          style={{
            marginTop: 8,
            marginBottom: 28,
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onRules}
            style={{
              padding: "8px 20px",
              fontSize: 18,
              borderRadius: 4,
              border: "none",
              background: "transparent",
              color: "#555",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            how to play
          </button>
          <button
            onClick={onStats}
            style={{
              padding: "8px 20px",
              fontSize: 18,
              borderRadius: 4,
              border: "none",
              background: "transparent",
              color: "#555",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            stats
          </button>
          {onLeaderboard && (
            <button
              onClick={onLeaderboard}
              style={{
                padding: "8px 20px",
                fontSize: 18,
                borderRadius: 4,
                border: "none",
                background: "transparent",
                color: "#555",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              leaderboard
            </button>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={sectionLabel}>time per puzzle</label>
          <OptionRow
            options={TIME_OPTIONS}
            selected={selectedTime}
            onSelect={setSelectedTime}
            format={(t) => `${t} min`}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={sectionLabel}>grid size</label>
          <OptionRow
            options={GRID_SIZE_OPTIONS}
            selected={gridSize}
            onSelect={setGridSize}
            format={(s) => `${s}×${s}`}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={sectionLabel}>examples</label>
          <OptionRow
            options={EXAMPLE_COUNT_OPTIONS}
            selected={exampleCount}
            onSelect={setExampleCount}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={sectionLabel}>example types</label>
          <OptionRow
            options={EXAMPLE_TYPES}
            selected={exampleTypes}
            onSelect={setExampleTypes}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={sectionLabel}>symbol density</label>
          <OptionRow
            options={DENSITY_OPTIONS}
            selected={density}
            onSelect={setDensity}
          />
        </div>

        <button
          onClick={() =>
            onStart({
              minutes: selectedTime,
              gridSize,
              exampleCount,
              exampleTypes,
              density,
            })
          }
          style={{
            padding: "12px 40px",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 4,
            border: "1px solid #555",
            background: "rgba(255,255,255,0.06)",
            color: "#e0e0e0",
            cursor: "pointer",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Begin
        </button>
        {isConvexEnabled && (
          <div style={{ marginTop: 20 }}>
            <PlayerBadge onSolvedIdsChange={onConvexSolvedIds} />
          </div>
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 16,
          right: 20,
          fontSize: 12,
          color: "#444",
        }}
      >
        by sixnathan, inspired by PAIR
      </div>
    </div>
  );
}
