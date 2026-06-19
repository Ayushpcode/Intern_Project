import { createAsyncThunk } from "@reduxjs/toolkit";

const TRANSACTION_URL = "http://localhost:5000/api/transaction";

// GET employees by region
export const getEmployeesByRegion = createAsyncThunk(
  "transaction/getEmployees",
  async (region, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(`${TRANSACTION_URL}/employees?region=${region}`, {
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

// POST insert data
export const insertTransactionData = createAsyncThunk(
  "transaction/insertData",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(`${TRANSACTION_URL}/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTransactions = createAsyncThunk(
  "transaction/getList",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(`${TRANSACTION_URL}/list`, {
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

export const getDashboardStats = createAsyncThunk(
  "transaction/getDashboardStats",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(`${TRANSACTION_URL}/data-stats`, {
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

export const getEmployees = createAsyncThunk(
  "transaction/getAll",
  async (_, { rejectWithValue, getState }) => { 
    try {
      const token = getState().auth.token;
      const res = await fetch(`${TRANSACTION_URL}/all-employees`, {
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