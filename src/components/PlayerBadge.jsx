import { useState, useEffect, useCallback } from "react";
import { usePlayer } from "../hooks/usePlayer.js";

export default function PlayerBadge({ onSolvedIdsChange }) {
  const { player, setDisplayName, isLoading } = usePlayer();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const solvedIdsKey = player ? JSON.stringify(player.solvedRuleIds) : null;

  useEffect(() => {
    if (solvedIdsKey && onSolvedIdsChange) {
      onSolvedIdsChange(JSON.parse(solvedIdsKey));
    }
  }, [solvedIdsKey, onSolvedIdsChange]);

  const startEditing = useCallback(() => {
    if (player) {
      setDraft(player.displayName);
      setEditing(true);
    }
  }, [player]);

  const save = useCallback(() => {
    const trimmed = draft.trim();
    if (trimmed.length > 0) {
      setDisplayName(trimmed);
    }
    setEditing(false);
  }, [draft, setDisplayName]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") save();
      if (e.key === "Escape") setEditing(false);
    },
    [save],
  );

  if (isLoading || !player) {
    return (
      <div style={{ fontSize: 12, color: "#444", textAlign: "center" }}>
        connecting...
      </div>
    );
  }

  if (editing) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={save}
          maxLength={30}
          style={{
            padding: "4px 8px",
            fontSize: 12,
            background: "#1a1a1a",
            border: "1px solid #444",
            borderRadius: 4,
            color: "#e0e0e0",
            outline: "none",
            width: 140,
            textAlign: "center",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <span style={{ fontSize: 12, color: "#666" }}>playing as</span>
      <button
        onClick={startEditing}
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#888",
          background: "none",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline",
          textUnderlineOffset: 3,
          padding: 0,
        }}
      >
        {player.displayName}
      </button>
    </div>
  );
}
