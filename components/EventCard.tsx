import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon, TrashIcon } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  maxVolunteers: number;
  participantCount: number;
  onDelete?: () => void;
}

export default function EventCard({
  id,
  title,
  description,
  location,
  date,
  maxVolunteers,
  participantCount,
  onDelete,
}: EventCardProps) {
  const isFull = participantCount >= maxVolunteers;
  const eventDate = new Date(date);
  const isPast = eventDate < new Date();

  return (
    <Card className="flex flex-col shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
          {isPast ? (
            <Badge variant="outline" className="shrink-0 text-muted-foreground">Past</Badge>
          ) : isFull ? (
            <Badge variant="destructive" className="shrink-0">Full</Badge>
          ) : (
            <Badge variant="default" className="shrink-0">Open</Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 text-primary/60" />
          <span>
            {eventDate.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="size-4 text-primary/60" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="size-4 text-primary/60" />
          <span>
            {participantCount} / {maxVolunteers} volunteers
          </span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Link href={`/events/${id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        {onDelete && (
          <Button variant="destructive" size="icon" onClick={onDelete}>
            <TrashIcon className="size-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
