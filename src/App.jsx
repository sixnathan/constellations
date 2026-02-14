import { useState, useCallback, useRef } from "react";
import { RULES, generateExamples } from "./rules/index.js";
import { cloneGrid } from "./rules/helpers.js";
import { useTimer } from "./hooks/useTimer.js";
import SetupScreen from "./components/SetupScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";

export default function App() {
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
      setTimeout(() => timer.start(), 0);
    },
    [timer],
  );

  const handleNewGame = useCallback(() => {
    timer.stop();
    setGameState(null);
  }, [timer]);

  if (!gameState) {
    return <SetupScreen onStart={startGame} />;
  }

  return (
    <GameScreen
      ref={gameScreenRef}
      key={gameState.gameId}
      rule={gameState.rule}
      initialHistory={gameState.initialHistory}
      timer={timer}
      onNewGame={handleNewGame}
    />
  );
}
