/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ActivityAPI from "@/api/activity";
import * as ProjectsAPI from "@/api/projects";
import * as TasksAPI from "@/api/tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { StatCard } from "../../components/cards/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, members: 0 });

  const [recentReassign, setRecentReassign] = useState<any[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [teamSummary, setTeamSummary] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const projects = await API.get("/projects");
        const tasks = await API.get("/tasks");
        // const members = await API.get("/teams"); // count team members
        // const logs = await API.get("/reassign/logs");
        const p = await ProjectsAPI.fetchProjects();
        setTotalProjects(p.data.length);
        const t = await TasksAPI.fetchTasks();
        setTotalTasks(t.data.tasks?.length ?? t.data.length ?? 0);

        // fetch teams to build team summary
        const teamsRes = await import("../../api/teams").then((m) =>
          m.fetchTeams()
        );
        const teams = teamsRes.data;
        // flatten members with currentTasks and capacity
        const members = teams.flatMap((team: any) =>
          (team.members || []).map((m: any) => ({
            teamId: team.id,
            teamName: team.name,
            ...m,
          }))
        );
        setTeamSummary(members);

        // logs
        const logs = await ActivityAPI.fetchRecentLogs();
        setRecent(logs.data.logs || logs.data);

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
    // <div className="grid grid-cols-3 gap-4">
    //   <StatCard title="Projects" value={stats.projects} />
    //   <StatCard title="Tasks" value={stats.tasks} />
    //   <StatCard title="Members" value={stats.members} />

    //   <Card className="col-span-3">
    //     <CardHeader>
    //       <CardTitle>Recent Reassignments</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       {recentReassign.map((log, idx) => (
    //         <p key={idx}>{log.message}</p>
    //       ))}
    //     </CardContent>
    //   </Card>
    // </div>

    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <StatCard title="Total Projects" value={totalProjects} />
        <StatCard title="Total Tasks" value={totalTasks} />
        <Card style={{ flex: 1 }}>
          <CardHeader>
            <CardTitle>Reassign</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={async () => {
                try {
                  // call reassign for all teams (example: prompt for team id)
                  const teamId = window.prompt("Enter teamId to reassign");
                  if (!teamId) return;
                  await import("../../api/teams").then((m) =>
                    m.fetchTeam(Number(teamId))
                  ); // just validate
                  await import("../../api/teams").then((m) =>
                    m.autoAssignTask({ projectId: Number(teamId), taskId: 0 })
                  );
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              Reassign Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
        <Card>
          <CardHeader>
            <CardTitle>Team Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {teamSummary.map((m: any) => (
                <li key={m.id} style={{ marginBottom: 8 }}>
                  <strong>{m.name}</strong> — {m.currentTasks}/{m.capacity}{" "}
                  {m.currentTasks > m.capacity && (
                    <span style={{ color: "red" }}>Overloaded</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reassignments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {recent.length === 0 ? (
                <li>No recent reassignments</li>
              ) : (
                recent.map((r: any) => (
                  <li key={r.id}>
                    {r.message} — {new Date(r.createdAt).toLocaleString()}
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
