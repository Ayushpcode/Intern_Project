import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:5000/api/auth" ;

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue}) =>{
        try {
            const res = await fetch( `${BASE_URL}/login`,{
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            })

            const data = await res.json();

            if(!res.ok) return rejectWithValue(data);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, {rejectWithValue}) =>{
        try {
            const res = await fetch(`${BASE_URL}/register`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(userData),
            })
            const data = await res.json();

            if(!res.ok) return rejectWithValue(data);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkStatus = createAsyncThunk(
  "auth/checkStatus",
  async (email, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/status?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ new_password, confirm_password, token }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_password, confirm_password }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
