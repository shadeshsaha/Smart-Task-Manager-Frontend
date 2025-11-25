/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Typography,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMember,
  addTeam,
  editMember,
  editTeam,
  fetchMembers,
  fetchTeams,
  removeMember,
  removeTeam,
} from "../../redux/slices/teamsSlice";
import type { RootState } from "../../redux/store";

import type { Member, Team } from "../../redux/slices/teamsSlice";

const { Title } = Typography;

const TeamsPage = () => {
  const dispatch = useDispatch<any>();

  const { teams, members, loading } = useSelector(
    (state: RootState) => state.teams
  );
  const token = useSelector((state: RootState) => state.auth.token);

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamForm] = Form.useForm();

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberForm] = Form.useForm();

  /** ---------------------------
   * Load Teams
   ---------------------------- */
  useEffect(() => {
    if (token) {
      dispatch(fetchTeams(token));
    }
  }, [token, dispatch]);

  /** ---------------------------
   * Load Members for selected team
   ---------------------------- */
  const loadMembers = useCallback(
    (id: number) => {
      if (!members[id]) {
        dispatch(fetchMembers({ teamId: id, token }));
      }
      setSelectedTeamId(id);
    },
    [dispatch, members, token]
  );

  /** ---------------------------
   * Team Table Columns
   ---------------------------- */
  const teamColumns = [
    {
      title: "Team Name",
      dataIndex: "name",
    },
    {
      title: "Actions",
      render: (team: Team) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingTeam(team);
              teamForm.setFieldsValue(team);
              setIsTeamModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => dispatch(removeTeam({ id: team.id, token }))}
          >
            Delete
          </Button>
          <Button type="dashed" onClick={() => loadMembers(team.id)}>
            Members
          </Button>
        </Space>
      ),
    },
  ];

  /** ---------------------------
   * Member Table Columns
   ---------------------------- */
  const memberColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Actions",
      render: (m: Member) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingMember(m);
              memberForm.setFieldsValue(m);
              setIsMemberModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() =>
              dispatch(
                removeMember({ id: m.id, teamId: selectedTeamId!, token })
              )
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  /** ---------------------------
   * Submit Team
   ---------------------------- */
  const handleTeamSubmit = (values: any) => {
    if (editingTeam) {
      dispatch(editTeam({ id: editingTeam.id, data: values, token }));
    } else {
      dispatch(addTeam({ data: values, token }));
    }
    setIsTeamModalOpen(false);
    teamForm.resetFields();
    setEditingTeam(null);
  };

  /** ---------------------------
   * Submit Member
   ---------------------------- */
  const handleMemberSubmit = (values: any) => {
    if (!selectedTeamId) return;

    if (editingMember) {
      dispatch(editMember({ id: editingMember.id, data: values, token }));
    } else {
      dispatch(addMember({ teamId: selectedTeamId, data: values, token }));
    }
    setIsMemberModalOpen(false);
    memberForm.resetFields();
    setEditingMember(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Teams</Title>

      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => {
          setEditingTeam(null);
          teamForm.resetFields();
          setIsTeamModalOpen(true);
        }}
      >
        Add Team
      </Button>

      <Table
        dataSource={teams}
        columns={teamColumns}
        loading={loading}
        rowKey="id"
        pagination={false}
      />

      {selectedTeamId && (
        <>
          <Divider />
          <Title level={4}>
            Members of{" "}
            {teams.find((t) => t.id === selectedTeamId)?.name || "Team"}
          </Title>

          <Button
            type="primary"
            onClick={() => {
              setEditingMember(null);
              memberForm.resetFields();
              setIsMemberModalOpen(true);
            }}
            style={{ marginBottom: 20 }}
          >
            Add Member
          </Button>

          <Table
            dataSource={members[selectedTeamId] || []}
            columns={memberColumns}
            rowKey="id"
          />
        </>
      )}

      {/* TEAM MODAL */}
      <Modal
        title={editingTeam ? "Edit Team" : "Add Team"}
        open={isTeamModalOpen}
        onCancel={() => setIsTeamModalOpen(false)}
        onOk={() => teamForm.submit()}
        okText="Save"
      >
        <Form layout="vertical" form={teamForm} onFinish={handleTeamSubmit}>
          <Form.Item
            name="name"
            label="Team Name"
            rules={[{ required: true, message: "Team name required" }]}
          >
            <Input placeholder="Enter team name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* MEMBER MODAL */}
      <Modal
        title={editingMember ? "Edit Member" : "Add Member"}
        open={isMemberModalOpen}
        onCancel={() => setIsMemberModalOpen(false)}
        onOk={() => memberForm.submit()}
        okText="Save"
      >
        <Form layout="vertical" form={memberForm} onFinish={handleMemberSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Member name required" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Input placeholder="Enter role" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamsPage;
