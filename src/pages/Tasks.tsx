/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Table,
  Typography,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import LayoutComponent from "../components/Layout";
import {
  clearError,
  createTask,
  fetchTasks,
  type Task,
} from "../features/tasks/tasksSlice";

const { Title } = Typography;
const { Option } = Select;

interface Project {
  id: number;
  name: string;
}

interface Member {
  id: number;
  userId: number;
  user: { name: string };
}

const Tasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    priority: undefined as string | undefined,
    projectId: undefined as number | undefined,
    assignedToId: undefined as number | undefined,
  });

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    // fetch projects and members for filters and form selects
    async function fetchSupportingData() {
      try {
        const projectsRes = await axios.get("/projects");
        setProjects(projectsRes.data.projects);

        const membersRes = await axios.get("/teams/1/members"); // adjust team id as needed or fetch dynamically
        setMembers(membersRes.data.members);
      } catch {
        message.error("Failed to load supporting data");
      }
    }
    fetchSupportingData();
  }, []);

  const columns: ColumnsType<Task> = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    { title: "Priority", dataIndex: "priority", key: "priority" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Project",
      dataIndex: "projectId",
      key: "projectId",
      render: (projectId) => {
        const project = projects.find((p) => p.id === projectId);
        return project ? project.name : "Unknown";
      },
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToId",
      key: "assignedToId",
      render: (assignedToId) => {
        const member = members.find((m) => m.id === assignedToId);
        return member ? member.user.name : "Unassigned";
      },
    },
  ];

  // File upload handlers
  const beforeUpload = (file: RcFile) => {
    setFileList([file]);
    return false; // prevent auto upload
  };

  const onRemove = () => {
    setFileList([]);
  };

  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("priority", values.priority);
    formData.append("status", values.status);
    formData.append("projectId", values.projectId.toString());
    if (values.assignedToId) {
      formData.append("assignedToId", values.assignedToId.toString());
    }
    if (fileList.length > 0) {
      formData.append("file", fileList[0] as RcFile);
    }
    dispatch(createTask(formData)).then(() => {
      setShowModal(false);
      form.resetFields();
      setFileList([]);
    });
  };

  return (
    <LayoutComponent>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={2}>Tasks</Title>
        <Button type="primary" onClick={() => setShowModal(true)}>
          New Task
        </Button>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          closable
          onClose={() => dispatch(clearError())}
        />
      )}

      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        {/* Filters */}
        <Select
          style={{ width: 150 }}
          placeholder="Filter by Status"
          allowClear
          onChange={(value) => setFilters({ ...filters, status: value })}
          value={filters.status}
        >
          <Option value="Pending">Pending</Option>
          <Option value="InProgress">InProgress</Option>
          <Option value="Completed">Completed</Option>
        </Select>

        <Select
          style={{ width: 150 }}
          placeholder="Filter by Priority"
          allowClear
          onChange={(value) => setFilters({ ...filters, priority: value })}
          value={filters.priority}
        >
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>

        <Select
          style={{ width: 200 }}
          placeholder="Filter by Project"
          allowClear
          onChange={(value) => setFilters({ ...filters, projectId: value })}
          value={filters.projectId}
        >
          {projects.map((proj) => (
            <Option key={proj.id} value={proj.id}>
              {proj.name}
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: 200 }}
          placeholder="Filter by Assigned To"
          allowClear
          onChange={(value) => setFilters({ ...filters, assignedToId: value })}
          value={filters.assignedToId}
        >
          {members.map((member) => (
            <Option key={member.id} value={member.id}>
              {member.user.name}
            </Option>
          ))}
        </Select>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Spin>

      {/* Create Task Modal */}
      <Modal
        title="Create New Task"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          name="task-form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter task title" }]}
          >
            <Input placeholder="Task title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter task description" },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Task description" />
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please select priority" }]}
          >
            <Select placeholder="Select priority">
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="Pending">Pending</Option>
              <Option value="InProgress">InProgress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Project"
            name="projectId"
            rules={[{ required: true, message: "Please select project" }]}
          >
            <Select placeholder="Select project" loading={loading}>
              {projects.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Assign To" name="assignedToId">
            <Select
              placeholder="Select member (optional)"
              allowClear
              loading={loading}
            >
              {members.map((m) => (
                <Option key={m.id} value={m.id}>
                  {m.user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Attachment"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={() => fileList}
          >
            <Upload
              beforeUpload={beforeUpload}
              onRemove={onRemove}
              fileList={fileList}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </LayoutComponent>
  );
};

export default Tasks;
