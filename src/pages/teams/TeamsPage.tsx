/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createTeam,
  deleteTeam,
  fetchTeams,
  updateTeam,
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

export default function TeamsPage() {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teams.teams);

  const [teamName, setTeamName] = useState("");
  const [editTeamId, setEditTeamId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleCreate = async () => {
    try {
      await dispatch(createTeam({ name: teamName }));
      toast.success("Team created");
      setTeamName("");
      dispatch(fetchTeams());
    } catch {
      toast.error("Error creating team");
    }
  };

  const handleEdit = async () => {
    if (!editTeamId) return;

    try {
      await dispatch(updateTeam(editTeamId, { name: teamName }));
      toast.success("Team updated");
      setEditTeamId(null);
      setTeamName("");
      dispatch(fetchTeams());
    } catch {
      toast.error("Error updating team");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteTeam(id));
      toast.success("Team deleted");
      dispatch(fetchTeams());
    } catch {
      toast.error("Failed to delete team");
    }
  };

  const openEdit = (team: any) => {
    setEditTeamId(team.id);
    setTeamName(team.name);
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Teams</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Create Team */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">Create Team</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Team</DialogTitle>
              </DialogHeader>

              <Input
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />

              <Button className="mt-2" onClick={handleCreate}>
                Save
              </Button>
            </DialogContent>
          </Dialog>

          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Team Name</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {teams.map((team: any) => (
                <tr key={team.id} className="border-t">
                  <td className="p-2">{team.id}</td>
                  <td className="p-2">{team.name}</td>
                  <td className="p-2 flex gap-2">
                    {/* Edit */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => openEdit(team)}>
                          Edit
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Team</DialogTitle>
                        </DialogHeader>

                        <Input
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                        />

                        <Button className="mt-2" onClick={handleEdit}>
                          Update
                        </Button>
                      </DialogContent>
                    </Dialog>

                    {/* Delete */}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(team.id)}
                    >
                      Delete
                    </Button>

                    {/* Manage Members */}
                    <Button
                      size="sm"
                      onClick={() =>
                        (window.location.href = `/teams/${team.id}/members`)
                      }
                    >
                      Members
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
