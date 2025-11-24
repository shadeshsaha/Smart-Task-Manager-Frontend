// import type { PayloadAction } from "@reduxjs/toolkit";
// import { createSlice } from "@reduxjs/toolkit";

// interface AuthState {
//   token: string | null;
//   userId: number | null;
// }

// const initialState: AuthState = {
//   token: localStorage.getItem("token"),
//   userId: null,
// };

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuth: (
//       state,
//       action: PayloadAction<{ token: string; userId: number }>
//     ) => {
//       state.token = action.payload.token;
//       state.userId = action.payload.userId;
//       localStorage.setItem("token", action.payload.token);
//     },
//     logout: (state) => {
//       state.token = null;
//       state.userId = null;
//       localStorage.removeItem("token");
//     },
//   },
// });

// export const { setAuth, logout } = authSlice.actions;
// export default authSlice.reducer;
