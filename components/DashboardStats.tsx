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
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border-border/50 bg-card/60 backdrop-blur-xl">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
            {title}
          </CardTitle>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {value}
        </div>
        {description && (
          <p className="mt-2 text-xs font-medium text-muted-foreground/80">{description}</p>
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
