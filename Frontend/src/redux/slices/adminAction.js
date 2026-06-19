// src/redux/slices/adminAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";

const ADMIN_URL = "http://localhost:5000/api/admin";

export const getPendingEmployees = createAsyncThunk(
  "admin/getPending",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(`${ADMIN_URL}/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveEmployee = createAsyncThunk(
  "admin/approve",
  async ({ id, role, region }, { rejectWithValue, getState  }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(`${ADMIN_URL}/approve/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, region }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return { ...data, id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectEmployee = createAsyncThunk(
  "admin/reject",
  async (id, { rejectWithValue, getState  }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(`${ADMIN_URL}/reject/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return { ...data, id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);