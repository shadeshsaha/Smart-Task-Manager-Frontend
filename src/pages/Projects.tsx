/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import LayoutComponent from "../components/Layout";
import {
  clearError,
  createProject,
  fetchProjects,
  fetchTeamsForProjects,
} from "../features/projects/projectsSlice";

const { Title } = Typography;
const { Option } = Select;

interface ProjectFormData {
  name: string;
  teamId: number;
}

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects, teams, loading, error } = useAppSelector(
    (state) => state.projects
  );
  const [form] = Form.useForm<ProjectFormData>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTeamsForProjects());
  }, [dispatch]);

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Team",
      dataIndex: ["team", "name"],
      key: "team",
      render: (teamName: string) => teamName || "No Team",
    },
    {
      title: "Tasks",
      dataIndex: "tasksCount",
      key: "tasksCount",
      width: 100,
      align: "center" as const,
      render: (count: number) => (
        <Tag color={count > 10 ? "volcano" : "green"}>{count || 0}</Tag>
      ),
    },
  ];

  const onFinish = (values: ProjectFormData) => {
    dispatch(createProject(values));
    setShowModal(false);
    form.resetFields();
  };

  return (
    <LayoutComponent>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2}>Projects</Title>
        <Button
          type="primary"
          onClick={() => setShowModal(true)}
          loading={loading}
        >
          New Project
        </Button>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          closable
          onClose={() => dispatch(clearError())}
          style={{ marginBottom: 16 }}
        />
      )}

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
          scroll={{ x: 800 }}
        />
      </Spin>

      <Modal
        title="Create New Project"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          name="project-form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Project Name"
            name="name"
            rules={[
              { required: true, message: "Please enter project name!" },
              { min: 3, message: "Name must be at least 3 characters!" },
            ]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          <Form.Item
            label="Team"
            name="teamId"
            rules={[{ required: true, message: "Please select a team!" }]}
          >
            <Select placeholder="Select a team" loading={loading}>
              {teams.map((team) => (
                <Option key={team.id} value={team.id}>
                  {team.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Create Project
              </Button>
              <Button onClick={() => setShowModal(false)} block>
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </LayoutComponent>
  );
};

export default Projects;
