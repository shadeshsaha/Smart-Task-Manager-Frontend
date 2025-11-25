/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import { createTask, updateTask } from "../../redux/slices/tasksSlice";
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

  useEffect(() => {
    if (token) dispatch(fetchProjects(token));
    if (editingTask) form.setFieldsValue(editingTask);
    else form.resetFields();
  }, [editingTask, token, dispatch, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editingTask)
        await dispatch(updateTask({ id: editingTask.id, data: values, token }));
      else await dispatch(createTask({ data: values, token }));
      toast.success(editingTask ? "Task updated" : "Task created");
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
          <Select>
            {projects.map((p: any) => (
              <Select.Option key={p.id} value={p.id}>
                {p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {/* Assigned member selection will go here if needed */}
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
