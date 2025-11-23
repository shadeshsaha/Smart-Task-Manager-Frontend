/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { toast } from "react-toastify";
import { createTask } from "../../features/tasks/taskActions";
import { useAppDispatch } from "../../utils/hooks";

export default function TaskCreate() {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Pending");
  const [projectId, setProjectId] = useState(1);
  const [assignedToId, setAssignedToId] = useState(1);
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("status", status);
      formData.append("projectId", projectId.toString());
      formData.append("assignedToId", assignedToId.toString());
      if (attachment) formData.append("attachment", attachment);

      await dispatch(createTask(formData));
      toast.success("Task created");
    } catch (err) {
      toast.error("Create task failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <input
        type="number"
        value={projectId}
        onChange={(e) => setProjectId(Number(e.target.value))}
      />
      <input
        type="number"
        value={assignedToId}
        onChange={(e) => setAssignedToId(Number(e.target.value))}
      />
      <input
        type="file"
        onChange={(e) =>
          setAttachment(e.target.files ? e.target.files[0] : null)
        }
      />
      <button type="submit">Create Task</button>
    </form>
  );
}
