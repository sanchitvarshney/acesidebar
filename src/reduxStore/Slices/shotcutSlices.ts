import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  shotcutData: any;
  replyValue: string;
  forwardData: any;
  isReply: boolean
}

const initialState: CounterState = {
  shotcutData: [],
  replyValue: "",
  forwardData: {},
  isReply: true
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
    setIsReply: (state, action) => {
      state.isReply = action.payload;
    },
  },
});

export const { setShotcuts,setReplyValue,setForwardData , setIsReply} = shotcutSlice.actions;
export default shotcutSlice.reducer;
