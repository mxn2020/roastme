import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveRoast = mutation({
  args: {
    roastText: v.string(),
    hotTake: v.string(),
    brutalRating: v.number(),
    redFlagsIdentified: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const roastId = await ctx.db.insert("roasts", {
      roastText: args.roastText,
      hotTake: args.hotTake,
      brutalRating: args.brutalRating,
      redFlagsIdentified: args.redFlagsIdentified,
      createdAt: Date.now(),
    });
    return roastId;
  },
});

export const getRecentRoasts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("roasts")
      .order("desc")
      .take(20);
  },
});

export const getStatus = query({
  args: {},
  handler: async () => {
    return { status: "Online", timestamp: Date.now() };
  },
});
