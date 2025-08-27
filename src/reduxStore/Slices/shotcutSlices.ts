import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  shotcutData: any;
  replyValue: string;
  forwardData: any
}

const initialState: CounterState = {
  shotcutData: [],
  replyValue: "",
  forwardData: {}
};

const shotcutSlice = createSlice({
  name: "shortcut",
  initialState,
  reducers: {
    setShotcuts: (state, action) => {
      state.shotcutData = action.payload;
    },
    setReplyValue: (state, action) => {
      state.replyValue = action.payload;
    },
    setForwardData: (state, action) => {
      state.forwardData = action.payload;
    },
  },
});

export const { setShotcuts,setReplyValue,setForwardData } = shotcutSlice.actions;
export default shotcutSlice.reducer;
