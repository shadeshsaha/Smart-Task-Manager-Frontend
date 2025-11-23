/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchProjects } from "../../features/projects/projectActions";
import {
  autoAssignTask,
  deleteTask,
  fetchTasks,
} from "../../features/tasks/taskActions";
import { fetchTeams } from "../../features/teams/teamActions";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";

import { DataTable } from "../../components/table/DataTable";
import TaskColumns from "./TaskColumns";
import TaskEditModal from "./TaskEditModal";
import TaskFilters from "./TaskFilters";

import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function TaskList() {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector((s) => s.tasks.tasks);
  const projects = useAppSelector((s) => s.projects.projects);
  const teams = useAppSelector((s) => s.teams.teams);

  const [selectedProject, setSelectedProject] = useState<number | "">("");
  const [selectedMember, setSelectedMember] = useState<number | "">("");

  const [editTask, setEditTask] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
    dispatch(fetchTeams());
  }, [dispatch]);

  /** FILTERED LIST */
  const filteredTasks = tasks.filter((task) => {
    const projectMatch = selectedProject
      ? task.projectId === selectedProject
      : true;
    const memberMatch = selectedMember
      ? task.assignedToId === selectedMember
      : true;
    return projectMatch && memberMatch;
  });

  /** DELETE */
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteTask(id));
      toast.success("Task deleted");
      dispatch(fetchTasks());
    } catch {
      toast.error("Delete failed");
    }
  };

  /** AUTO ASSIGN */
  const handleAutoAssign = async (task: any) => {
    try {
      await dispatch(
        autoAssignTask({
          projectId: task.projectId,
          taskId: task.id,
        })
      );
      toast.success("Auto-assigned successfully");

      dispatch(fetchTasks());
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Auto-assign failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      <TaskFilters
        projects={projects}
        teams={teams}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
      />

      <div className="my-4">
        <Button
          variant="secondary"
          onClick={() => {
            dispatch(fetchTasks());
            toast.success("Refreshed");
          }}
        >
          Refresh
        </Button>
      </div>

      <DataTable
        columns={TaskColumns({
          onEdit: (task) => setEditTask(task),
          onDelete: handleDelete,
          onAutoAssign: handleAutoAssign,
          teams,
        })}
        data={filteredTasks}
      />

      {editTask && (
        <TaskEditModal
          task={editTask}
          teams={teams}
          onClose={() => setEditTask(null)}
        />
      )}
    </div>
  );
}
