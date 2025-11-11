import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  isOpenToggle: boolean
}

const initialState: initialState = {
  isOpenToggle: true,
 
};

const genralSlice = createSlice({
  name: "genral",
  initialState,
  reducers: {
    setToggale: (state, action) => {
      state.isOpenToggle = action.payload;
    },

  },
});

export const { setToggale} = genralSlice.actions;
export default genralSlice.reducer;
