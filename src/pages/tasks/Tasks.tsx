/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Popconfirm, Select, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import {
  autoAssignTask,
  deleteTask, // removeTask
  fetchTasks,
} from "../../redux/slices/tasksSlice";
import type { RootState } from "../../redux/store";
import CreateTaskModal from "./CreateTaskModal";

const { Option } = Select;

const Tasks: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { projects } = useSelector(
    (state: RootState) => state.projects || { projects: [] }
  );
  // const token = useSelector((state: RootState) => state.auth.token);
  const token = localStorage.getItem("token");

  // const [filters, setFilters] = useState({
  //   projectId: undefined,
  //   memberId: undefined,
  // });
  const [filters, setFilters] = useState<{
    projectId?: number;
    status?: string;
    priority?: string;
  }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchProjects(token));
      dispatch(fetchTasks());
    }
  }, [token, dispatch]);

  // const handleFilterChange = (key: string, value: any) => {
  //   setFilters((prev) => ({ ...prev, [key]: value }));
  //   dispatch(fetchTasks({ token, ...filters, [key]: value }));
  // };
  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);
    dispatch(fetchTasks(newFilters));
  };

  // const handleDelete = async (id: number) => {
  //   await dispatch(deleteTask({ id, token }));
  //   toast.success("Task deleted");
  // };
  const onDelete = async (id: number) => {
    await dispatch(deleteTask(id));
    toast.success("Task deleted");
  };

  // const handleAutoAssign = async (task: any) => {
  //   await dispatch(
  //     autoAssignTask({ taskId: task.id, projectId: task.projectId, token })
  //   );
  //   toast.success("Task auto-assigned");
  // };
  const onAutoAssign = async (task: any) => {
    try {
      await dispatch(
        autoAssignTask({ projectId: task.projectId, taskId: task.id })
      );
      toast.success("Auto-assign successful");
      dispatch(fetchTasks(filters));
    } catch (err: any) {
      toast.error(err.message || "Auto-assign failed");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Priority", dataIndex: "priority", key: "priority" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      // render: (member: any) =>
      //   member
      //     ? `${member.name} (${member.tasks.length}/${member.capacity})`
      //     : "Unassigned",
      render: (member: any) =>
        member
          ? `${member.name} (${member.tasks?.length ?? 0}/${member.capacity})`
          : "Unassigned",
    },
    {
      title: "Attachment",
      dataIndex: "attachment",
      key: "attachment",
      // render: (file: string) =>
      //   file ? (
      //     <a
      //       href={`http://localhost:5000/uploads/${file}`}
      //       target="_blank"
      //       rel="noreferrer"
      //     >
      //       Download
      //     </a>
      //   ) : (
      //     "-"
      //   ),
      render: (file: string | null) =>
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

          {/* <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button> */}
          <Popconfirm
            title="Delete task?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>

          {/* <Button type="primary" onClick={() => handleAutoAssign(record)}>
            Auto-Assign
          </Button> */}
          <Button onClick={() => onAutoAssign(record)}>Auto-assign</Button>
        </Space>
      ),
    },
  ];

  if (loading) return <Spin style={{ marginTop: 40 }} />;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by Project"
          allowClear
          style={{ width: 200 }}
          // onChange={(val) => handleFilterChange("projectId", val)}
          onChange={(val) => applyFilters({ ...filters, projectId: val })}
        >
          {projects.map((p: any) => (
            <Select.Option key={p.id} value={p.id}>
              {p.name}
            </Select.Option>
          ))}
        </Select>
      </Space>

      <Select
        allowClear
        placeholder="Filter by Status"
        style={{ width: 180 }}
        onChange={(v) => applyFilters({ ...filters, status: v })}
      >
        <Option value="Pending">Pending</Option>
        <Option value="In Progress">In Progress</Option>
        <Option value="Done">Done</Option>
      </Select>

      <Select
        allowClear
        placeholder="Filter by Priority"
        style={{ width: 150 }}
        onChange={(v) => applyFilters({ ...filters, priority: v })}
      >
        <Option value="Low">Low</Option>
        <Option value="Medium">Medium</Option>
        <Option value="High">High</Option>
      </Select>

      {/* <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalVisible(true)}
      >
        Add Task
      </Button> */}
      <Button
        type="primary"
        onClick={() => {
          setEditingTask(null);
          setIsModalVisible(true);
        }}
      >
        Create Task
      </Button>

      <Table columns={columns} dataSource={tasks} rowKey="id" />

      {isModalVisible && (
        <CreateTaskModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setEditingTask(null);
            dispatch(fetchTasks(filters));
          }}
          editingTask={editingTask}
        />
      )}
    </div>
  );
};

export default Tasks;
