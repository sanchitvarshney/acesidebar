import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  payload: any;
  startTime: string;
}

const initialState: initialState = {
  payload: {},
  startTime: "",
};

const setUpSlice = createSlice({
  name: "setup",
  initialState,
  reducers: {
    setPayload: (state, action) => {
      state.payload = action.payload;
    },
    setStartTime: (state, action) => {
   
      state.startTime = action.payload;
    }
  },
});

export const { setPayload ,setStartTime} = setUpSlice.actions;
export default setUpSlice.reducer;
