/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createMember,
  deleteMember,
  fetchMembers,
  updateMember,
} from "../../features/teams/teamActions";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeamMembersPage() {
  const { teamId } = useParams();
  const dispatch = useAppDispatch();

  const members = useAppSelector((state) => state.teams.members);

  const [name, setName] = useState("");
  const [role, setRole] = useState("Developer");
  const [capacity, setCapacity] = useState("3");
  const [editMemberId, setEditMemberId] = useState<number | null>(null);

  useEffect(() => {
    if (teamId) dispatch(fetchMembers(Number(teamId)));
  }, [dispatch, teamId]);

  const handleCreate = async () => {
    try {
      await dispatch(
        createMember(Number(teamId), {
          name,
          role,
          capacity: Number(capacity),
        })
      );

      toast.success("Member added");
      dispatch(fetchMembers(Number(teamId)));

      setName("");
      setRole("Developer");
      setCapacity("3");
    } catch {
      toast.error("Failed to add member");
    }
  };

  const handleEdit = async () => {
    if (!editMemberId) return;

    try {
      await dispatch(
        updateMember(Number(teamId), editMemberId, {
          name,
          role,
          capacity: Number(capacity),
        })
      );

      toast.success("Updated successfully");
      setEditMemberId(null);
      dispatch(fetchMembers(Number(teamId)));
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteMember(Number(teamId), id));
      toast.success("Deleted member");
      dispatch(fetchMembers(Number(teamId)));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const openEdit = (member: any) => {
    setEditMemberId(member.id);
    setName(member.name);
    setRole(member.role);
    setCapacity(member.capacity.toString());
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Add Member */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">Add Member</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
              </DialogHeader>

              <Input
                placeholder="Member Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-2"
              />

              <Select value={role} onValueChange={(v) => setRole(v)}>
                <SelectTrigger className="w-full mb-2">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Tester">Tester</SelectItem>
                </SelectContent>
              </Select>

              <Select value={capacity} onValueChange={(v) => setCapacity(v)}>
                <SelectTrigger className="w-full mb-2">
                  <SelectValue placeholder="Capacity (0–5)" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map((cap) => (
                    <SelectItem key={cap} value={cap.toString()}>
                      {cap}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleCreate}>Save</Button>
            </DialogContent>
          </Dialog>

          {/* Members Table */}
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Capacity</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member: any) => (
                <tr key={member.id} className="border-t">
                  <td className="p-2">{member.name}</td>
                  <td className="p-2">{member.role}</td>
                  <td className="p-2">{member.capacity}</td>

                  <td className="p-2 flex gap-2">
                    {/* Edit */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => openEdit(member)}>
                          Edit
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Member</DialogTitle>
                        </DialogHeader>

                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mb-2"
                        />

                        <Select value={role} onValueChange={(v) => setRole(v)}>
                          <SelectTrigger className="w-full mb-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Developer">Developer</SelectItem>
                            <SelectItem value="Designer">Designer</SelectItem>
                            <SelectItem value="Tester">Tester</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={capacity}
                          onValueChange={(v) => setCapacity(v)}
                        >
                          <SelectTrigger className="w-full mb-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((cap) => (
                              <SelectItem key={cap} value={cap.toString()}>
                                {cap}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button onClick={handleEdit}>Update</Button>
                      </DialogContent>
                    </Dialog>

                    {/* Delete */}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
