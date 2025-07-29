    import { createSlice } from "@reduxjs/toolkit";

    interface CounterState {
    shotcutData: any;
    }

    const initialState: CounterState = {
    shotcutData: [],
    };

    const shotcutSlice = createSlice({
    name: "shortcut",
    initialState,
    reducers: {
        setShotcuts: (state, action) => {
        state.shotcutData = action.payload;
        },
    },
    });

    export const { setShotcuts } = shotcutSlice.actions;
    export default shotcutSlice.reducer;
