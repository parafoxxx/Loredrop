import { useState } from "react";
import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import FeedHeader from "./_components/FeedHeader.tsx";
import OrganizationFilter from "./_components/OrganizationFilter.tsx";
import EventCard from "./_components/EventCard.tsx";
import UpcomingEventsSidebar from "./_components/UpcomingEventsSidebar.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty.tsx";
import { Calendar, Loader2 } from "lucide-react";

export default function FeedPage() {
  const [selectedOrgId, setSelectedOrgId] = useState<Id<"organizations"> | null>(null);

  // Fetch organizations for filter
  const organizations = useQuery(api.organizations.list) ?? [];

  // Fetch paginated events
  const {
    results: events,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.events.listFeed,
    selectedOrgId ? { organizationId: selectedOrgId } : {},
    { initialNumItems: 10 }
  );

  // Fetch upcoming events for sidebar
  const upcomingEvents = useQuery(api.events.getUpcoming, { limit: 5 }) ?? [];

  const isLoadingFirst = status === "LoadingFirstPage";
  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Left Sidebar - Organization Filter */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <OrganizationFilter
                organizations={organizations}
                selectedId={selectedOrgId}
                onSelect={(id) => setSelectedOrgId(id as Id<"organizations"> | null)}
              />
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-1 min-w-0">
            {/* Feed Header */}
            <div className="mb-6">
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {selectedOrgId
                  ? organizations.find((o) => o._id === selectedOrgId)?.name || "Events"
                  : "For You"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {selectedOrgId
                  ? "Latest events from this organization"
                  : "Discover events from across campus"}
              </p>
            </div>

            {/* Loading State */}
            {isLoadingFirst && (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border/50 overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoadingFirst && events.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Calendar />
                  </EmptyMedia>
                  <EmptyTitle>No events yet</EmptyTitle>
                  <EmptyDescription>
                    {selectedOrgId
                      ? "This organization hasn't posted any events yet."
                      : "Check back soon for upcoming campus events!"}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}

            {/* Events Feed */}
            {!isLoadingFirst && events.length > 0 && (
              <div className="space-y-6">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}

                {/* Load More */}
                {(canLoadMore || isLoadingMore) && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => loadMore(10)}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More Events"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Right Sidebar - Upcoming Events */}
          <aside className="hidden xl:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <UpcomingEventsSidebar events={upcomingEvents} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
