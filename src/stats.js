const STATS_KEY = "constellations-stats";
const SOLVED_KEY = "constellations-solved";

export function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGameResult({
  ruleId,
  ruleDescription,
  playerGuess,
  result,
  timeUsed,
  testsUsed,
  gridSize,
}) {
  const stats = loadStats();
  const entry = {
    ruleId,
    ruleDescription,
    playerGuess,
    result,
    timeUsed,
    testsUsed,
    gridSize,
    date: new Date().toISOString(),
  };
  const updated = [...stats, entry];
  localStorage.setItem(STATS_KEY, JSON.stringify(updated));

  if (result === "correct") {
    const solved = getSolvedRuleIds();
    if (!solved.includes(ruleId)) {
      localStorage.setItem(SOLVED_KEY, JSON.stringify([...solved, ruleId]));
    }
  }

  return entry;
}

export function getSolvedRuleIds() {
  try {
    const raw = localStorage.getItem(SOLVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getStatsSummary(stats) {
  if (stats.length === 0) {
    return {
      total: 0,
      correct: 0,
      partial: 0,
      wrong: 0,
      correctPct: 0,
      partialPct: 0,
      wrongPct: 0,
      avgTime: 0,
      avgTests: 0,
    };
  }

  const correct = stats.filter((s) => s.result === "correct").length;
  const partial = stats.filter((s) => s.result === "partial").length;
  const wrong = stats.filter((s) => s.result === "wrong").length;
  const total = stats.length;

  const avgTime = stats.reduce((sum, s) => sum + (s.timeUsed || 0), 0) / total;
  const avgTests =
    stats.reduce((sum, s) => sum + (s.testsUsed || 0), 0) / total;

  return {
    total,
    correct,
    partial,
    wrong,
    correctPct: Math.round((correct / total) * 100),
    partialPct: Math.round((partial / total) * 100),
    wrongPct: Math.round((wrong / total) * 100),
    avgTime: Math.round(avgTime * 10) / 10,
    avgTests: Math.round(avgTests * 10) / 10,
  };
}

export function clearStats() {
  localStorage.removeItem(STATS_KEY);
}

export function resetSolvedRules() {
  localStorage.removeItem(SOLVED_KEY);
}
