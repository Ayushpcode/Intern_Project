import { createAsyncThunk } from "@reduxjs/toolkit";

const TRANSACTION_URL = "http://localhost:5000/api/transaction";

// GET employees by region
export const getEmployeesByRegion = createAsyncThunk(
  "transaction/getEmployees",
  async (region, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(`${TRANSACTION_URL}/employees?region=${region}`, {
        credentials: "include",
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          
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
        credentials: "include",
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// DELETE transaction
export const deleteTransaction = createAsyncThunk(
  "transaction/delete",
  async (trx_id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${TRANSACTION_URL}/transaction/${trx_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return { trx_id }; // reducer mein remove karne ke liye
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "transaction/updateEmployee",
  async ({ emp_id, changes }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transaction/employee/${emp_id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return { emp_id, changes }; // slice mein local update ke liye
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDashboardStats = createAsyncThunk(
  "transaction/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${TRANSACTION_URL}/data-stats`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);