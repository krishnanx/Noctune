import { configureStore } from "@reduxjs/toolkit";
import ThemeSlice from "./ThemeSlice.js"
import KeyboardSlice from "./KeyboardSlice.js"
import MusicSlice from "./MusicSlice.js"
import PlaylistSlice from "./PlaylistSlice.js"
import UserSlice from "./UserSlice.js"
import TimerSlice from "./TimerSlice.js"
import DownloadSlice from "./DownloadSlice.js"
import NetworkSlice from "./NetworkSlice.js"
import ToastReducer from './ToastSlice.js'
import Playdataslice from "./Playdataslice.js"
import LyricsSlice from "./LyricsSlice.js"
import VersionSlice from "./VersionSlice.js";

const store = configureStore({
    reducer: {
        theme: ThemeSlice,
        key: KeyboardSlice,
        data: MusicSlice,
        playlist: PlaylistSlice,
        user: UserSlice,
        sleepTimer: TimerSlice,
        download: DownloadSlice,
        network: NetworkSlice,
        playlistload: Playdataslice,
        toast: ToastReducer,
        lyrics: LyricsSlice,
        version: VersionSlice
    }
})
export default store;