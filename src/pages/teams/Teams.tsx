/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, Modal, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addTeam,
  editTeam,
  fetchMembers,
  fetchTeams,
  removeTeam,
} from "../../redux/slices/teamsSlice";
import type { RootState } from "../../redux/store";
import Members from "./Members";

const Teams = () => {
  const dispatch = useDispatch<any>();
  const { teams, loading } =
    useSelector((state: RootState) => state.teams) ?? "";
  const token = useSelector((state: RootState) => state.auth.token);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [form] = Form.useForm();

  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchTeams(token));
    }
  }, [token, dispatch]);

  const openModal = (team?: any) => {
    setEditingTeam(team || null);
    form.setFieldsValue(team || { name: "" });
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!token) return;
    const values = await form.validateFields();
    try {
      if (editingTeam) {
        await dispatch(editTeam({ id: editingTeam.id, data: values, token }));
        toast.success("Team updated");
      } else {
        await dispatch(addTeam({ data: values, token }));
        toast.success("Team created");
      }
      setIsModalVisible(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    await dispatch(removeTeam({ id, token }));
    toast.success("Team deleted");
  };

  const viewMembers = (teamId: number) => {
    if (!token) return;
    setSelectedTeam(teamId);
    dispatch(fetchMembers({ teamId, token }));
  };

  const columns = [
    { title: "Team Name", dataIndex: "name", key: "name" },
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
          <Button type="link" onClick={() => viewMembers(record.id)}>
            Members
          </Button>
        </>
      ),
    },
  ];

  if (loading) return <Spin style={{ marginTop: 50 }} />;

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        Add Team
      </Button>
      <Table columns={columns} dataSource={teams} rowKey="id" />

      <Modal
        title={editingTeam ? "Edit Team" : "Add Team"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Team Name"
            rules={[{ required: true, message: "Enter team name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {selectedTeam && <Members teamId={selectedTeam} />}
    </div>
  );
};

export default Teams;
