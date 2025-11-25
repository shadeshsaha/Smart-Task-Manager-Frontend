/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Select, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import {
  autoAssignTask,
  deleteTask,
  fetchTasks,
} from "../../redux/slices/tasksSlice";
import type { RootState } from "../../redux/store";
import CreateTaskModal from "./CreateTaskModal";

const Tasks = () => {
  const dispatch = useDispatch<any>();
  const { tasks, loading } =
    useSelector((state: RootState) => state.tasks) ?? "";
  const { projects } = useSelector((state: RootState) => state.projects);
  const token = useSelector((state: RootState) => state.auth.token);

  const [filters, setFilters] = useState({
    projectId: undefined,
    memberId: undefined,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchProjects(token));
      dispatch(fetchTasks({ token }));
    }
  }, [token, dispatch]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    dispatch(fetchTasks({ token, ...filters, [key]: value }));
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteTask({ id, token }));
    toast.success("Task deleted");
  };

  const handleAutoAssign = async (task: any) => {
    await dispatch(
      autoAssignTask({ taskId: task.id, projectId: task.projectId, token })
    );
    toast.success("Task auto-assigned");
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Priority", dataIndex: "priority", key: "priority" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (member: any) =>
        member
          ? `${member.name} (${member.tasks.length}/${member.capacity})`
          : "Unassigned",
    },
    {
      title: "Attachment",
      dataIndex: "attachment",
      key: "attachment",
      render: (file: string) =>
        file ? (
          <a
            href={`http://localhost:5000/uploads/${file}`}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            onClick={() => {
              setEditingTask(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
          <Button type="primary" onClick={() => handleAutoAssign(record)}>
            Auto-Assign
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <Spin style={{ marginTop: 50 }} />;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by Project"
          allowClear
          onChange={(val) => handleFilterChange("projectId", val)}
        >
          {projects.map((p: any) => (
            <Select.Option key={p.id} value={p.id}>
              {p.name}
            </Select.Option>
          ))}
        </Select>
      </Space>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalVisible(true)}
      >
        Add Task
      </Button>
      <Table columns={columns} dataSource={tasks} rowKey="id" />

      {isModalVisible && (
        <CreateTaskModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setEditingTask(null);
          }}
          editingTask={editingTask}
        />
      )}
    </div>
  );
};

export default Tasks;
