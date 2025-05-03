import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isTimerActive: false,
    timerDuration: null,
    timerId: null,
    timerEndTime: null,
}

const TimerSlice = createSlice({
    name:'sleepTimer',
    initialState,
    reducers:{
        startTimer :(state,action) => {
            state.isTimerActive = true;
            state.timerDuration = action.payload.duration;
            state.timerId = action.payload.timerId;
            state.timerEndTime = Date.now() + action.payload.duration;
        },
        stopTimer : (state) => {
            state.isTimerActive = false;
            state.timerDuration = null;
            state.timerId = null;
            state.timerEndTime = null;
        },
        updateTimerInfo : (state,action) => {
            state.timerId = action.payload.timerId;
        }
    }
});

export const {startTimer, stopTimer, updateTimerInfo} = TimerSlice.actions;
export default TimerSlice.reducer;