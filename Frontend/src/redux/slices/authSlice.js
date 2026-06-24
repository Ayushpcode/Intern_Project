import { createSlice } from "@reduxjs/toolkit";
import {
  changePassword,
  checkStatus,
  loginUser,
  registerUser,
  logout,
  checkAuth,
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
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFirstLogin: (state) => {
      state.isFirstLogin = false;
    },
    updateEmployeeLocal: (state, action) => {
      const { emp_id, changes } = action.payload;
      const emp = state.employees.find((e) => e.id === emp_id);
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
          state.token = null;
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
          role: payload.user.role,
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

    // ── Logout ──
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        // state reset
        state.user = null;
        state.token = null;
        state.role = null;
        state.isFirstLogin = false;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        // error aaye tab bhi state clear karo
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      });

    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authChecked = true;
        state.isAuthenticated = true;
        state.user = {
          emp_id: action.payload.user.emp_id,
          name: action.payload.user.name,
          region: action.payload.user.region,
          role: action.payload.user.role,
        };
        state.role = action.payload.user.role;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authChecked = true;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      });
  },
});

export const { clearError, clearFirstLogin, updateEmployeeLocal } =
  authSlice.actions;
export default authSlice.reducer;
