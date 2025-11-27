import { List, Typography } from "antd";
import React from "react";

interface ActivityListProps {
  activities: { message: string; createdAt: string }[];
  loading?: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, loading }) => {
  return (
    <List
      header={<div>Recent Activity Log</div>}
      bordered
      loading={loading}
      dataSource={activities}
      renderItem={(item) => (
        <List.Item>
          <Typography.Text>{item.message}</Typography.Text>
          <Typography.Text type="secondary" style={{ marginLeft: "auto" }}>
            {new Date(item.createdAt).toLocaleString()}
          </Typography.Text>
        </List.Item>
      )}
      style={{ marginTop: 20 }}
    />
  );
};

export default ActivityList;
