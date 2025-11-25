/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, Modal, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addProject,
  editProject,
  fetchProjects,
  removeProject,
} from "../../redux/slices/projectsSlice";
import type { RootState } from "../../redux/store";

const Projects = () => {
  const dispatch = useDispatch<any>();
  const { projects, loading } = useSelector(
    (state: RootState) => state.projects
  );
  const token = useSelector((state: RootState) => state.auth.token) ?? "";

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (token) dispatch(fetchProjects(token));
  }, [token, dispatch]);

  const openModal = (project?: any) => {
    setEditingProject(project || null);
    form.setFieldsValue(project || { name: "" });
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editingProject) {
        await dispatch(
          editProject({ id: editingProject.id, data: values, token })
        );
        toast.success("Project updated");
      } else {
        await dispatch(addProject({ data: values, token }));
        toast.success("Project created");
      }
      setIsModalVisible(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    await dispatch(removeProject({ id, token }));
    toast.success("Project deleted");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  if (loading) return <Spin style={{ marginTop: 50 }} />;

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        Add Project
      </Button>
      <Table columns={columns} dataSource={projects} rowKey="id" />
      <Modal
        title={editingProject ? "Edit Project" : "Add Project"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: "Enter project name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Projects;
