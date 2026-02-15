import { useState, useCallback, useRef } from "react";
import { RULES, generateExamples } from "./rules/index.js";
import { cloneGrid } from "./rules/helpers.js";
import { useTimer } from "./hooks/useTimer.js";
import { getSolvedRuleIds } from "./stats.js";
import SetupScreen from "./components/SetupScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import RulesPage from "./components/RulesPage.jsx";
import StatsPage from "./components/StatsPage.jsx";

export default function App() {
  const [page, setPage] = useState("setup"); // setup | rules | stats | game
  const [gameState, setGameState] = useState(null);
  const gameScreenRef = useRef(null);

  const timer = useTimer(10, () => {
    gameScreenRef.current?.onTimeExpired();
  });

  const startGame = useCallback(
    ({ minutes, gridSize, exampleCount, exampleTypes, density }) => {
      timer.reset(minutes);

      // filter out already-solved rules
      const solvedIds = getSolvedRuleIds();
      let available = RULES.filter((r) => !solvedIds.includes(r.id));
      if (available.length === 0) {
        available = RULES; // all solved — cycle back through
      }

      const rule = available[Math.floor(Math.random() * available.length)];
      const examples = generateExamples(rule, {
        gridSize,
        count: exampleCount,
        types: exampleTypes,
        density,
      });

      const initialHistory = [];
      examples.valid.forEach((g) =>
        initialHistory.push({
          grid: cloneGrid(g),
          isValid: true,
          isInitial: true,
          testNumber: null,
        }),
      );
      examples.invalid.forEach((g) =>
        initialHistory.push({
          grid: cloneGrid(g),
          isValid: false,
          isInitial: true,
          testNumber: null,
        }),
      );
      for (let i = initialHistory.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [initialHistory[i], initialHistory[j]] = [
          initialHistory[j],
          initialHistory[i],
        ];
      }

      setGameState({ rule, initialHistory, gridSize, gameId: Date.now() });
      setPage("game");
      setTimeout(() => timer.start(), 0);
    },
    [timer],
  );

  const handleExit = useCallback(() => {
    timer.stop();
    setGameState(null);
    setPage("setup");
  }, [timer]);

  if (page === "rules") {
    return <RulesPage onBack={() => setPage("setup")} />;
  }

  if (page === "stats") {
    return <StatsPage onBack={() => setPage("setup")} />;
  }

  if (page === "game" && gameState) {
    return (
      <GameScreen
        ref={gameScreenRef}
        key={gameState.gameId}
        rule={gameState.rule}
        initialHistory={gameState.initialHistory}
        gridSize={gameState.gridSize}
        timer={timer}
        onExit={handleExit}
      />
    );
  }

  return (
    <SetupScreen
      onStart={startGame}
      onRules={() => setPage("rules")}
      onStats={() => setPage("stats")}
    />
  );
}
