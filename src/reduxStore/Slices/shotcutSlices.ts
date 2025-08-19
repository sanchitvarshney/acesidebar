import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  shotcutData: any;
  replyValue: string;
}

const initialState: CounterState = {
  shotcutData: [],
  replyValue: "",
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
  },
});

export const { setShotcuts,setReplyValue } = shotcutSlice.actions;
export default shotcutSlice.reducer;
