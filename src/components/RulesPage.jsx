export default function RulesPage({ onBack }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 600, width: "100%" }}>
        <button
          onClick={onBack}
          style={{
            padding: "6px 14px",
            fontSize: 12,
            borderRadius: 4,
            border: "1px solid #333",
            background: "transparent",
            color: "#777",
            cursor: "pointer",
            marginBottom: 32,
          }}
        >
          Back
        </button>

        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#e0e0e0",
            marginBottom: 24,
          }}
        >
          How to Play
        </h1>

        <div style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#ccc",
              marginBottom: 8,
              marginTop: 0,
            }}
          >
            The Game
          </h2>
          <p>
            You are given a grid and a set of 3 symbols, each with 3 of the same
            colour types. The grid has a hidden rule. You are also given a set
            of example grid configurations (i.e. with coloured symbols placed on
            them) and are told whether they are valid or invalid.
          </p>
          <p style={{ fontWeight: 600, color: "#ccc" }}>What you do:</p>
          <ol style={{ paddingLeft: 20, margin: "4px 0 16px" }}>
            <li>Look at the starter examples labelled valid or invalid.</li>
            <li>
              Place symbols on the grid and press &lsquo;Test Board&rsquo; to
              learn whether your configuration is valid or invalid.
            </li>
            <li>
              Once you think you know the rule, click &lsquo;Finish
              Experiments&rsquo; and write down what you think the rule is.
            </li>
            <li>Click &lsquo;Reveal Rule&rsquo; to learn what it was.</li>
          </ol>
          <p>
            You have a 5-second cooldown between testing boards and a maximum of
            100 tests.
          </p>

          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#ccc",
              marginBottom: 8,
              marginTop: 24,
            }}
          >
            Useful Info
          </h2>
          <p style={{ fontWeight: 600, color: "#ccc", marginBottom: 4 }}>
            Constraints on the rules:
          </p>
          <ul style={{ paddingLeft: 20, margin: "4px 0 16px" }}>
            <li>
              They depend only on what is on the board: shapes, colours, and
              relative positions.
            </li>
            <li>
              They are shift-invariant: you can slide the pattern across the
              grid without changing its validity.
            </li>
            <li>
              They are simple and singular: no conjunctions, compound rules, or
              special cases.
            </li>
            <li>Outside the grid counts as an empty space.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
