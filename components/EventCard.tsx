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
    <Card className="group flex flex-col shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-primary/10 overflow-hidden border">
      <CardHeader className="bg-muted/30 pb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150" />
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-lg font-semibold">{title}</CardTitle>
          {isPast ? (
            <Badge variant="outline" className="shrink-0 text-muted-foreground">Past</Badge>
          ) : isFull ? (
            <Badge variant="destructive" className="shrink-0 animate-in fade-in">Full</Badge>
          ) : (
            <Badge variant="default" className="shrink-0">Open</Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pt-5 text-sm text-foreground/80">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CalendarIcon className="size-4" />
          </div>
          <span className="font-medium">
            {eventDate.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPinIcon className="size-4" />
          </div>
          <span className="font-medium">{location}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UsersIcon className="size-4" />
          </div>
          <span className="font-medium">
            {participantCount} / {maxVolunteers} volunteers
          </span>
        </div>
      </CardContent>
      <CardFooter className="gap-3 pt-4 border-t bg-muted/10">
        <Link href={`/events/${id}`} className="flex-1 transition-transform active:scale-95">
          <Button variant="default" className="w-full shadow-sm hover:shadow">
            View Details
          </Button>
        </Link>
        {onDelete && (
          <Button variant="destructive" size="icon" onClick={onDelete} className="transition-transform active:scale-95">
            <TrashIcon className="size-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
