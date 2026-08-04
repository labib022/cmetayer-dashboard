import { createSlice } from "@reduxjs/toolkit";

const getStoredAuth = () => {
  if (typeof window === "undefined") return { access: null, user: null };
  try {
    const access = localStorage.getItem("admin_access");
    const user = JSON.parse(localStorage.getItem("admin_user") || "null");
    return { access, user };
  } catch {
    return { access: null, user: null };
  }
};

const initialState = getStoredAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.access = action.payload.access;
      state.user = action.payload.user;
      localStorage.setItem("admin_access", action.payload.access);
      localStorage.setItem("admin_user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.access = null;
      state.user = null;
      localStorage.removeItem("admin_access");
      localStorage.removeItem("admin_user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;