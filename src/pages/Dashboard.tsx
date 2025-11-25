/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Spin, Table } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../redux/slices/dashboardSlice";
import type { RootState } from "../redux/store";

const Dashboard = () => {
  const dispatch = useDispatch<any>();
  const { totalProjects, totalTasks, teamSummary, logs, loading } = useSelector(
    (state: RootState) => state.dashboard
  );
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) dispatch(fetchDashboard(token));
  }, [token, dispatch]);

  const columns = [
    { title: "Member", dataIndex: "name", key: "name" },
    {
      title: "Tasks / Capacity",
      key: "tasksCapacity",
      render: (_: any, record: any) =>
        `${record.currentTasks} / ${record.capacity}`,
    },
  ];

  const logColumns = [
    { title: "Time", dataIndex: "createdAt", key: "createdAt" },
    { title: "Message", dataIndex: "message", key: "message" },
  ];

  if (loading) return <Spin style={{ marginTop: 50 }} />;

  return (
    <Row gutter={[16, 16]} style={{ padding: 20 }}>
      <Col span={6}>
        <Card title="Total Projects">{totalProjects}</Card>
      </Col>
      <Col span={6}>
        <Card title="Total Tasks">{totalTasks}</Card>
      </Col>
      <Col span={12}>
        <Card title="Team Summary">
          <Table
            columns={columns}
            dataSource={teamSummary}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Recent Reassignments">
          <Table
            columns={logColumns}
            dataSource={logs}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
