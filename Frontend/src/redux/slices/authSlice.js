import { createSlice } from "@reduxjs/toolkit";
import {
  changePassword,
  checkStatus,
  loginUser,
  registerUser,
} from "./authAction";

const initialState = {
  user: null,
  token: null,
  role: null,
  isFirstLogin: false,
  isAuthenticated: false,
  loading: false,
  error: null,
  pendingEmail: null,
  employees: [],
  employeesLoading: false,
  employeesError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isFirstLogin = false;
      state.isAuthenticated = false;
      state.error = null;
      state.pendingEmail = null;
      state.employees = [];
      state.employeesError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFirstLogin: (state) => {
      state.isFirstLogin = false;
    },
    updateEmployeeLocal: (state, action) => {
      const { id, changes } = action.payload;
      const emp = state.employees.find((e) => e.id === id);
      if (emp) Object.assign(emp, changes);
    },
  },

  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        // Temp password case
        if (payload.is_temp_password) {
          state.isFirstLogin = true;
          state.isAuthenticated = true;
          state.token = payload.temp_token; // sirf is case mein token Redux mein
          state.error = null;
          return;
        }

        // Normal login — token cookie mein hai, response mein nahi
        if (!payload.success) {
          state.error = payload.message || "Login failed";
          return;
        }

        state.isAuthenticated = true;
        state.token = null; // cookie se kaam chalega
        state.role = payload.user.role;
        state.user = {
          emp_id: payload.user.emp_id,
          name: payload.user.name,
          region: payload.user.region,
        };
        state.isFirstLogin = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      });

    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingEmail = action.meta.arg.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Register failed";
      });

    // ── Check Status ──
    builder.addCase(checkStatus.fulfilled, (state, action) => {
      if (action.payload.status === "ACTIVE") {
        state.pendingEmail = null;
      }
    });

    // ── Change Password ──
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        // Token cookie mein set ho gaya backend se
        if (!payload.success) {
          state.error = payload.message || "Password change failed";
          return;
        }

        state.isAuthenticated = true;
        state.token = null; // cookie se kaam chalega
        state.role = payload.user.role;
        state.user = {
          emp_id: payload.user.emp_id,
          name: payload.user.name,
          region: payload.user.region,
        };
        state.isFirstLogin = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password change failed";
      });
  },
});

export const { logout, clearError, clearFirstLogin, updateEmployeeLocal } =
  authSlice.actions;
export default authSlice.reducer;