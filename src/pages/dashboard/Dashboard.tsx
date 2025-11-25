/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Col, Row, Space, Table, message } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "../../redux/store";

interface Stats {
  totalProjects: number;
  totalTasks: number;
  totalTeams: number;
}

interface TeamMember {
  id: number;
  name: string;
  tasks: any[];
  capacity: number;
}

interface Team {
  id: number;
  name: string;
  members: TeamMember[];
}

interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
  assignedToId: number | null;
}

interface ActivityLog {
  id: number;
  message: string;
  createdAt: string;
}

const Dashboard = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalTasks: 0,
    totalTeams: 0,
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  //   const fetchDashboardData = async () => {
  //     try {
  //       // Fetch Projects
  //       const projectsRes = await axios.get("http://localhost:5000/api/projects", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const projects = projectsRes.data.projects || [];

  //       // Fetch Tasks
  //       const tasksRes = await axios.get("http://localhost:5000/api/tasks", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const tasks = tasksRes.data.tasks || [];

  //       // Fetch Teams
  //       const teamsRes = await axios.get("http://localhost:5000/api/teams", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const teamsData = teamsRes.data.teams || [];

  //       // Fetch Activity Logs
  //       const logsRes = await axios.get("http://localhost:5000/api/reassign/logs", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const logs = logsRes.data.logs || [];

  //       setStats({
  //         totalProjects: projects.length,
  //         totalTasks: tasks.length,
  //         totalTeams: teamsData.length,
  //       });

  //       setTeams(teamsData);
  //       setActivityLogs(logs.slice(0, 5)); // latest 5 logs
  //     } catch (err: any) {
  //       message.error("Failed to load dashboard data");
  //       console.error(err);
  //     }
  //   };

  const fetchDashboardData = useCallback(async () => {
    try {
      const projectsRes = await axios.get(
        "http://localhost:5000/api/projects",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const tasksRes = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const teamsRes = await axios.get("http://localhost:5000/api/teams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const logsRes = await axios.get(
        "http://localhost:5000/api/reassign/logs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const projects = projectsRes.data.projects || [];
      const tasks = tasksRes.data.tasks || [];
      const teamsData = teamsRes.data.teams || [];
      const logs = logsRes.data.logs || [];

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        totalTeams: teamsData.length,
      });

      setTeams(teamsData);
      setActivityLogs(logs.slice(0, 5));
    } catch (err: any) {
      message.error("Failed to load dashboard data");
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    (async () => {
      await fetchDashboardData();
    })();
  }, [token, fetchDashboardData]);

  const handleReassignTasks = async () => {
    try {
      // Reassign tasks for all teams
      for (const team of teams) {
        await axios.post(
          "http://localhost:5000/api/reassign",
          { teamId: team.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      toast.success("Tasks reassigned successfully");
      fetchDashboardData(); // Refresh dashboard
    } catch (err: any) {
      toast.error("Failed to reassign tasks");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Projects">
            <h2>{stats.totalProjects}</h2>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Tasks">
            <h2>{stats.totalTasks}</h2>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Teams">
            <h2>{stats.totalTeams}</h2>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card
            title={
              <Space>
                Team Members Status
                <Button type="primary" onClick={handleReassignTasks}>
                  Reassign Tasks
                </Button>
              </Space>
            }
          >
            {teams.map((team) => (
              <div key={team.id} style={{ marginBottom: 16 }}>
                <h3>{team.name}</h3>
                <Table
                  dataSource={team.members}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    { title: "Member", dataIndex: "name", key: "name" },
                    {
                      title: "Tasks / Capacity",
                      key: "tasksCapacity",
                      render: (_, member: TeamMember) => (
                        <span
                          style={{
                            color:
                              member.tasks.length > member.capacity
                                ? "red"
                                : "green",
                          }}
                        >
                          {member.tasks.length}/{member.capacity}
                        </span>
                      ),
                    },
                  ]}
                />
              </div>
            ))}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Recent Activity Log">
            <Table
              dataSource={activityLogs}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: "Message",
                  dataIndex: "message",
                  key: "message",
                },
                {
                  title: "Time",
                  dataIndex: "createdAt",
                  key: "createdAt",
                  render: (time: string) => new Date(time).toLocaleString(),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
