import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  userProfiles: defineTable({
    userId: v.string(), // references authTables users._id
    name: v.optional(v.string()),
    totalRoasts: v.number(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  roasts: defineTable({
    userId: v.optional(v.id("users")),
    imageStorageId: v.optional(v.id("_storage")),

    // AI Generated Output
    roastText: v.string(),
    hotTake: v.string(),
    brutalRating: v.number(), // 1-10
    redFlagsIdentified: v.array(v.string()),

    createdAt: v.number(),
  }).index("by_userId", ["userId"]).index("by_createdAt", ["createdAt"]),
});
