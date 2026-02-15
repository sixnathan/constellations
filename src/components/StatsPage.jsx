import { useState } from "react";
import {
  loadStats,
  getStatsSummary,
  clearStats,
  resetSolvedRules,
  getSolvedRuleIds,
} from "../stats.js";
import ConfirmDialog from "./ConfirmDialog.jsx";

const RESULT_COLORS = {
  correct: "#16A34A",
  partial: "#F59E0B",
  wrong: "#DC2626",
};

export default function StatsPage({ onBack }) {
  const [stats, setStats] = useState(() => loadStats());
  const [confirmAction, setConfirmAction] = useState(null);
  const summary = getStatsSummary(stats);
  const solvedCount = getSolvedRuleIds().length;

  function handleClear() {
    clearStats();
    setStats([]);
    setConfirmAction(null);
  }

  function handleResetSolved() {
    resetSolvedRules();
    setConfirmAction(null);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#e0e0e0",
        padding: 32,
      }}
    >
      {confirmAction && (
        <ConfirmDialog
          message={
            confirmAction === "clear"
              ? "Clear all game history? This cannot be undone."
              : "Reset solved rules? All 261 rules will come back into rotation."
          }
          onConfirm={
            confirmAction === "clear" ? handleClear : handleResetSolved
          }
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <button
            onClick={onBack}
            style={{
              padding: "6px 16px",
              fontSize: 12,
              borderRadius: 4,
              border: "1px solid #333",
              background: "transparent",
              color: "#777",
              cursor: "pointer",
            }}
          >
            back
          </button>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#999",
              margin: 0,
            }}
          >
            stats
          </h2>
          <div style={{ width: 60 }} />
        </div>

        {/* Summary Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
            gap: 12,
            marginBottom: 24,
            padding: "16px 12px",
            background: "#1a1a1a",
            borderRadius: 6,
            border: "1px solid #222",
          }}
        >
          <StatBox label="total" value={summary.total} />
          <StatBox
            label="correct"
            value={`${summary.correctPct}%`}
            color="#16A34A"
          />
          <StatBox
            label="partial"
            value={`${summary.partialPct}%`}
            color="#F59E0B"
          />
          <StatBox
            label="wrong"
            value={`${summary.wrongPct}%`}
            color="#DC2626"
          />
          <StatBox label="avg time" value={`${summary.avgTime}s`} />
          <StatBox label="avg tests" value={summary.avgTests} />
          <StatBox label="solved" value={`${solvedCount}/261`} />
        </div>

        {/* Game History */}
        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#555",
            marginBottom: 10,
          }}
        >
          game history
        </div>

        {stats.length === 0 ? (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              color: "#444",
              fontSize: 13,
            }}
          >
            no games played yet
          </div>
        ) : (
          <div
            style={{
              maxHeight: 400,
              overflowY: "auto",
              borderRadius: 6,
              border: "1px solid #222",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#1a1a1a",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  <th style={thStyle}>date</th>
                  <th style={thStyle}>rule</th>
                  <th style={thStyle}>result</th>
                  <th style={thStyle}>tests</th>
                  <th style={thStyle}>grid</th>
                </tr>
              </thead>
              <tbody>
                {[...stats].reverse().map((entry, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1e1e1e" }}>
                    <td style={tdStyle}>
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={entry.ruleDescription}
                    >
                      {entry.ruleDescription}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          color: RESULT_COLORS[entry.result] || "#666",
                          fontWeight: 600,
                        }}
                      >
                        {entry.result}
                      </span>
                    </td>
                    <td style={tdStyle}>{entry.testsUsed}</td>
                    <td style={tdStyle}>
                      {entry.gridSize}×{entry.gridSize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 20,
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setConfirmAction("clear")}
            disabled={stats.length === 0}
            style={{
              padding: "8px 16px",
              fontSize: 11,
              borderRadius: 4,
              border: "1px solid #333",
              background: "transparent",
              color: stats.length > 0 ? "#777" : "#444",
              cursor: stats.length > 0 ? "pointer" : "default",
            }}
          >
            clear stats
          </button>
          <button
            onClick={() => setConfirmAction("reset")}
            style={{
              padding: "8px 16px",
              fontSize: 11,
              borderRadius: 4,
              border: "1px solid #333",
              background: "transparent",
              color: "#777",
              cursor: "pointer",
            }}
          >
            reset solved rules
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: color || "#e0e0e0",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#555",
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

const thStyle = {
  padding: "8px 10px",
  textAlign: "left",
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#555",
  fontWeight: 500,
  borderBottom: "1px solid #222",
};

const tdStyle = {
  padding: "8px 10px",
  color: "#aaa",
};
