import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.optional(v.union(v.literal("student"), v.literal("professor"), v.literal("admin"))),
    organizationId: v.optional(v.id("organizations")),
  }).index("by_token", ["tokenIdentifier"]),

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("council"),
      v.literal("club"),
      v.literal("festival"),
      v.literal("department"),
      v.literal("other")
    ),
    logo: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    isVerified: v.boolean(),
    followerCount: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_type", ["type"]),

  events: defineTable({
    title: v.string(),
    description: v.string(),
    organizationId: v.id("organizations"),
    authorId: v.id("users"),
    dateTime: v.string(), // ISO 8601 UTC
    endDateTime: v.optional(v.string()), // ISO 8601 UTC
    venue: v.string(),
    mode: v.union(v.literal("online"), v.literal("offline"), v.literal("hybrid")),
    tags: v.array(v.string()),
    audience: v.array(
      v.union(
        v.literal("ug"),
        v.literal("pg"),
        v.literal("phd"),
        v.literal("faculty"),
        v.literal("staff"),
        v.literal("all")
      )
    ),
    media: v.array(
      v.object({
        type: v.union(v.literal("image"), v.literal("video")),
        url: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
    registrationLink: v.optional(v.string()),
    upvoteCount: v.number(),
    commentCount: v.number(),
    isPublished: v.boolean(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_published", ["isPublished"])
    .searchIndex("search_events", {
      searchField: "title",
      filterFields: ["organizationId", "isPublished"],
    }),

  // User interactions with events
  eventUpvotes: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_and_user", ["eventId", "userId"]),

  eventBookmarks: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_and_user", ["eventId", "userId"]),

  // Organization follows
  organizationFollows: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_org_and_user", ["organizationId", "userId"]),
});
