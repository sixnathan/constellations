import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveResult = mutation({
  args: {
    sessionId: v.string(),
    ruleId: v.string(),
    ruleDescription: v.string(),
    playerGuess: v.string(),
    result: v.union(
      v.literal("correct"),
      v.literal("partial"),
      v.literal("wrong"),
    ),
    timeUsed: v.number(),
    testsUsed: v.number(),
    gridSize: v.number(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!player) return null;

    await ctx.db.insert("gameResults", {
      playerId: player._id,
      sessionId: args.sessionId,
      ruleId: args.ruleId,
      ruleDescription: args.ruleDescription.slice(0, 500),
      playerGuess: args.playerGuess.slice(0, 1000),
      result: args.result,
      timeUsed: args.timeUsed,
      testsUsed: args.testsUsed,
      gridSize: args.gridSize,
      playedAt: Date.now(),
    });

    const updatedSolved =
      args.result === "correct" && !player.solvedRuleIds.includes(args.ruleId)
        ? [...player.solvedRuleIds, args.ruleId]
        : player.solvedRuleIds;

    await ctx.db.patch(player._id, {
      totalGames: player.totalGames + 1,
      correctGames: player.correctGames + (args.result === "correct" ? 1 : 0),
      partialGames: player.partialGames + (args.result === "partial" ? 1 : 0),
      wrongGames: player.wrongGames + (args.result === "wrong" ? 1 : 0),
      totalTimeUsed: player.totalTimeUsed + args.timeUsed,
      totalTestsUsed: player.totalTestsUsed + args.testsUsed,
      solvedRuleIds: updatedSolved,
    });

    return { success: true };
  },
});

export const getPlayerHistory = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("gameResults")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("desc")
      .collect();
  },
});

export const migrateResults = mutation({
  args: {
    sessionId: v.string(),
    results: v.array(
      v.object({
        ruleId: v.string(),
        ruleDescription: v.string(),
        playerGuess: v.string(),
        result: v.string(),
        timeUsed: v.number(),
        testsUsed: v.number(),
        gridSize: v.number(),
        date: v.string(),
      }),
    ),
  },
  handler: async (ctx, { sessionId, results }) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (!player) return { migrated: 0 };

    const existing = await ctx.db
      .query("gameResults")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (existing) return { migrated: 0 };

    let totalGames = 0;
    let correctGames = 0;
    let partialGames = 0;
    let wrongGames = 0;
    let totalTimeUsed = 0;
    let totalTestsUsed = 0;
    const solvedRuleIds = new Set(player.solvedRuleIds);

    for (const r of results) {
      await ctx.db.insert("gameResults", {
        playerId: player._id,
        sessionId,
        ruleId: r.ruleId,
        ruleDescription: r.ruleDescription,
        playerGuess: r.playerGuess,
        result: r.result,
        timeUsed: r.timeUsed,
        testsUsed: r.testsUsed,
        gridSize: r.gridSize,
        playedAt: new Date(r.date).getTime(),
      });

      totalGames++;
      if (r.result === "correct") {
        correctGames++;
        solvedRuleIds.add(r.ruleId);
      } else if (r.result === "partial") {
        partialGames++;
      } else {
        wrongGames++;
      }
      totalTimeUsed += r.timeUsed;
      totalTestsUsed += r.testsUsed;
    }

    await ctx.db.patch(player._id, {
      totalGames: player.totalGames + totalGames,
      correctGames: player.correctGames + correctGames,
      partialGames: player.partialGames + partialGames,
      wrongGames: player.wrongGames + wrongGames,
      totalTimeUsed: player.totalTimeUsed + totalTimeUsed,
      totalTestsUsed: player.totalTestsUsed + totalTestsUsed,
      solvedRuleIds: [...solvedRuleIds],
    });

    return { migrated: totalGames };
  },
});
