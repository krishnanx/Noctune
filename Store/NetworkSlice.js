import { createSlice } from "@reduxjs/toolkit";
const NetworkSlice = createSlice({
    name: "network",
    initialState: {
        isConnected: false,
        nettype: null,
        hasChecked: false
    },
    reducers: {
        connection(state, action) {
            state.isConnected = action.payload
        },
        type(state, action) {
            state.nettype = action.payload
        },
        checked(state, action) {
            state.hasChecked = action.payload
        }
    }
})
export const { connection, type, checked } = NetworkSlice.actions;
export default NetworkSlice.reducer;