import { configureStore } from "@reduxjs/toolkit";
import ThemeSlice from "./ThemeSlice.js"
import KeyboardSlice from "./KeyboardSlice.js"
import MusicSlice from "./MusicSlice.js"
import PlaylistSlice from "./PlaylistSlice.js"
import UserSlice from "./UserSlice.js"
import TimerSlice from "./TimerSlice.js"
import DownloadSlice from "./DownloadSlice.js"
const store = configureStore({
    reducer: {
        theme: ThemeSlice,
        key: KeyboardSlice,
        data: MusicSlice,
        playlist: PlaylistSlice,
        user: UserSlice,
        sleepTimer: TimerSlice,
        download: DownloadSlice
    }
})
export default store;