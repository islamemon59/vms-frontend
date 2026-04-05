"use client";

import { useEffect, useState } from "react";
import { getAllVolunteerRequests, approveVolunteerRequest, rejectVolunteerRequest } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, CheckIcon, XIcon } from "lucide-react";

interface VolunteerRequest {
  id: string;
  phone: string;
  address: string;
  skills: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function VolunteerRequestsPage() {
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchRequests = () => {
    setLoading(true);
    getAllVolunteerRequests()
      .then((res) => setRequests(res.data))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      await approveVolunteerRequest(id);
      fetchRequests();
    } catch {
      alert("Failed to approve request");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    try {
      await rejectVolunteerRequest(id);
      fetchRequests();
    } catch {
      alert("Failed to reject request");
    } finally {
      setProcessing(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const pastRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Volunteer Requests</h1>
        <p className="mt-1.5 text-muted-foreground">
          Review and manage volunteer applications
        </p>
      </div>

      {/* Pending Requests */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pending Requests ({pendingRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-muted-foreground">No pending requests.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.user.name}</TableCell>
                    <TableCell>{req.user.email}</TableCell>
                    <TableCell>{req.phone}</TableCell>
                    <TableCell className="max-w-50 truncate">{req.skills}</TableCell>
                    <TableCell>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(req.id)}
                          disabled={processing === req.id}
                        >
                          {processing === req.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <><CheckIcon className="mr-1 size-4" />Approve</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(req.id)}
                          disabled={processing === req.id}
                        >
                          {processing === req.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <><XIcon className="mr-1 size-4" />Reject</>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Past Requests */}
      {pastRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.user.name}</TableCell>
                    <TableCell>{req.user.email}</TableCell>
                    <TableCell>{req.phone}</TableCell>
                    <TableCell className="max-w-50 truncate">{req.skills}</TableCell>
                    <TableCell>{statusBadge(req.status)}</TableCell>
                    <TableCell>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
