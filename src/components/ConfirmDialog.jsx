export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 8,
          padding: "24px 28px",
          maxWidth: 380,
        }}
      >
        <div
          style={{
            color: "#ccc",
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 20,
          }}
        >
          {message}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={btnStyle("#555", "transparent")}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={btnStyle("#F97316", "rgba(249,115,22,0.12)")}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function btnStyle(color, bg) {
  return {
    padding: "6px 16px",
    fontSize: 13,
    borderRadius: 4,
    border: `1px solid ${color}`,
    background: bg,
    color,
    cursor: "pointer",
    fontWeight: 600,
  };
}
