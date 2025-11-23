import API from "../../api/axios";
import type { AppDispatch } from "../../utils/store";
import { setTasks } from "./tasksSlice";

export const fetchTasks = () => async (dispatch: AppDispatch) => {
  const { data } = await API.get("/tasks");
  dispatch(setTasks(data.tasks));
};

export const createTask = (formData: FormData) => async () => {
  await API.post("/tasks", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const autoAssignTask =
  (payload: { projectId: number; taskId: number }) => async () => {
    await API.post("/tasks/auto-assign", payload);
  };
