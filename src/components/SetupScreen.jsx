import { useState } from "react";
import { TIME_OPTIONS } from "../constants.js";

export default function SetupScreen({ onStart, onRules }) {
  const [selectedTime, setSelectedTime] = useState(10);

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
      <div style={{ textAlign: "center", maxWidth: 400, padding: 32 }}>
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
        <p
          style={{
            fontSize: 13,
            color: "#555",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          by sixnathan, inspired by PAIR
        </p>

        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#555",
              display: "block",
              marginBottom: 10,
            }}
          >
            Time per puzzle
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                style={{
                  padding: "8px 20px",
                  fontSize: 13,
                  borderRadius: 4,
                  border:
                    selectedTime === t ? "1px solid #888" : "1px solid #333",
                  background:
                    selectedTime === t
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                  color: selectedTime === t ? "#e0e0e0" : "#666",
                  cursor: "pointer",
                  fontWeight: selectedTime === t ? 600 : 400,
                }}
              >
                {t} min
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(selectedTime)}
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
        <div style={{ marginTop: 16 }}>
          <button
            onClick={onRules}
            style={{
              padding: "8px 20px",
              fontSize: 12,
              borderRadius: 4,
              border: "none",
              background: "transparent",
              color: "#555",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            How to play
          </button>
        </div>
      </div>
    </div>
  );
}
