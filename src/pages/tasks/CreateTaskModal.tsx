/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import {
  createTask,
  fetchTasks,
  updateTask,
} from "../../redux/slices/tasksSlice";
import type { RootState } from "../../redux/store";

interface Props {
  visible: boolean;
  onClose: () => void;
  editingTask?: any;
}

const CreateTaskModal: React.FC<Props> = ({
  visible,
  onClose,
  editingTask,
}) => {
  const dispatch = useDispatch<any>();
  const token = useSelector((state: RootState) => state.auth.token);
  const { projects } = useSelector((state: RootState) => state.projects);

  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [warning, setWarning] = useState<string | null>(null);

  // Memoized function to load members of a project
  const loadTeamMembers = useCallback(
    async (projectId: number) => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeamMembers(res.data.team.members);
      } catch (err: any) {
        message.error("Failed to load team members");
      }
    },
    [token]
  );

  //   useEffect(() => {
  //     if (token) {
  //         dispatch(fetchProjects(token));
  //     }

  //     if (editingTask) {
  //       form.setFieldsValue(editingTask);

  //       if (editingTask.projectId){
  //         loadTeamMembers(editingTask.projectId);
  //       }
  //     } else {
  //       form.resetFields();
  //     }
  //   }, [editingTask, token]);

  // Effect to initialize form and load project members
  useEffect(() => {
    if (!token) return;

    dispatch(fetchProjects(token));

    if (editingTask) {
      form.setFieldsValue(editingTask);

      if (editingTask.projectId) {
        //   const fetchMembers = async () => {
        //     await loadTeamMembers(editingTask.projectId);
        //   };
        //   fetchMembers();
        (async () => {
          await loadTeamMembers(editingTask.projectId);
        })();
      }
    } else {
      Promise.resolve().then(() => {
        form.resetFields();
        setTeamMembers([]);
        setWarning(null);
        setSelectedFile(null);
      });
    }
  }, [editingTask, token, dispatch, form, loadTeamMembers]);

  const handleProjectChange = (projectId: number) => {
    form.setFieldsValue({ assignedToId: undefined });
    setWarning(null);
    loadTeamMembers(projectId);
  };

  const handleMemberChange = (memberId: number) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member && member.tasks.length >= member.capacity) {
      setWarning(
        `${member.name} has ${member.tasks.length} tasks but capacity is ${member.capacity}. Assign anyway?`
      );
    } else {
      setWarning(null);
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key] !== undefined && values[key] !== null)
        formData.append(key, values[key]);
    });
    if (selectedFile) formData.append("attachment", selectedFile);

    try {
      if (editingTask) {
        await dispatch(
          updateTask({ id: editingTask.id, data: formData, token })
        );
        toast.success("Task updated");
      } else {
        await dispatch(createTask({ data: formData, token }));
        toast.success("Task created");
      }

      dispatch(fetchTasks({ token }));
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Modal
      visible={visible}
      title={editingTask ? "Edit Task" : "Create Task"}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Enter title" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="Low">Low</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="High">High</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="In Progress">In Progress</Select.Option>
            <Select.Option value="Done">Done</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="projectId"
          label="Project"
          rules={[{ required: true }]}
        >
          <Select onChange={handleProjectChange}>
            {projects.map((p: any) => (
              <Select.Option key={p.id} value={p.id}>
                {p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {teamMembers.length > 0 && (
          <Form.Item name="assignedToId" label="Assign To">
            <Select
              placeholder="Select Member"
              onChange={handleMemberChange}
              allowClear
            >
              {teamMembers.map((member) => (
                <Select.Option key={member.id} value={member.id}>
                  {member.name} ({member.tasks.length}/{member.capacity})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {warning && <p style={{ color: "red" }}>{warning}</p>}

        <Form.Item label="Attachment">
          <Upload
            beforeUpload={(file) => {
              setSelectedFile(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
