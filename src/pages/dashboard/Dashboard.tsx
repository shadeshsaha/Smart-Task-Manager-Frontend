import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { StatCard } from "../../components/cards/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, members: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentReassign, setRecentReassign] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const projects = await API.get("/projects");
        const tasks = await API.get("/tasks");
        const members = await API.get("/teams"); // count team members
        const logs = await API.get("/reassign/logs");
        setStats({
          projects: projects.data.length,
          tasks: tasks.data.length,
          members: members.data.length,
        });
        setRecentReassign(logs.data.logs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard title="Projects" value={stats.projects} />
      <StatCard title="Tasks" value={stats.tasks} />
      <StatCard title="Members" value={stats.members} />

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Reassignments</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReassign.map((log, idx) => (
            <p key={idx}>{log.message}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
