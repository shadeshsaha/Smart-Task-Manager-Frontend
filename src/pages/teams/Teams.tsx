/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as TeamsAPI from "../../api/teams";

export default function Teams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [name, setName] = useState("");
  const nav = useNavigate();

  const load = async () => {
    const r = await TeamsAPI.fetchTeams();
    setTeams(r.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    try {
      await TeamsAPI.createTeam({ name });
      toast.success("Team created");
      setName("");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Create failed");
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete team?")) return;
    try {
      await TeamsAPI.deleteTeam(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <h2>Teams</h2>
      <Card>
        <CardHeader>
          <CardTitle>Create Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button onClick={create}>Create</Button>
          </div>
        </CardContent>
      </Card>

      <div style={{ marginTop: 12 }}>
        {teams.map((t) => (
          <Card key={t.id} style={{ marginBottom: 8 }}>
            <CardContent
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{t.name}</strong>
                <div style={{ fontSize: 12 }}>
                  {t.members?.length ?? 0} members
                </div>
              </div>
              <div>
                <Button onClick={() => nav(`/teams/${t.id}`)}>Open</Button>
                <Button
                  variant="destructive"
                  onClick={() => remove(t.id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
