import { createSlice } from "@reduxjs/toolkit";

const KeyboardSlice = createSlice({
    name: "Key",
    initialState: {
        status: false
    },
    reducers: {
        changeState(state, action) {
            state.status = action.payload
        }
    }
})
export const { changeState } = KeyboardSlice.actions;
export default KeyboardSlice.reducer;