import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  ArrowUp,
  Bookmark,
  MessageCircle,
  Calendar,
  MapPin,
  ExternalLink,
  Users,
} from "lucide-react";
import type { Doc, Id } from "@/convex/_generated/dataModel.d.ts";

type EventWithOrg = Doc<"events"> & {
  organization: Doc<"organizations"> | null;
  author: { name?: string; avatar?: string } | null;
};

type EventCardProps = {
  event: EventWithOrg;
  onUpvote?: (eventId: Id<"events">) => void;
  onBookmark?: (eventId: Id<"events">) => void;
};

function getEventDateLabel(dateTime: string): string {
  const date = new Date(dateTime);
  if (isPast(date)) return "Past";
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d");
}

function getEventTimeDisplay(dateTime: string): string {
  const date = new Date(dateTime);
  return format(date, "h:mm a");
}

const audienceLabels: Record<string, string> = {
  ug: "UG",
  pg: "PG",
  phd: "PhD",
  faculty: "Faculty",
  staff: "Staff",
  all: "Everyone",
};

const modeColors: Record<string, string> = {
  online: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  offline: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  hybrid: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export default function EventCard({ event, onUpvote, onBookmark }: EventCardProps) {
  const dateLabel = getEventDateLabel(event.dateTime);
  const timeDisplay = getEventTimeDisplay(event.dateTime);
  const isEventPast = isPast(new Date(event.dateTime));

  return (
    <Card className="overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/50 hover:border-primary/20">
      {/* Media Section */}
      {event.media.length > 0 && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={event.media[0].url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {/* Date Badge */}
          <div className="absolute top-3 left-3">
            <div
              className={`px-3 py-1.5 rounded-lg backdrop-blur-md text-sm font-semibold ${
                isEventPast
                  ? "bg-muted/90 text-muted-foreground"
                  : dateLabel === "Today"
                    ? "bg-accent/90 text-accent-foreground"
                    : "bg-background/90 text-foreground"
              }`}
            >
              {dateLabel}
            </div>
          </div>
          {/* Mode Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className={modeColors[event.mode]}>
              {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
            </Badge>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Organization */}
        {event.organization && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {event.organization.logo ? (
                <img
                  src={event.organization.logo}
                  alt={event.organization.name}
                  className="w-6 h-6 rounded"
                />
              ) : (
                <span className="text-xs font-bold text-primary">
                  {event.organization.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{event.organization.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(event._creationTime), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        )}

        {/* Title & Description */}
        <h3
          className="text-lg font-semibold mb-2 line-clamp-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(event.dateTime), "MMM d")} at {timeDisplay}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[150px]">{event.venue}</span>
          </div>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{event.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Audience */}
        {event.audience.length > 0 && !event.audience.includes("all") && (
          <div className="flex items-center gap-1.5 mb-4 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>For: {event.audience.map((a) => audienceLabels[a]).join(", ")}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-primary"
              onClick={() => onUpvote?.(event._id)}
            >
              <ArrowUp className="w-4 h-4" />
              <span>{event.upvoteCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{event.commentCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={() => onBookmark?.(event._id)}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>

          {event.registrationLink && (
            <Button size="sm" variant="secondary" className="gap-1.5" asChild>
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                Register
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
