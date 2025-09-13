import TrackPlayer from "react-native-track-player";
import Constants from 'expo-constants';
/**
 * Adds one or more tracks to RNTP and prepares them for playback
 * @param {Object|Array} tracks - A single track object or an array of track objects
 * @param {boolean} resetQueue - Whether to clear the queue before adding
 */
export async function addMusicIntoRNTP({tracks, resetQueue = false}) {
  try {

    if (resetQueue) {
      await TrackPlayer.reset();
    }


    if (Array.isArray(tracks)) {
      const track = tracks.map((t) => ({
        id: t.id,
        url: `${Constants.expoConfig.extra.SERVER}/api/stream?url=${encodeURIComponent(t.url)}`,
        title: t.title || "Unknown Title",
        artist: t.artist || "Unknown Artist",
        artwork: t.image,
        duration: t.duration, // optional, seconds
        type: 'default'
      }));

      await TrackPlayer.add(track);
      return;
    }

    console.warn("LETS ADDD:",tracks)
    const upscaledUrl = tracks.image.replace(
        /w\d+-h\d+/,
        "w500-h500"
      );
    const track = {
      id: tracks.id,
      url: `${Constants.expoConfig.extra.SERVER}/api/stream?url=${encodeURIComponent(tracks.url)}`,
      title: tracks.title || "Unknown Title",
      artist: tracks.artist || "Unknown Artist",
      artwork: upscaledUrl,
      duration: tracks.duration, // optional, seconds
      type: 'default'
    }

    await TrackPlayer.add([track]);

    console.warn(`🎵 Added track(s) to queue`);
  } catch (error) {
    console.error("❌ Error adding music:", error);
  }
}
