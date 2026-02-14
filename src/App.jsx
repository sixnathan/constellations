import { useState, useCallback, useRef } from "react";
import { RULES, generateExamples } from "./rules/index.js";
import { cloneGrid } from "./rules/helpers.js";
import { useTimer } from "./hooks/useTimer.js";
import SetupScreen from "./components/SetupScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import RulesPage from "./components/RulesPage.jsx";

export default function App() {
  const [page, setPage] = useState("setup"); // setup | rules | game
  const [gameState, setGameState] = useState(null);
  const gameScreenRef = useRef(null);

  const timer = useTimer(10, () => {
    gameScreenRef.current?.onTimeExpired();
  });

  const startGame = useCallback(
    (minutes) => {
      timer.reset(minutes);

      const rule = RULES[Math.floor(Math.random() * RULES.length)];
      const examples = generateExamples(rule);

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

      setGameState({ rule, initialHistory, gameId: Date.now() });
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

  if (page === "game" && gameState) {
    return (
      <GameScreen
        ref={gameScreenRef}
        key={gameState.gameId}
        rule={gameState.rule}
        initialHistory={gameState.initialHistory}
        timer={timer}
        onExit={handleExit}
      />
    );
  }

  return <SetupScreen onStart={startGame} onRules={() => setPage("rules")} />;
}
