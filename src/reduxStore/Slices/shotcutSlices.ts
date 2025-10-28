import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  shotcutData: any;
  replyValue: string;
  forwardData: any;
  isReply: boolean;
  selectedIndex: string | number;
  isOpen: boolean;
  isOpenTask: boolean;
  expended: boolean;
}

const initialState: CounterState = {
  shotcutData: [],
  replyValue: "",
  forwardData: {},
  isReply: true,
  selectedIndex: "1",
  isOpen: true,
  isOpenTask: false,
  expended: false,
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
    setOpenTask: (state, action) => {
      state.isOpenTask = action.payload;
    },
    setExpended: (state, action) => {
      state.expended = action.payload;
    },
  },
});

export const {
  setShotcuts,
  setReplyValue,
  setForwardData,
  setIsReply,
  setSelectedIndex,
  setToggle,
  setOpenTask,
  setExpended
} = shotcutSlice.actions;
export default shotcutSlice.reducer;
