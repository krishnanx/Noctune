import TrackPlayer from "react-native-track-player";
import Constants from 'expo-constants';
/**
 * Adds one or more tracks to RNTP and prepares them for playback
 * @param {Object|Array} tracks - A single track object or an array of track objects
 * @param {boolean} resetQueue - Whether to clear the queue before adding
 */
export async function addMusicIntoRNTP({tracks, resetQueue = false, insertBeforeIndex}) {
  try {

    if (resetQueue) {
      await TrackPlayer.reset();
    }


    // if (Array.isArray(tracks)) {
    //   const track = tracks.map((t) => ({
    //     id: t.id,
    //     url: `${Constants.expoConfig.extra.SERVER}/api/stream?url=${encodeURIComponent(t.url)}`,
    //     title: t.title || "Unknown Title",
    //     artist: t.artist || "Unknown Artist",
    //     artwork: t.image,
    //     duration: t.duration, // optional, seconds
    //     type: 'default'
    //   }));

    //   await TrackPlayer.add(track);
    //   return;
    // }

    if (Array.isArray(tracks)) {
      const track = tracks.map((t) => {
        // --- DEBUG LOGS ---
        console.warn(`[DEBUG] Processing: ${t.title}`);
        console.warn(`[DEBUG] Raw URL from DB: ${t.url}`);
        
        // Check if the URL is actually missing
        if (!t.url) {
          console.warn(`[WARN] Song "${t.title}" has NO URL. This will cause the IO Error.`);
        }

        return {
          id: t.id?.toString() || Math.random().toString(),
          // Use fallback to avoid sending "undefined" to your server
          url: t.url 
            ? `${Constants.expoConfig.extra.SERVER}/api/stream?url=${encodeURIComponent(t.url)}`
            : "", 
          title: t.title || "Unknown Title",
          artist: t.artist || "Unknown Artist",
          artwork: t.image,
          duration: t.duration,
          type: 'default'
        };
      });

      // Only add tracks that actually have a URL
      const validTracks = track.filter(t => t.url !== "");
      
      if (validTracks.length === 0) {
        console.error("❌ No valid songs with URLs found in this playlist!");
        return;
      }

      await TrackPlayer.add(validTracks);
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
      artist: tracks.artist ||  tracks.uploader || "Unknown Artist",
      artwork: upscaledUrl,
      duration: tracks.duration, // optional, seconds
      type: 'default'
    }

    await TrackPlayer.add([track], insertBeforeIndex);

    console.warn(`🎵 Added track(s) to queue`);
  } catch (error) {
    console.error("❌ Error adding music:", error);
  }
}
