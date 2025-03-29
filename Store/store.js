import { configureStore } from "@reduxjs/toolkit";
import ThemeSlice from "./ThemeSlice.js"
const store = configureStore({
    reducer: {
        theme: ThemeSlice,
    }
})
export default store;