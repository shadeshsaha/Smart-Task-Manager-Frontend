/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Button,
  message,
  Modal,
  Select,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import LayoutComponent from "../components/Layout";
import {
  clearError,
  fetchActivityLogs,
  reassignTasks,
  type ActivityLog,
} from "../features/reassign/reassignSlice";

const { Title } = Typography;
const { Option } = Select;

interface Team {
  id: number;
  name: string;
}

const Reassign: React.FC = () => {
  const dispatch = useAppDispatch();
  const { logs, loading, error } = useAppSelector((state) => state.reassign);

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reassigning, setReassigning] = useState(false);

  useEffect(() => {
    dispatch(fetchActivityLogs());
    fetchTeams();
  }, [dispatch]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get("/teams");
      setTeams(response.data.teams);
    } catch {
      message.error("Failed to load teams");
    }
  };

  const handleReassign = async () => {
    if (!selectedTeamId) return;

    setReassigning(true);
    try {
      await dispatch(reassignTasks(selectedTeamId)).unwrap();
      message.success("Tasks reassigned successfully!");
      dispatch(fetchActivityLogs()); // Refresh logs
      setShowConfirmModal(false);
      setSelectedTeamId(undefined);
    } catch (err: any) {
      message.error("Reassignment failed", err.message);
    } finally {
      setReassigning(false);
    }
  };

  const logColumns: ColumnsType<ActivityLog> = [
    {
      title: "Activity",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (message: string) => (
        <div style={{ maxWidth: 400 }}>
          <span>{message}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => {
        const d = new Date(date);
        return d.toLocaleString();
      },
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      render: () => <Tag color="success">Completed</Tag>,
    },
  ];

  return (
    <LayoutComponent>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2}>Task Reassignment</Title>
        <Button
          type="primary"
          size="large"
          onClick={() => setShowConfirmModal(true)}
          disabled={!selectedTeamId || loading}
          loading={reassigning}
        >
          Reassign All Tasks
        </Button>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          closable
          onClose={() => dispatch(clearError())}
          style={{ marginBottom: 24 }}
        />
      )}

      <div
        style={{
          background: "#f5f5f5",
          padding: 24,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <Title level={4}>Select Team for Reassignment</Title>
        <Select
          style={{ width: 300 }}
          placeholder="Choose a team to reassign tasks to"
          value={selectedTeamId}
          onChange={setSelectedTeamId}
          loading={loading}
          size="large"
        >
          {teams.map((team) => (
            <Option key={team.id} value={team.id}>
              {team.name}
            </Option>
          ))}
        </Select>
        <p style={{ marginTop: 8, color: "#666" }}>
          This will automatically reassign all overloaded tasks within the
          selected team based on member capacity.
        </p>
      </div>

      <Title level={3}>Recent Activity Logs</Title>
      <Spin spinning={loading}>
        <Table
          columns={logColumns}
          dataSource={logs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
          loading={loading}
        />
      </Spin>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Task Reassignment"
        open={showConfirmModal}
        onOk={handleReassign}
        onCancel={() => setShowConfirmModal(false)}
        okText="Reassign Tasks"
        okButtonProps={{ loading: reassigning }}
        cancelButtonProps={{ disabled: reassigning }}
        confirmLoading={reassigning}
      >
        <div style={{ marginBottom: 16 }}>
          <p>
            <strong>Team:</strong>{" "}
            {teams.find((t) => t.id === selectedTeamId)?.name}
          </p>
          <p>
            This action will automatically reassign tasks for team members who
            exceed their capacity limit.
          </p>
          <p style={{ color: "orange" }}>
            <strong>Warning:</strong> This is a bulk operation and cannot be
            undone.
          </p>
        </div>
      </Modal>
    </LayoutComponent>
  );
};

export default Reassign;
