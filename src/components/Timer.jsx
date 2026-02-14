export default function Timer({ display, fraction }) {
  const isLow = fraction < 0.2;
  const color = isLow ? "#DC2626" : "#e0e0e0";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 120,
          height: 4,
          background: "#333",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${fraction * 100}%`,
            height: "100%",
            background: isLow ? "#DC2626" : "#666",
            borderRadius: 2,
            transition: "width 1s linear",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: 14,
          fontWeight: 600,
          color,
          minWidth: 50,
        }}
      >
        {display}
      </span>
    </div>
  );
}
