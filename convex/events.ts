import { query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const listFeed = query({
  args: {
    paginationOpts: paginationOptsValidator,
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    let eventsQuery;

    if (args.organizationId !== undefined) {
      const orgId = args.organizationId;
      eventsQuery = ctx.db
        .query("events")
        .withIndex("by_organization", (q) =>
          q.eq("organizationId", orgId)
        )
        .filter((q) => q.eq(q.field("isPublished"), true))
        .order("desc");
    } else {
      eventsQuery = ctx.db
        .query("events")
        .withIndex("by_published", (q) => q.eq("isPublished", true))
        .order("desc");
    }

    const paginatedEvents = await eventsQuery.paginate(args.paginationOpts);

    // Enrich events with organization data
    const enrichedPage = await Promise.all(
      paginatedEvents.page.map(async (event) => {
        const organization = await ctx.db.get(event.organizationId);
        const author = await ctx.db.get(event.authorId);
        return {
          ...event,
          organization,
          author: author
            ? { name: author.name, avatar: author.avatar }
            : null,
        };
      })
    );

    return {
      ...paginatedEvents,
      page: enrichedPage,
    };
  },
});

export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event) return null;

    const organization = await ctx.db.get(event.organizationId);
    const author = await ctx.db.get(event.authorId);

    return {
      ...event,
      organization,
      author: author ? { name: author.name, avatar: author.avatar } : null,
    };
  },
});

export const getUpcoming = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const limit = args.limit ?? 5;

    const events = await ctx.db
      .query("events")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .filter((q) => q.gte(q.field("dateTime"), now))
      .order("asc")
      .take(limit);

    return Promise.all(
      events.map(async (event) => {
        const organization = await ctx.db.get(event.organizationId);
        return { ...event, organization };
      })
    );
  },
});

export const search = query({
  args: { searchTerm: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const events = await ctx.db
      .query("events")
      .withSearchIndex("search_events", (q) =>
        q.search("title", args.searchTerm).eq("isPublished", true)
      )
      .take(limit);

    return Promise.all(
      events.map(async (event) => {
        const organization = await ctx.db.get(event.organizationId);
        return { ...event, organization };
      })
    );
  },
});
