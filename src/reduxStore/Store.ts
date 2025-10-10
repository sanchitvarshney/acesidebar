// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseInstanceOfApi } from "../services/baseInstanceOfApi";
import shotcutSlice from "../reduxStore/Slices/shotcutSlices";
import setUpSlice from "../reduxStore/Slices/setUpSlices";

export const store = configureStore({
  reducer: {
    [baseInstanceOfApi.reducerPath]: baseInstanceOfApi.reducer,
    shotcut: shotcutSlice,
    setUp: setUpSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseInstanceOfApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
