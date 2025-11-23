/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { toast } from "react-toastify";
import { DataTable } from "../../components/table/DataTable";
import {
  deleteProject,
  fetchProjects,
} from "../../features/projects/projectActions";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";

export default function ProjectList() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteProject(id));
      toast.success("Project deleted");
      dispatch(fetchProjects());
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <DataTable
        columns={["ID", "Name", "Actions"]}
        data={projects.map((p) => [
          p.id,
          p.name,
          <button onClick={() => handleDelete(p.id)}>Delete</button>,
        ])}
      />
    </div>
  );
}
