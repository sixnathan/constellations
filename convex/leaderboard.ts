import { query } from "./_generated/server";
import { v } from "convex/values";

const MIN_GAMES = 5;
const LEADERBOARD_LIMIT = 50;

export const getLeaderboard = query({
  args: {
    category: v.union(
      v.literal("solved"),
      v.literal("accuracy"),
      v.literal("speed"),
      v.literal("efficiency"),
    ),
  },
  handler: async (ctx, { category }) => {
    const allPlayers = await ctx.db.query("players").collect();

    const qualified = allPlayers.filter((p) => p.totalGames >= MIN_GAMES);

    const scored = qualified.map((p) => {
      let score = 0;
      let formattedScore = "";

      switch (category) {
        case "solved":
          score = p.solvedRuleIds.length;
          formattedScore = `${score} rules`;
          break;
        case "accuracy":
          score = p.totalGames > 0 ? (p.correctGames / p.totalGames) * 100 : 0;
          formattedScore = `${Math.round(score)}%`;
          break;
        case "speed":
          score = p.totalGames > 0 ? p.totalTimeUsed / p.totalGames : Infinity;
          formattedScore = `${Math.round(score)}s avg`;
          break;
        case "efficiency":
          score = p.totalGames > 0 ? p.totalTestsUsed / p.totalGames : Infinity;
          formattedScore = `${(Math.round(score * 10) / 10).toFixed(1)} avg`;
          break;
      }

      return {
        playerId: p._id,
        displayName: p.displayName,
        totalGames: p.totalGames,
        score,
        formattedScore,
      };
    });

    const isLowerBetter = category === "speed" || category === "efficiency";

    scored.sort((a, b) =>
      isLowerBetter ? a.score - b.score : b.score - a.score,
    );

    return scored.slice(0, LEADERBOARD_LIMIT);
  },
});
