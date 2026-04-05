import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  participations?: { id: string; event: { title: string }; status: string }[];
}

interface VolunteerTableProps {
  volunteers: Volunteer[];
}

export default function VolunteerTable({ volunteers }: VolunteerTableProps) {
  if (volunteers.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No volunteers found.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Skills</TableHead>
          <TableHead>Events Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {volunteers.map((v) => (
          <TableRow key={v.id}>
            <TableCell className="font-medium">{v.name}</TableCell>
            <TableCell>{v.email}</TableCell>
            <TableCell>{v.phone}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {v.skills.split(",").map((skill) => (
                  <Badge key={skill.trim()} variant="secondary">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>{v.participations?.length ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
