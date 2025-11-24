/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as TeamsAPI from "../../api/teams";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Member");
  const [capacity, setCapacity] = useState(3);

  const load = async () => {
    if (!id) return;
    const r = await TeamsAPI.fetchTeam(Number(id));
    setTeam(r.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const addMember = async () => {
    try {
      await TeamsAPI.addTeamMember(Number(id), { name, role, capacity });
      toast.success("Member added");
      setName("");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Add failed");
    }
  };

  const removeMember = async (memberId: number) => {
    if (!window.confirm("Remove member?")) return;
    try {
      await TeamsAPI.deleteTeamMember(Number(id), memberId);
      toast.success("Removed");
      load();
    } catch {
      toast.error("Remove failed");
    }
  };

  if (!team) return <div>Loading...</div>;

  return (
    <div>
      <h2>{team.name}</h2>
      <Card>
        <CardHeader>
          <CardTitle>Add Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Member name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <input
              type="number"
              min={0}
              max={10}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
            <Button onClick={addMember}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <div style={{ marginTop: 12 }}>
        <h3>Members</h3>
        {team.members?.map((m: any) => (
          <Card key={m.id} style={{ marginBottom: 8 }}>
            <CardContent
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{m.name}</strong>
                <div style={{ fontSize: 12 }}>
                  Role: {m.role} — {m.currentTasks}/{m.capacity}
                </div>
              </div>
              <div>
                <Button
                  variant="destructive"
                  onClick={() => removeMember(m.id)}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
