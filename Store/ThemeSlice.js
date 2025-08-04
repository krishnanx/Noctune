import { createSlice } from "@reduxjs/toolkit";
const ThemeSlice = createSlice({
    name: "theme",
    initialState: {
        Mode: "dark"

    },
    reducers: {
        changeTheme(state, action) {
            if(action.payload){
                state.Mode = "dark"
            }
            else{
                state.Mode = "light"
            }
        }
    }
})
export const { changeTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;