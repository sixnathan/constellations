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
          how to play
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
            the game
          </h2>
          <p>
            you are given a grid and a set of 3 symbols, each with 3 of the same
            colour types. the grid has a hidden rule. you are also given a set
            of example grid configurations (i.e. with coloured symbols placed on
            them) and are told whether they are valid or invalid.
          </p>
          <p style={{ fontWeight: 600, color: "#ccc" }}>what you do:</p>
          <ol style={{ paddingLeft: 20, margin: "4px 0 16px" }}>
            <li>look at the starter examples labelled valid or invalid.</li>
            <li>
              place symbols on the grid and press &lsquo;test board&rsquo; to
              learn whether your configuration is valid or invalid.
            </li>
            <li>
              once you think you know the rule, click &lsquo;finish
              experiments&rsquo; and write down what you think the rule is.
            </li>
            <li>click &lsquo;reveal rule&rsquo; to learn what it was.</li>
          </ol>
          <p>
            you have a 5-second cooldown between testing boards and a maximum of
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
            useful info
          </h2>
          <p style={{ fontWeight: 600, color: "#ccc", marginBottom: 4 }}>
            constraints on the rules:
          </p>
          <ul style={{ paddingLeft: 20, margin: "4px 0 16px" }}>
            <li>
              they depend only on what is on the board: shapes, colours, and
              relative positions.
            </li>
            <li>
              they are shift-invariant: you can slide the pattern across the
              grid without changing its validity.
            </li>
            <li>
              they are simple and singular: no conjunctions, compound rules, or
              special cases.
            </li>
            <li>outside the grid counts as an empty space.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
