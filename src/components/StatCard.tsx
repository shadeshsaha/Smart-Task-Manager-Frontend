import { Card, Statistic } from "antd";
import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  loading?: boolean;
  status?: "success" | "warning" | "error" | "processing" | "default";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  loading,
  status,
}) => {
  return (
    <Card style={{ width: 220, margin: "8px" }} loading={loading}>
      <Statistic
        title={title}
        value={value}
        valueStyle={{ color: status === "error" ? "red" : undefined }}
      />
    </Card>
  );
};

export default StatCard;
