import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
}

const tokenFromStorage = localStorage.getItem("token");

const initialState: AuthState = {
  token: tokenFromStorage,
  userId: tokenFromStorage ? Number(localStorage.getItem("userId")) : null,
  isAuthenticated: !!tokenFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; userId: number }>
    ) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.userId.toString());
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
