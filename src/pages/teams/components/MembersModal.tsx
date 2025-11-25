/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMember, deleteMember, updateMember } from "../../../api/teams";
import { fetchMembers } from "../../../redux/slices/teamsSlice";

const MembersModal = ({ team, onClose }: any) => {
  const dispatch = useDispatch<any>();
  const members = useSelector(
    (state: any) => state.teams.membersByTeam[team.id] || []
  );
  const token = useSelector((state: any) => state.auth.token);

  const [form] = Form.useForm();
  const [openForm, setOpenForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchMembers(team.id));
  }, []);

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      if (editingMember) {
        await updateMember(editingMember.id, values, token);
      } else {
        await createMember(team.id, values, token);
      }

      dispatch(fetchMembers(team.id));
      setOpenForm(false);
      form.resetFields();
      setEditingMember(null);
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Capacity",
      dataIndex: "capacity",
      render: (val: number) => `${val} tasks`,
    },
    {
      title: "Actions",
      render: (member: any) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingMember(member);
              form.setFieldsValue(member);
              setOpenForm(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete member?"
            onConfirm={async () => {
              await deleteMember(member.id, token);
              dispatch(fetchMembers(team.id));
            }}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Modal
      title={`Members — ${team.name}`}
      open={true}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Button type="primary" onClick={() => setOpenForm(true)}>
        + Add Member
      </Button>

      <Table
        dataSource={members}
        columns={columns}
        style={{ marginTop: 20 }}
        rowKey="id"
      />

      <Modal
        title={editingMember ? "Edit Member" : "Add Member"}
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
          form.resetFields();
          setEditingMember(null);
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacity (0–5)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={5} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
};

export default MembersModal;
