// AndroidAutoService.js
// Complete integration between Android Auto and React Native Track Player

import { NativeModules, NativeEventEmitter } from 'react-native';
import TrackPlayer, { 
  State, 
  Event, 
  Capability,
  RepeatMode 
} from 'react-native-track-player';

const { AutoMedia } = NativeModules;
const autoMediaEmitter = new NativeEventEmitter(NativeModules.AutoMedia);

class AndroidAutoService {
  constructor() {
    this.listeners = [];
    this.isInitialized = false;
    this.currentTrack = null;
  }

  /**
   * Initialize Android Auto integration
   * Call this once when your app starts
   */
  async initialize() {
    if (this.isInitialized) {
      console.error('AndroidAutoService already initialized');
      return;
    }

    try {
      // Setup RNTP if not already done
      await this.setupTrackPlayer();

      // Listen to Android Auto events
      this.setupAndroidAutoListeners();

      // Listen to RNTP events and sync to Android Auto
      this.setupTrackPlayerListeners();
        const queue = await TrackPlayer.getQueue();
        await this.updateQueue(queue);
      // Initial sync
      await this.syncToAndroidAuto();

      this.isInitialized = true;
      console.log('AndroidAutoService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AndroidAutoService:', error);
      throw error;
    }
  }


  /**
 * Load tracks for a given playlist ID
 * You should implement this to fetch from your database or storage
 */
   // Load all playlists
    async loadAllPlaylists() {
      return [
        { id: 'playlist_1', title: 'Top Hits', artist: '', album: '', artwork: 'https://example.com/p1.jpg', duration: 0 },
        { id: 'playlist_2', title: 'Chill Vibes', artist: '', album: '', artwork: 'https://example.com/p2.jpg', duration: 0 },
      ];
    }


    // Load tracks inside a playlist
    async loadPlaylistTracks(playlistId) {
    // Replace with your database / storage
    const tracks = [
        { id: 'track_1', title: 'Song 1', artist: 'Artist A', album: 'Album X', artwork: 'https://example.com/art1.jpg', duration: 240 },
        { id: 'track_2', title: 'Song 2', artist: 'Artist B', album: 'Album Y', artwork: 'https://example.com/art2.jpg', duration: 200 },
    ];
    return tracks;
    }



  /**
   * Setup Track Player with Android Auto capabilities
   */
  async setupTrackPlayer() {
    try {
      const isSetup = await TrackPlayer.isServiceRunning();
      
      if (!isSetup) {
        await TrackPlayer.setupPlayer();
        
        // Update capabilities for Android Auto
        await TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior: 'ContinuePlayback',
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
      }
    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
    }
  }

  /**
   * Listen to Android Auto control events
   */
  setupAndroidAutoListeners() {

    // Browse request from Android Auto (e.g., clicking a playlist)
    this.listeners.push(
      autoMediaEmitter.addListener('ANDROID_AUTO_BROWSE_REQUEST', async (data) => {
        const { parentId } = data;
        console.error(parentId)
        let items = [];
        if (parentId === 'playlists') items = await this.loadAllPlaylists();
        else if (parentId.startsWith('playlist_')) items = await this.loadPlaylistTracks(parentId.split('_')[1]);

        // Send result back with parentId
        await AutoMedia.sendBrowseResult(parentId, { items });
      })



    );


    // Play event from Android Auto
    this.listeners.push(
      autoMediaEmitter.addListener('ANDROID_AUTO_PLAY', async () => {
        console.error('Android Auto: Play');
        await TrackPlayer.play();
      })
    );

    // Pause event from Android Auto
    this.listeners.push(
      autoMediaEmitter.addListener('ANDROID_AUTO_PAUSE', async () => {
        console.error('Android Auto: Pause');
        await TrackPlayer.pause();
      })
    );

    // Next track event from Android Auto
    this.listeners.push(
      autoMediaEmitter.addListener('ANDROID_AUTO_NEXT', async () => {
        console.error('Android Auto: Next');
        await TrackPlayer.skipToNext();
      })
    );

    // Previous track event from Android Auto
    this.listeners.push(
      autoMediaEmitter.addListener('ANDROID_AUTO_PREVIOUS', async () => {
        console.error('Android Auto: Previous');
        await TrackPlayer.skipToPrevious();
      })
    );

    // Seek event from Android Auto
    this.listeners.push(
      autoMediaEmitter.addListener('ANDROID_AUTO_SEEK_TO', async (data) => {
        console.error('Android Auto: Seek to', data.position);
        await TrackPlayer.seekTo(data.position / 1000); // Convert to seconds
      })
    );

    // Play from media ID (when user selects from browse)
    this.listeners.push(
      autoMediaEmitter.addListener('ANDROID_AUTO_PLAY_FROM_ID', async (data) => {
        console.error('Android Auto: Play from ID', data.mediaId);
        // Handle playing specific track from browse
        // You'll implement this based on your media library
        await this.handlePlayFromMediaId(data.mediaId);
      })
    );
  }

  /**
   * Listen to Track Player events and sync to Android Auto
   */
  setupTrackPlayerListeners() {
    // Track changed
    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async (event) => {
      if (event.track != null) {
        console.error('Track changed:', event.track);
        await this.syncTrackMetadata(event.track);
      }
    });

    // Playback state changed
    TrackPlayer.addEventListener(Event.PlaybackState, async (event) => {
      console.error('Playback state changed:', event.state);
      const isPlaying = event.state === State.Playing;
      await this.updatePlaybackState(isPlaying);
    });

    // Progress update (update every 5 seconds to avoid too many updates)
    let lastUpdate = 0;
    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async (event) => {
      const now = Date.now();
      if (now - lastUpdate > 5000) { // Update every 5 seconds
        lastUpdate = now;
        const position = event.position || 0;
        const duration = event.duration || 0;
        await this.updatePosition(position, duration);
      }
    });

    // Queue ended
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async (event) => {
      console.error('Queue ended');
      await this.updatePlaybackState(false);
    });

    // Playback error
    TrackPlayer.addEventListener(Event.PlaybackError, (event) => {
      console.error('Playback error:', event);
    });
  }

  /**
   * Sync current track metadata to Android Auto
   */
  async syncTrackMetadata(track) {
    if (!track) return;

    this.currentTrack = track;

    try {
      // Ensure all values are valid
      const title = track.title || 'Unknown Title';
      const artist = track.artist || 'Unknown Artist';
      const artwork = track.artwork || null;
      const album = track.album || '';
      const duration = track.duration || 0;

      await AutoMedia.updateNowPlaying(
        title,
        artist,
        artwork,
        album,
        duration
      );

      // Also update duration
      if (duration > 0) {
        const position = await TrackPlayer.getProgress();
        await AutoMedia.updatePosition(
          position.position || 0,
          duration
        );
      }
    } catch (error) {
      console.error('Error syncing track metadata:', error);
    }
  }

  /**
   * Update playback state in Android Auto
   */
  async updatePlaybackState(isPlaying) {
    try {
      const progress = await TrackPlayer.getProgress();
      await AutoMedia.updatePlaybackState(isPlaying, progress.position || 0);
    } catch (error) {
      console.error('Error updating playback state:', error);
    }
  }

  /**
   * Update playback position in Android Auto
   */
  async updatePosition(position, duration) {
    try {
      // Ensure valid numbers
      const safePosition = typeof position === 'number' ? position : 0;
      const safeDuration = typeof duration === 'number' ? duration : 0;
      
      await AutoMedia.updatePosition(safePosition, safeDuration);
    } catch (error) {
      console.error('Error updating position:', error);
    }
  }

  /**
   * Sync current state to Android Auto
   */
  async syncToAndroidAuto() {
    try {
      // Get current track
      const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();
      if (currentTrackIndex !== null && currentTrackIndex !== undefined) {
        const track = await TrackPlayer.getTrack(currentTrackIndex);
        if (track) {
          await this.syncTrackMetadata(track);
        }
      }

      // Get current state
      const state = await TrackPlayer.getPlaybackState();
      const isPlaying = state.state === State.Playing;
      await this.updatePlaybackState(isPlaying);

      // Get current position
      const progress = await TrackPlayer.getProgress();
      const position = progress.position || 0;
      const duration = progress.duration || 0;
      await this.updatePosition(position, duration);
    } catch (error) {
      console.error('Error syncing to Android Auto:', error);
    }
  }

  /**
   * Handle play from media ID (browsing)
   * Implement this based on your media library structure
   */
  async handlePlayFromMediaId(mediaId) {
    // Example implementation:
    // Parse the mediaId to determine what to play
    // mediaId format could be: "track_123", "playlist_456", "album_789"
    
    try {
      const [type, id] = mediaId.split('_');
      
      switch (type) {
        case 'track':
          // Play single track
          // Load track from your database/storage
          // const track = await this.loadTrackById(id);
          // await TrackPlayer.reset();
          // await TrackPlayer.add(track);
          // await TrackPlayer.play();
          break;
          
        case 'playlist':
            console.warn("PLAYLIST")
          // Load and play playlist
          // const tracks = await this.loadPlaylistTracks(id);
          // await TrackPlayer.reset();
          // await TrackPlayer.add(tracks);
          // await TrackPlayer.play();
          break;
          
        case 'album':
          // Load and play album
          // const tracks = await this.loadAlbumTracks(id);
          // await TrackPlayer.reset();
          // await TrackPlayer.add(tracks);
          // await TrackPlayer.play();
          break;
          
        default:
          console.warn('Unknown media type:', type);
      }
    } catch (error) {
      console.error('Error handling play from media ID:', error);
    }
  }

  /**
   * Update the queue in Android Auto
   * Call this when your queue changes
   */
  async updateQueue(tracks) {
    try {
      // Format queue for Android Auto
      const queue = tracks.map((track, index) => ({
        id: track.id || `track_${index}`,
        title: track.title || 'Unknown Title',
        artist: track.artist || 'Unknown Artist',
        album: track.album || '',
        artwork: track.artwork || null,
        duration: track.duration || 0,
      }));

      await AutoMedia.setMediaQueue({ items: queue });
    } catch (error) {
      console.error('Error updating queue:', error);
    }
  }

  /**
   * Manual sync - call this if you need to force sync
   */
  async forceSync() {
    await this.syncToAndroidAuto();
  }

  /**
   * Cleanup listeners
   */
  destroy() {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
    this.isInitialized = false;
    console.error('AndroidAutoService destroyed');
  }
}

// Export singleton instance
export default new AndroidAutoService();