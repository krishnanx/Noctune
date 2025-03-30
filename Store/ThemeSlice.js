import { createSlice } from "@reduxjs/toolkit";
const ThemeSlice = createSlice({
    name: "theme",
    initialState: {
        Mode: "dark"

    },
    reducers: {
        changeTheme(state, action) {
            state.Mode = action.payload
        }
    }
})
export const { changeTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;