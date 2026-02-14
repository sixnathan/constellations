import {
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { MAX_TESTS } from "../constants.js";
import { emptyGrid, cloneGrid } from "../rules/helpers.js";
import Grid from "./Grid.jsx";
import Palette from "./Palette.jsx";
import HistoryPanel from "./HistoryPanel.jsx";
import Timer from "./Timer.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";

const GameScreen = forwardRef(function GameScreen(
  { rule, initialHistory, timer, onNewGame },
  ref,
) {
  const [grid, setGrid] = useState(emptyGrid);
  const [selectedTool, setSelectedTool] = useState(null);
  const [history, setHistory] = useState(initialHistory);
  const [testCount, setTestCount] = useState(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [resultBorder, setResultBorder] = useState(null);
  const [resultLabel, setResultLabel] = useState(null);
  const [gamePhase, setGamePhase] = useState("experimenting");
  const [playerGuess, setPlayerGuess] = useState("");
  const [ruleRevealed, setRuleRevealed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const cooldownRef = useRef(null);
  const debounceRef = useRef(false);

  const isExperimenting = gamePhase === "experimenting";
  const testingDisabled = testCount >= MAX_TESTS;
  const canTest = isExperimenting && !cooldownActive && !testingDisabled;

  const handleCellClick = useCallback(
    (r, c) => {
      if (!selectedTool || !isExperimenting) return;
      setGrid((prev) => {
        const next = cloneGrid(prev);
        if (selectedTool.type === "eraser") {
          next[r][c] = null;
        } else {
          next[r][c] = { shape: selectedTool.shape, color: selectedTool.color };
        }
        return next;
      });
      setResultBorder(null);
      setResultLabel(null);
    },
    [selectedTool, isExperimenting],
  );

  const testBoard = useCallback(() => {
    if (!canTest || debounceRef.current) return;
    debounceRef.current = true;
    setTimeout(() => (debounceRef.current = false), 300);

    const isValid = rule.evaluate(grid);
    const newTestNumber = testCount + 1;

    setTestCount(newTestNumber);
    setHistory((prev) => [
      ...prev,
      {
        grid: cloneGrid(grid),
        isValid,
        isInitial: false,
        testNumber: newTestNumber,
      },
    ]);

    const color = isValid ? "#3B82F6" : "#F97316";
    setResultBorder(color);
    setResultLabel(isValid ? "VALID" : "INVALID");

    setCooldownActive(true);
    setCooldownSeconds(5);
    let remaining = 5;
    cooldownRef.current = setInterval(() => {
      remaining--;
      setCooldownSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(cooldownRef.current);
        setCooldownActive(false);
      }
    }, 1000);
  }, [canTest, rule, grid, testCount]);

  const clearBoard = useCallback(() => {
    setGrid(emptyGrid());
    setResultBorder(null);
    setResultLabel(null);
  }, []);

  const loadBoard = useCallback((boardGrid) => {
    setGrid(cloneGrid(boardGrid));
    setResultBorder(null);
    setResultLabel(null);
  }, []);

  const finishExperiments = useCallback(() => {
    setShowConfirm(false);
    setGamePhase("finished");
    timer.stop();
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldownActive(false);
  }, [timer]);

  useImperativeHandle(ref, () => ({
    onTimeExpired() {
      setGamePhase("finished");
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      setCooldownActive(false);
    },
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        flexDirection: "column",
        color: "#e0e0e0",
      }}
    >
      {showConfirm && (
        <ConfirmDialog
          message="Finish experiments? You won't be able to run more tests."
          onConfirm={finishExperiments}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          borderBottom: "1px solid #222",
          background: "#0d0d0d",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#999",
              textTransform: "uppercase",
            }}
          >
            Constellations
          </span>
        </div>
        <Timer display={timer.display} fraction={timer.fraction} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 12,
              color: testingDisabled ? "#F97316" : "#666",
            }}
          >
            Tests: {testCount}/{MAX_TESTS}
          </span>
          <button
            onClick={onNewGame}
            style={{
              padding: "4px 12px",
              fontSize: 11,
              borderRadius: 4,
              border: "1px solid #333",
              background: "transparent",
              color: "#777",
              cursor: "pointer",
            }}
          >
            New Game
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Panel */}
        <div
          style={{
            flex: "1 1 60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 20px",
            gap: 14,
            overflowY: "auto",
          }}
        >
          {gamePhase === "finished" && (
            <div
              style={{
                padding: "5px 14px",
                borderRadius: 4,
                background: "rgba(249,115,22,0.08)",
                border: "1px solid rgba(249,115,22,0.2)",
                color: "#F97316",
                fontSize: 11,
                textTransform: "uppercase",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              Experimentation Complete
            </div>
          )}

          {testingDisabled && isExperimenting && (
            <div
              style={{
                padding: "5px 14px",
                borderRadius: 4,
                background: "rgba(249,115,22,0.08)",
                border: "1px solid rgba(249,115,22,0.2)",
                color: "#F97316",
                fontSize: 11,
              }}
            >
              Test limit reached
            </div>
          )}

          {/* Palette */}
          <div>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#444",
                marginBottom: 5,
              }}
            >
              Symbols
            </div>
            <Palette
              selectedTool={selectedTool}
              onSelect={setSelectedTool}
              disabled={!isExperimenting}
            />
          </div>

          {/* Grid + Result */}
          <div style={{ position: "relative" }}>
            <Grid
              grid={grid}
              onCellClick={handleCellClick}
              resultBorder={resultBorder}
              disabled={!isExperimenting}
            />
            {resultLabel && (
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  padding: "2px 8px",
                  borderRadius: 3,
                  background: resultBorder,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {resultLabel}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={testBoard}
              disabled={!canTest}
              style={{
                padding: "9px 24px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 4,
                border: canTest ? "1px solid #555" : "1px solid #222",
                background: canTest ? "rgba(255,255,255,0.06)" : "transparent",
                color: canTest ? "#e0e0e0" : "#444",
                cursor: canTest ? "pointer" : "default",
                letterSpacing: "0.03em",
                minWidth: 140,
              }}
            >
              {cooldownActive ? `Test (${cooldownSeconds}s)` : "Test Board"}
            </button>

            <button
              onClick={clearBoard}
              disabled={!isExperimenting}
              style={{
                padding: "9px 18px",
                fontSize: 12,
                borderRadius: 4,
                border: "1px solid #222",
                background: "transparent",
                color: isExperimenting ? "#777" : "#333",
                cursor: isExperimenting ? "pointer" : "default",
              }}
            >
              Clear
            </button>

            {isExperimenting && (
              <button
                onClick={() => setShowConfirm(true)}
                style={{
                  padding: "9px 18px",
                  fontSize: 12,
                  borderRadius: 4,
                  border: "1px solid rgba(249,115,22,0.3)",
                  background: "rgba(249,115,22,0.06)",
                  color: "#F97316",
                  cursor: "pointer",
                }}
              >
                Finish
              </button>
            )}
          </div>

          {/* Post-experiment */}
          {gamePhase === "finished" && (
            <div
              style={{
                width: "100%",
                maxWidth: 360,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 4,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#555",
                }}
              >
                What is the rule?
              </div>
              <textarea
                value={playerGuess}
                onChange={(e) => setPlayerGuess(e.target.value)}
                placeholder="Describe the rule you think governs valid boards..."
                style={{
                  width: "100%",
                  minHeight: 72,
                  padding: 10,
                  fontSize: 13,
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: 4,
                  color: "#ccc",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {!ruleRevealed ? (
                <button
                  onClick={() => setRuleRevealed(true)}
                  style={{
                    padding: "9px 20px",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 4,
                    border: "1px solid rgba(59,130,246,0.3)",
                    background: "rgba(59,130,246,0.06)",
                    color: "#3B82F6",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                  }}
                >
                  Reveal Rule
                </button>
              ) : (
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 4,
                    background: "rgba(59,130,246,0.06)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "rgba(59,130,246,0.5)",
                      marginBottom: 5,
                    }}
                  >
                    The Rule
                  </div>
                  <div
                    style={{ fontSize: 14, color: "#3B82F6", lineHeight: 1.5 }}
                  >
                    {rule.description}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel — History */}
        <div
          style={{
            flex: "0 0 35%",
            minWidth: 250,
            borderLeft: "1px solid #222",
            display: "flex",
            flexDirection: "column",
            background: "#0d0d0d",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #222",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#555",
              flexShrink: 0,
            }}
          >
            History ({history.length})
          </div>
          <HistoryPanel history={history} onLoadBoard={loadBoard} />
        </div>
      </div>
    </div>
  );
});

export default GameScreen;
