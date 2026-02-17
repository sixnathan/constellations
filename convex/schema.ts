import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    sessionId: v.string(),
    displayName: v.string(),
    totalGames: v.number(),
    correctGames: v.number(),
    partialGames: v.number(),
    wrongGames: v.number(),
    totalTimeUsed: v.number(),
    totalTestsUsed: v.number(),
    solvedRuleIds: v.array(v.string()),
  }).index("by_session", ["sessionId"]),

  gameResults: defineTable({
    playerId: v.id("players"),
    sessionId: v.string(),
    ruleId: v.string(),
    ruleDescription: v.string(),
    playerGuess: v.string(),
    result: v.string(),
    timeUsed: v.number(),
    testsUsed: v.number(),
    gridSize: v.number(),
    playedAt: v.number(),
  })
    .index("by_player", ["playerId"])
    .index("by_session", ["sessionId"]),
});
