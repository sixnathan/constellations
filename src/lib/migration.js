import { convex, isConvexEnabled } from "./convexClient.js";
import { getSessionId } from "./playerId.js";
import { api } from "../../convex/_generated/api";

const MIGRATED_KEY = "constellations-migrated";
const STATS_KEY = "constellations-stats";

export async function migrateLocalDataToConvex() {
  if (!isConvexEnabled || !convex) return;
  if (localStorage.getItem(MIGRATED_KEY)) return;

  const raw = localStorage.getItem(STATS_KEY);
  if (!raw) {
    localStorage.setItem(MIGRATED_KEY, "true");
    return;
  }

  let stats;
  try {
    stats = JSON.parse(raw);
  } catch {
    localStorage.setItem(MIGRATED_KEY, "true");
    return;
  }

  if (!Array.isArray(stats) || stats.length === 0) {
    localStorage.setItem(MIGRATED_KEY, "true");
    return;
  }

  const sessionId = getSessionId();

  const results = stats.map((s) => ({
    ruleId: s.ruleId || "",
    ruleDescription: s.ruleDescription || "",
    playerGuess: s.playerGuess || "",
    result: s.result || "wrong",
    timeUsed: s.timeUsed || 0,
    testsUsed: s.testsUsed || 0,
    gridSize: s.gridSize || 6,
    date: s.date || new Date().toISOString(),
  }));

  try {
    await convex.mutation(api.gameResults.migrateResults, {
      sessionId,
      results,
    });
    localStorage.setItem(MIGRATED_KEY, "true");
  } catch {
    // will retry next session
  }
}
