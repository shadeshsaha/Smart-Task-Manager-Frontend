import { Alert, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import LayoutComponent from "../components/Layout";
import {
  clearError,
  fetchActivityLogs,
  type ActivityLogEntry,
} from "../features/activityLog/activityLogSlice";

const { Title } = Typography;

const ActivityLog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { logs, loading, error } = useAppSelector((state) => state.activityLog);

  useEffect(() => {
    dispatch(fetchActivityLogs());
  }, [dispatch]);

  const columns: ColumnsType<ActivityLogEntry> = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 150,
      render: (user) => user || "System",
    },
    {
      title: "Action",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "actionType",
      key: "actionType",
      width: 120,
      render: (actionType) => actionType || "General",
    },
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date) => new Date(date).toLocaleString(),
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  return (
    <LayoutComponent>
      <Title level={2}>Activity Log</Title>
      {error && (
        <Alert
          type="error"
          message="Error"
          description={error}
          closable
          onClose={() => dispatch(clearError())}
          style={{ marginBottom: 16 }}
        />
      )}
      <Spin spinning={loading}>
        <Table<ActivityLogEntry>
          rowKey="id"
          columns={columns}
          dataSource={logs}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 800 }}
        />
      </Spin>
    </LayoutComponent>
  );
};

export default ActivityLog;
