import { useState } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard.js";
import { usePlayer } from "../hooks/usePlayer.js";

const CATEGORIES = [
  { key: "solved", label: "rules solved" },
  { key: "accuracy", label: "accuracy" },
  { key: "speed", label: "speed" },
  { key: "efficiency", label: "efficiency" },
];

export default function LeaderboardPage({ onBack }) {
  const [category, setCategory] = useState("solved");
  const { entries, isLoading } = useLeaderboard(category);
  const { player } = usePlayer();
  const myPlayerId = player?._id ?? null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#e0e0e0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h1
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#e0e0e0",
              margin: 0,
            }}
          >
            Leaderboard
          </h1>
          <button
            onClick={onBack}
            style={{
              padding: "6px 16px",
              fontSize: 11,
              borderRadius: 4,
              border: "1px solid #333",
              background: "transparent",
              color: "#777",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 20,
            borderBottom: "1px solid #222",
            paddingBottom: 1,
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              style={{
                padding: "8px 14px",
                fontSize: 11,
                fontWeight: category === cat.key ? 600 : 400,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                background: "transparent",
                border: "none",
                borderBottom:
                  category === cat.key
                    ? "2px solid #3B82F6"
                    : "2px solid transparent",
                color: category === cat.key ? "#e0e0e0" : "#555",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 11,
            color: "#555",
            marginBottom: 16,
          }}
        >
          {category === "solved" && "most unique rules correctly identified"}
          {category === "accuracy" && "highest percentage of correct answers"}
          {category === "speed" && "lowest average time per puzzle"}
          {category === "efficiency" && "fewest average tests used per puzzle"}
          {" — min 5 games to qualify"}
        </div>

        {/* Entries */}
        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#444",
              fontSize: 13,
            }}
          >
            loading...
          </div>
        ) : entries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#444",
              fontSize: 13,
            }}
          >
            no qualifying players yet — play 5+ games to appear here
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {entries.map((entry, i) => {
              const isMe = entry.playerId === myPlayerId;
              return (
                <div
                  key={entry.playerId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: 4,
                    background: isMe
                      ? "rgba(59,130,246,0.06)"
                      : i % 2 === 0
                        ? "rgba(255,255,255,0.02)"
                        : "transparent",
                    border: isMe
                      ? "1px solid rgba(59,130,246,0.2)"
                      : "1px solid transparent",
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      fontSize: 13,
                      fontWeight: 600,
                      color: i < 3 ? "#F59E0B" : "#555",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: isMe ? 600 : 400,
                      color: isMe ? "#3B82F6" : "#ccc",
                    }}
                  >
                    {entry.displayName}
                    {isMe && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "rgba(59,130,246,0.5)",
                          marginLeft: 6,
                        }}
                      >
                        (you)
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#888",
                      fontWeight: 500,
                    }}
                  >
                    {entry.formattedScore}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#444",
                      marginLeft: 12,
                      minWidth: 50,
                      textAlign: "right",
                    }}
                  >
                    {entry.totalGames} games
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
