import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./slices/authSlice";
import transactionReducer from "./slices/dataSlice"; 

const storage = {
  getItem: (key) => new Promise((resolve) => resolve(localStorage.getItem(key))),
  setItem: (key, value) => new Promise((resolve) => resolve(localStorage.setItem(key, value))),
  removeItem: (key) => new Promise((resolve) => resolve(localStorage.removeItem(key))),
};

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "role", "user", "isAuthenticated", "isFirstLogin"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    transaction: transactionReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);