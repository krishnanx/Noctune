import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const Playdataslice = createSlice({
    name: "play",
    initialState: {
        song: [],
        pos: 0,

    },
    reducers: {
        addType(state, action) {
            state.song = action.payload
            state.pos = 0;
        },
        changePos(state, action) {
            console.warn(state.pos);
            if (action.payload == +1) {
                if (state.pos !== state.song.length - 1) {
                    state.pos = state.pos + 1;
                }
            } else if (action.payload == -1) {
                if (state.pos > 0) {
                    state.pos = state.pos - 1;
                }
            }
        }
    },


});
export const {
    addType
} = Playdataslice.actions;
export default Playdataslice.reducer;