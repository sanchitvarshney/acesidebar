import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  payload: any;
}

const initialState: initialState = {
  payload: {},
};

const setUpSlice = createSlice({
  name: "setup",
  initialState,
  reducers: {
    setPayload: (state, action) => {
      state.payload = action.payload;
    },
  },
});

export const { setPayload } = setUpSlice.actions;
export default setUpSlice.reducer;
