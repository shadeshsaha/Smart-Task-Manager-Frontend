import API from "../../api/axios";
import { AppDispatch } from "../../utils/hooks";
import { setAuth } from "./authSlice";

export const loginUser =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    const { data } = await API.post("/users/login", { email, password });
    dispatch(setAuth({ token: data.token, userId: data.id }));
    return true;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerUser = (payload: any) => async (dispatch: AppDispatch) => {
  const { data } = await API.post("/users/register", payload);
  return data;
};
