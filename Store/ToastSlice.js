// src/redux/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const ToastSlice = createSlice({
    name: 'toast',
    initialState: {
        visible: false,
        message: '',
    },
    reducers: {
        showToast: (state, action) => {
            state.visible = true;
            state.message = action.payload;
        },
        hideToast: (state) => {
            state.visible = false;
            state.message = '';
        },
    },
});

export const { showToast, hideToast } = ToastSlice.actions;
export default ToastSlice.reducer;
