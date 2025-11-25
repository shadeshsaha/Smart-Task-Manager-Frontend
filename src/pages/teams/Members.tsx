/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, InputNumber, Modal, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addMember,
  editMember,
  fetchMembers,
  removeMember,
} from "../../redux/slices/teamsSlice";
import type { RootState } from "../../redux/store";

interface MembersProps {
  teamId: number;
}

const Members: React.FC<MembersProps> = ({ teamId }) => {
  const dispatch = useDispatch<any>();
  const token = useSelector((state: RootState) => state.auth.token);
  const members = useSelector(
    (state: RootState) => state.teams.members[teamId] || []
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (token) dispatch(fetchMembers({ teamId, token }));
  }, [teamId, token, dispatch]);

  const openModal = (member?: any) => {
    setEditingMember(member || null);
    form.setFieldsValue(member || { name: "", role: "USER", capacity: 1 });
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!token) return;
    const values = await form.validateFields();
    try {
      if (editingMember) {
        await dispatch(
          editMember({ id: editingMember.id, data: values, token })
        );
        toast.success("Member updated");
      } else {
        await dispatch(addMember({ teamId, data: values, token }));
        toast.success("Member added");
      }
      setIsModalVisible(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    await dispatch(removeMember({ id, teamId, token }));
    toast.success("Member deleted");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Capacity", dataIndex: "capacity", key: "capacity" },
    {
      title: "Current Tasks",
      dataIndex: "tasks",
      key: "tasks",
      render: (tasks: any[]) => tasks.length,
    },
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

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Team Members</h3>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        Add Member
      </Button>
      <Table columns={columns} dataSource={members} rowKey="id" />

      <Modal
        title={editingMember ? "Edit Member" : "Add Member"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Enter member name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="USER">USER</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Members;
