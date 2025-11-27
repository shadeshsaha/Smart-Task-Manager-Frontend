/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import LayoutComponent from "../components/Layout";
import {
  addTeam,
  addTeamMember,
  clearError,
  fetchTeamMembers,
  fetchTeams,
} from "../features/teams/teamsSlice";

const { Title } = Typography;

type Team = {
  id: number;
  name: string;
};

const Teams: React.FC = () => {
  const dispatch = useAppDispatch();
  const { teams, members, loading, error } = useAppSelector(
    (state: any) => state.teams
  );

  // Type cast teams if possible
  const typedTeams = teams as Team[];

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTeamId !== null) {
      dispatch(fetchTeamMembers(selectedTeamId));
    }
  }, [selectedTeamId, dispatch]);

  // Team columns
  const teamColumns = [
    {
      title: "Team ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Team Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  // Team members columns
  const memberColumns = [
    {
      title: "Member Name",
      dataIndex: ["user", "name"],
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Current Tasks",
      dataIndex: "tasks",
      key: "tasks",
      render: (tasks: any[]) => tasks.length,
    },
  ];

  const [form] = Form.useForm();
  const [memberForm] = Form.useForm();

  const onAddTeam = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(addTeam(values.name));
        setShowAddTeamModal(false);
        form.resetFields();
      })
      .catch(() => {});
  };

  const onAddMember = () => {
    memberForm
      .validateFields()
      .then((values) => {
        if (selectedTeamId === null) return;
        dispatch(
          addTeamMember({
            teamId: selectedTeamId,
            userId: Number(values.userId),
            role: values.role,
            capacity: values.capacity,
          })
        );
        setShowAddMemberModal(false);
        memberForm.resetFields();
      })
      .catch(() => {});
  };

  return (
    <LayoutComponent>
      <Title level={2}>Teams</Title>
      {error && (
        <Alert
          type="error"
          message={error}
          closable
          onClose={() => dispatch(clearError())}
        />
      )}
      <Button
        type="primary"
        onClick={() => setShowAddTeamModal(true)}
        style={{ marginBottom: 16 }}
      >
        Add Team
      </Button>
      <Table
        rowKey="id"
        columns={teamColumns}
        // dataSource={teams}
        dataSource={typedTeams}
        loading={loading}
        pagination={false}
        onRow={(record: Team) => ({
          onClick: () => setSelectedTeamId(record.id),
        })}
        rowClassName={(record: Team) =>
          record.id === selectedTeamId ? "ant-table-row-selected" : ""
        }
      />
      {selectedTeamId && (
        <>
          <Title level={3} style={{ marginTop: 24 }}>
            Team Members
          </Title>
          <Button
            type="dashed"
            onClick={() => setShowAddMemberModal(true)}
            style={{ marginBottom: 16 }}
          >
            Add Member
          </Button>
          <Table
            rowKey="id"
            columns={memberColumns}
            dataSource={members}
            loading={loading}
            pagination={false}
          />
        </>
      )}

      {/* Add Team Modal */}
      <Modal
        title="Add Team"
        open={showAddTeamModal}
        onOk={onAddTeam}
        onCancel={() => setShowAddTeamModal(false)}
        okText="Add"
      >
        <Form form={form} layout="vertical" name="add-team-form">
          <Form.Item
            label="Team Name"
            name="name"
            rules={[{ required: true, message: "Please enter team name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        title="Add Team Member"
        open={showAddMemberModal}
        onOk={onAddMember}
        onCancel={() => setShowAddMemberModal(false)}
        okText="Add"
      >
        <Form form={memberForm} layout="vertical" name="add-member-form">
          <Form.Item
            label="User ID"
            name="userId"
            rules={[
              { required: true, message: "Please enter user ID" },
              {
                type: "number",
                min: 1,
                message: "User ID must be a positive number",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please enter role" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[
              { required: true, message: "Please enter capacity" },
              {
                type: "number",
                min: 0,
                max: 5,
                message: "Capacity must be between 0 and 5",
              },
            ]}
          >
            <InputNumber min={0} max={5} />
          </Form.Item>
        </Form>
      </Modal>
    </LayoutComponent>
  );
};

export default Teams;
