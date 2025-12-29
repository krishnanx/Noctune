// src/redux/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const ToastSlice = createSlice({
    name: 'toast',
    initialState: {
        visible: false,
        message: '',
        Title:'',
        showArrow: false,       
        callback: null
    },
    reducers: {
        showToast: (state, action) => {
            state.visible = true;
            state.message = action.payload.message;
            state.Title = action.payload.Title;
            state.showArrow = action.payload.showArrow || false;
            state.callback = action.payload.callback|| null;
        },
        hideToast: (state) => {
            state.visible = false;
            state.message = '';
            state.showArrow = false;
            state.callback = null;
        },
    },
});

export const { showToast, hideToast } = ToastSlice.actions;
export default ToastSlice.reducer;
