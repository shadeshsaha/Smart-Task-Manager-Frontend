/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import API from "../../api/axios";

export default function ReassignTasks() {
  const handleReassign = async (teamId: number) => {
    try {
      const { data } = await API.post("/reassign", { teamId });
      toast.success("Reassignment done");
      console.log(data.logs);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Reassign failed");
    }
  };

  return (
    <div>
      <h2>Reassign Tasks</h2>
      <button onClick={() => handleReassign(1)}>Reassign Team 1</button>
    </div>
  );
}
