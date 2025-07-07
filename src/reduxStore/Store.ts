// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseInstanceOfApi } from "../services/baseInstanceOfApi";

export const store = configureStore({
  reducer: {
    [baseInstanceOfApi.reducerPath]: baseInstanceOfApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseInstanceOfApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
