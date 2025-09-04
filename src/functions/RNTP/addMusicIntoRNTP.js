import TrackPlayer from "react-native-track-player";
import Constants from 'expo-constants';
/**
 * Adds one or more tracks to RNTP and prepares them for playback
 * @param {Object|Array} tracks - A single track object or an array of track objects
 * @param {boolean} resetQueue - Whether to clear the queue before adding
 */
export async function addMusicIntoRNTP({tracks, resetQueue = true}) {
  try {
    // Ensure setup has been called already in App startup

    // Normalize input (single object → array)
    //const trackArray = Array.isArray(tracks) ? tracks : [tracks];
    console.warn(tracks)
    const track = {
        id: tracks.id,
        url: `${Constants.expoConfig.extra.SERVER}/api/stream?url=${encodeURIComponent(tracks.url)}`,
        title: tracks.title || "Unknown Title",
        artist: tracks.artist || "Unknown Artist",
        artwork: tracks.image,
        duration: tracks.duration, // optional, seconds
        }
    await TrackPlayer.add([track]);

    console.warn(`🎵 Added ${track.length} track(s) to queue`);
  } catch (error) {
    console.error("❌ Error adding music:", error);
  }
}
