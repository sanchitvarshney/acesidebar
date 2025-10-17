import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  payload: any;
  startTime: string;
  isViewTicket: boolean
}

const initialState: initialState = {
  payload: {},
  startTime: "",
  isViewTicket: false
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
    },
    setIsViewTicket: (state, action) => {
      state.isViewTicket = action.payload;
    }
  },
});

export const { setPayload ,setStartTime, setIsViewTicket} = setUpSlice.actions;
export default setUpSlice.reducer;
