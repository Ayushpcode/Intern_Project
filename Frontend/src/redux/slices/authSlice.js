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

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    return null;
  }
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
      // Clear employee data too, so a new user who logs in doesn't
      // briefly see the previous user's cached employee list.
      state.employees = [];
      state.employeesError = null;
      // NOTE: removed the localStorage.removeItem("persist:auth") call.
      // Mutating localStorage directly inside a reducer is a side effect
      // and can fight with redux-persist's own write cycle. Prefer:
      //   dispatch(logout());
      //   persistor.purge();
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFirstLogin: (state) => {
      state.isFirstLogin = false;
    },
    // Used by the Edit/Save UI on EmployeesPage to update a single
    // employee locally until a real backend "update employee" endpoint exists.
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

        if (payload.is_temp_password) {
          state.isFirstLogin = true;
          state.isAuthenticated = true;
          state.token = payload.temp_token;
          return;
        }

        // Normal login
        const decoded = decodeToken(payload.token);
        if (!decoded) {
          state.error = "Received an invalid token from server";
          return;
        }

        state.isAuthenticated = true;
        state.token = payload.token;
        state.role = decoded.role;
        state.user = {
          id: decoded.id,
          emp_id: decoded.emp_id,
          name: decoded.name,
        };
        state.isFirstLogin = false;
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
        const decoded = decodeToken(action.payload.token);
        if (!decoded) {
          state.error = "Received an invalid token from server";
          return;
        }

        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.role = decoded.role;
        state.user = {
          id: decoded.id,
          emp_id: decoded.emp_id,
          name: decoded.name,
        };
        state.isFirstLogin = false;
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