import { createSlice } from "@reduxjs/toolkit";
import {
  getDashboardStats,
  getEmployees,
  getEmployeesByRegion,
  getTransactions,
  insertTransactionData,
} from "./dataAction";

const initialState = {
  // Region wise employees (data entry)
  employees: [],
  empLoading: false,
  empError: null,

  insertLoading: false,
  insertSuccess: false,
  insertError: null,

  transactions: [],
  listLoading: false,
  listError: null,

  dashboardStats: null,
  dashboardLoading: false,
  dashboardError: null,

  allEmployees: [],
  allEmployeesLoading: false,
  allEmployeesError: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    resetInsertState: (state) => {
      state.insertLoading = false;
      state.insertSuccess = false;
      state.insertError = null;
    },
    clearEmployees: (state) => {
      state.employees = [];
    },
  },
  extraReducers: (builder) => {
    // GET employees
    builder
      .addCase(getEmployeesByRegion.pending, (state) => {
        state.empLoading = true;
        state.empError = null;
      })
      .addCase(getEmployeesByRegion.fulfilled, (state, action) => {
        state.empLoading = false;
        state.employees = action.payload.employees;
      })
      .addCase(getEmployeesByRegion.rejected, (state, action) => {
        state.empLoading = false;
        state.empError = action.payload?.message || "Failed to fetch employees";
      });

    // POST insert data
    builder
      .addCase(insertTransactionData.pending, (state) => {
        state.insertLoading = true;
        state.insertSuccess = false;
        state.insertError = null;
      })
      .addCase(insertTransactionData.fulfilled, (state) => {
        state.insertLoading = false;
        state.insertSuccess = true;
      })
      .addCase(insertTransactionData.rejected, (state, action) => {
        state.insertLoading = false;
        state.insertError = action.payload?.message || "Insert failed";
      });

    builder
      .addCase(getTransactions.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.listLoading = false;
        state.transactions = action.payload.transactions;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.listLoading = false;
        state.listError =
          action.payload?.message || "Failed to fetch transactions";
      });

    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError =
          action.payload?.message || "Failed to fetch stats";
      });

    builder
      .addCase(getEmployees.pending, (state) => {
        state.allEmployeesLoading = true; // ← change
        state.allEmployeesError = null; // ← change
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.allEmployeesLoading = false; // ← change
        state.allEmployees = action.payload.employees; // ← change
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.allEmployeesLoading = false; // ← change
        state.allEmployeesError =
          action.payload?.message || "Failed to fetch employees"; // ← change
      });
  },
});

export const { resetInsertState, clearEmployees } = transactionSlice.actions;
export default transactionSlice.reducer;
