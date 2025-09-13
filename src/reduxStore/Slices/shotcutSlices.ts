import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  shotcutData: any;
  replyValue: string;
  forwardData: any;
  isReply: boolean;
  selectedIndex: string | number;
  isOpen: boolean
}

const initialState: CounterState = {
  shotcutData: [],
  replyValue: "",
  forwardData: {},
  isReply: true,
  selectedIndex: "1",
  isOpen: true
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
    setSelectedIndex: (state, action) => {
      state.selectedIndex = action.payload;
    },
        setToggle: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  setShotcuts,
  setReplyValue,
  setForwardData,
  setIsReply,
  setSelectedIndex,
  setToggle
} = shotcutSlice.actions;
export default shotcutSlice.reducer;
