import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access: null,
  refresh: null,
  user: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      if (typeof window === "undefined") return;
      try {
        state.access = localStorage.getItem("admin_access") || null;
        state.refresh = localStorage.getItem("admin_refresh") || null;
        state.user = JSON.parse(localStorage.getItem("admin_user") || "null");
      } catch {
        state.access = null;
        state.refresh = null;
        state.user = null;
      }
      state.hydrated = true;
    },
    setCredentials: (state, action) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh ?? state.refresh;
      state.user = action.payload.user;
      state.hydrated = true;

      localStorage.setItem("admin_access", action.payload.access);
      if (action.payload.refresh) {
        localStorage.setItem("admin_refresh", action.payload.refresh);
      }
      localStorage.setItem("admin_user", JSON.stringify(action.payload.user));
    },
    // Used by the auto-refresh flow in authApi.js - updates the access
    // (and optionally refresh) token without touching the user object.
    setAccessToken: (state, action) => {
      state.access = action.payload.access;
      if (action.payload.refresh) {
        state.refresh = action.payload.refresh;
      }

      localStorage.setItem("admin_access", action.payload.access);
      if (action.payload.refresh) {
        localStorage.setItem("admin_refresh", action.payload.refresh);
      }
    },
    logout: (state) => {
      state.access = null;
      state.refresh = null;
      state.user = null;
      localStorage.removeItem("admin_access");
      localStorage.removeItem("admin_refresh");
      localStorage.removeItem("admin_user");
    },
  },
});

export const { setCredentials, setAccessToken, logout, hydrateAuth } =
  authSlice.actions;
export default authSlice.reducer;