import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const ADJECTIVES = [
  "Star",
  "Lunar",
  "Solar",
  "Nova",
  "Comet",
  "Nebula",
  "Orbit",
  "Cosmic",
  "Astral",
  "Quasar",
  "Stellar",
  "Pulsar",
  "Zenith",
  "Eclipse",
  "Aurora",
  "Vortex",
  "Prism",
  "Radiant",
  "Cipher",
  "Flux",
];

function generateDisplayName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}-${num}`;
}

export const getOrCreatePlayer = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const existing = await ctx.db
      .query("players")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (existing) {
      return existing;
    }

    const id = await ctx.db.insert("players", {
      sessionId,
      displayName: generateDisplayName(),
      totalGames: 0,
      correctGames: 0,
      partialGames: 0,
      wrongGames: 0,
      totalTimeUsed: 0,
      totalTestsUsed: 0,
      solvedRuleIds: [],
    });

    return await ctx.db.get(id);
  },
});

export const getPlayer = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("players")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();
  },
});

export const updateDisplayName = mutation({
  args: { sessionId: v.string(), displayName: v.string() },
  handler: async (ctx, { sessionId, displayName }) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (!player) return null;

    const trimmed = displayName.trim().slice(0, 30);
    if (trimmed.length === 0) return player;

    await ctx.db.patch(player._id, { displayName: trimmed });
    return { ...player, displayName: trimmed };
  },
});
