// src/redux/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const ToastSlice = createSlice({
    name: 'toast',
    initialState: {
        visible: false,
        message: '',
        Title:''
    },
    reducers: {
        showToast: (state, action) => {
            state.visible = true;
            state.message = action.payload.message;
            state.Title = action.payload.Title
        },
        hideToast: (state) => {
            state.visible = false;
            state.message = '';
        },
    },
});

export const { showToast, hideToast } = ToastSlice.actions;
export default ToastSlice.reducer;
