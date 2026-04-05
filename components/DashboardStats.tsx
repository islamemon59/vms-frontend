import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { UsersIcon, CalendarIcon, CalendarCheckIcon, LinkIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  totalVolunteers: number;
  totalEvents: number;
  upcomingEvents: number;
  totalParticipations: number;
}

export default function DashboardStats({
  totalVolunteers,
  totalEvents,
  upcomingEvents,
  totalParticipations,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Volunteers"
        value={totalVolunteers}
        description="Registered volunteers"
        icon={<UsersIcon className="size-5" />}
      />
      <StatCard
        title="Total Events"
        value={totalEvents}
        description="All events created"
        icon={<CalendarIcon className="size-5" />}
      />
      <StatCard
        title="Upcoming Events"
        value={upcomingEvents}
        description="Events in the future"
        icon={<CalendarCheckIcon className="size-5" />}
      />
      <StatCard
        title="Participations"
        value={totalParticipations}
        description="Total event registrations"
        icon={<LinkIcon className="size-5" />}
      />
    </div>
  );
}
