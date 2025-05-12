import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { Axios } from "axios";
import { progress } from "./MusicSlice";
const DownloadSlice = createSlice({
    name: "download",
    initialState: {
        songs: [],
        status: "idle",
        completed: 0,
        path: "",
        finalData: [],
    },
    reducers: {
        addSong(state, action) {
            const array = action.payload.data.map(item => ({ ...item, progress: 0 })

            )
            state.songs = array
        },
        changeProgress(state, action) {
            state.songs[action.payload.index].progress = action.payload.progress
        },
        setCompleted(state, action) {
            if (action.payload == 1) {
                state.completed += action.payload
            }
            else if (action.payload == 0) {
                state.completed = action.payload
            }
        },
        addPath(state, action) {
            state.path = action.payload.path
        },
        addData(state, action) {
            const data = action.payload.final
            const status = "idle"
            state.finalData = [...state.finalData, { data: data, status: status }]
        },
        changeSongStatus(state, action) {
            state.finalData[action.payload.index].status = action.payload.status
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(download.pending, (state, action) => {
                state.status = "downloading"
            })
            .addCase(download.fulfilled, (state, action) => {
                state.status = "idle"
            })
            .addCase(download.rejected, (state, action) => {
                state.status = "error"
            })
    }
})
export const { addSong, changeProgress, setCompleted, addPath, addData, changeSongStatus } = DownloadSlice.actions;
export default DownloadSlice.reducer;
export const download = createAsyncThunk('download/music', async ({ data, ClientId }) => {
    console.warn("blahh")
    console.warn({ data, ClientId })

    const song = data.map(element => element.url);

    console.warn(song, ClientId)
    const response = await axios.post("http://192.168.1.44/api/download", { song, ClientId },);
    return response.data; // This will be returned to your Redux store
});