import { configureStore } from "@reduxjs/toolkit";
import ThemeSlice from "./ThemeSlice.js"
import KeyboardSlice from "./KeyboardSlice.js"
const store = configureStore({
    reducer: {
        theme: ThemeSlice,
        key: KeyboardSlice
    }
})
export default store;