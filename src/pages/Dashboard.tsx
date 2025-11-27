/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";
import ActivityList from "../components/ActivityList";
import LayoutComponent from "../components/Layout";
import StatCard from "../components/StatCard";

const { Title } = Typography;

interface TeamSummary {
  memberName: string;
  currentTasks: number;
  capacity: number;
}

interface RecentTask {
  key: number;
  title: string;
  from: string;
  to: string;
  priority: string;
}

const Dashboard: React.FC = () => {
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [teamSummary, setTeamSummary] = useState<TeamSummary[]>([]);
  const [recentReassignments, setRecentReassignments] = useState<RecentTask[]>(
    []
  );
  const [activityLogs, setActivityLogs] = useState<
    { message: string; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const projectsRes = await axios.get("/projects");
        const tasksRes = await axios.get("/tasks");
        setTotalProjects(projectsRes.data.projects.length);
        setTotalTasks(tasksRes.data.tasks.length);

        // Example fetching first team members for summary (adjust per backend)
        const teamId = 1; // adjust dynamically or from user context
        const teamRes = await axios.get(`/teams/${teamId}/members`);
        setTeamSummary(
          teamRes.data.members.map((m: any) => ({
            memberName: m.user.name,
            currentTasks: m.tasks.length,
            capacity: m.capacity,
          }))
        );

        // Fetch recent activity logs
        const logsRes = await axios.get("/reassign/logs");
        setActivityLogs(logsRes.data.logs || []);

        // Recent Reassignments: filter from activity logs with parsing or keep separately
        const recentTasksData: RecentTask[] = logsRes.data.logs
          .slice(0, 5)
          .map((log: any, index: number) => {
            // Parsing the log message for display
            const regex = /Task "(.+)" reassigned from (.+) to (.+)/;
            const match = regex.exec(log.message);
            return match
              ? {
                  key: index,
                  title: match[1],
                  from: match[2],
                  to: match[3],
                  priority: "Low/Medium", // may fetch real priority if needed
                }
              : {
                  key: index,
                  title: "Unknown",
                  from: "Unknown",
                  to: "Unknown",
                  priority: "Unknown",
                };
          });
        setRecentReassignments(recentTasksData);
      } catch (error: any) {
        toast.error(`Failed to load dashboard data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const columns: ColumnsType<RecentTask> = [
    { title: "Task Title", dataIndex: "title", key: "title" },
    { title: "From", dataIndex: "from", key: "from" },
    { title: "To", dataIndex: "to", key: "to" },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        let color = "green";
        if (priority === "High") color = "red";
        else if (priority === "Medium") color = "orange";
        return <Tag color={color}>{priority}</Tag>;
      },
    },
  ];

  return (
    <LayoutComponent>
      <Title level={2}>Dashboard</Title>
      <Row gutter={16}>
        <Col>
          <StatCard
            title="Total Projects"
            value={totalProjects}
            loading={loading}
          />
        </Col>
        <Col>
          <StatCard title="Total Tasks" value={totalTasks} loading={loading} />
        </Col>
      </Row>
      <Title level={4} style={{ marginTop: 24 }}>
        Team Summary
      </Title>
      <Table
        dataSource={teamSummary.map((m, i) => ({
          key: i,
          memberName: m.memberName,
          currentTasksCapacity: `${m.currentTasks} / ${m.capacity}`,
          overloaded: m.currentTasks > m.capacity,
        }))}
        columns={[
          { title: "Member Name", dataIndex: "memberName", key: "memberName" },
          {
            title: "Tasks / Capacity",
            dataIndex: "currentTasksCapacity",
            key: "currentTasksCapacity",
            render: (_: any, record: any) => (
              <span style={{ color: record.overloaded ? "red" : "inherit" }}>
                {record.currentTasksCapacity}
              </span>
            ),
          },
        ]}
        pagination={false}
        loading={loading}
      />
      <Title level={4} style={{ marginTop: 24 }}>
        Recent Reassignments
      </Title>
      <Table
        columns={columns}
        dataSource={recentReassignments}
        pagination={false}
        loading={loading}
      />
      <ActivityList activities={activityLogs} loading={loading} />
    </LayoutComponent>
  );
};

export default Dashboard;
