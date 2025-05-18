import { NativeModules, NativeEventEmitter, Platform } from "react-native";

const MediaNotification = NativeModules.MediaNotification;
const MediaNotificationEmitter = MediaNotification
  ? new NativeEventEmitter(MediaNotification)
  : null;


/**
 * A React Native wrapper for the native MediaNotification module
 */
class MediaNotificationManager {
  constructor() {
    this.listeners = {};
    this.currentTrack = null; //added
    this.callbackMap = {}; //added

    // Android only - iOS will return null
    this.isAvailable = Platform.OS === "android" && MediaNotification != null;

    // Register event listeners
    if (this.isAvailable) {
      this._registerEventListeners();
    } else {
      console.warn("MediaNotification module not available");
    }
  }

  /**
   * Show the media playback notification
   * @param {Object} trackData - Object containing track information
   * @param {string} trackData.title - Title of the track
   * @param {string} trackData.artist - Artist name
   * @param {string} trackData.album - Album name
   * @param {string} trackData.artwork - URL to artwork image
   * @returns {Promise} - Promise that resolves when notification is shown
   */
  showNotification(trackData) {
    if (!this.isAvailable) {
      console.warn("MediaNotification is not available on this platform");
      return Promise.resolve(false);
    }

    this.currentTrack = { ...trackData }; //added
    return MediaNotification.showNotification(trackData);
  }

  /**
   * Update the playback status (playing/paused) of the notification
   * @param {boolean} isPlaying - Whether audio is currently playing
   * @returns {Promise} - Promise that resolves when notification is updated
   */
  updatePlaybackStatus(isPlaying) {
    if (!this.isAvailable) {
      console.warn("MediaNotification is not available on this platform");
      return Promise.resolve(false);
    }

    return MediaNotification.updatePlaybackStatus(isPlaying);
  }

  /**
   * Hide the media playback notification
   * @returns {Promise} - Promise that resolves when notification is hidden
   */
  hideNotification() {
    if (!this.isAvailable) {
      console.warn("MediaNotification is not available on this platform");
      return Promise.resolve(false);
    }

    this.currentTrack = null; //added
    return MediaNotification.hideNotification();
  }

  /**
   * Update the current track metadata in the notification
   * @param {Object} trackData - Object with new metadata (title, artist, album, artwork)
   * @returns {Promise<boolean>}
   */
  updateTrackData(trackData) {
    if (!this.isAvailable) {
      console.warn("MediaNotification is not available on this platform");
      return Promise.resolve(false);
    }

    // Merge with existing track data if needed
    this.currentTrack = { ...this.currentTrack, ...trackData };

    return MediaNotification.updateTrackData(trackData);
  }

  /**
   * Add event listener for media notification controls
   * @param {string} event - One of: 'play', 'pause', 'next', 'previous', 'stop'
   * @param {Function} callback - Function to call when event occurs
   * @returns {Function} - Function to remove the listener
   */
  addEventListener(event, callback) {
    if (!this.isAvailable || !MediaNotificationEmitter) {
      console.warn("MediaNotification is not available on this platform");
      return () => {};
    }

    // Map event names to native event names
    const eventMap = {
      play: "onPlayEvent",
      pause: "onPauseEvent",
      next: "onNextEvent",
      previous: "onPrevEvent",
      stop: "onStopEvent",
    };

    const nativeEvent = eventMap[event];
    if (!nativeEvent) {
      console.warn(
        `Unknown event: ${event}. Supported events are: play, pause, next, previous, stop`
      );
      return () => {};
    }

    // Add event listener
    const subscription = MediaNotificationEmitter.addListener(
      nativeEvent,
      callback
    );
    // Important: Call addListener on native module to track listener
    if (MediaNotification.addListener) {
      MediaNotification.addListener(nativeEvent);
    }

    // Store the subscription so we can remove it later
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(subscription);

    // Return a function to remove the listener
    return () => {
      this._removeListener(event, subscription);
    };
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    if (!this.isAvailable) {
      return;
    }

    Object.keys(this.listeners).forEach((event) => {
      this.listeners[event].forEach((subscription) => {
        subscription.remove();
      });
      this.listeners[event] = [];
    });

    // Inform native module about removed listeners
    if (MediaNotification.removeListeners) {
      MediaNotification.removeListeners(0);
    }
  }

  /**
   * Register default event listeners to forward native events to JS
   * @private
   */
  _registerEventListeners() {
    // Nothing to do here, events are registered on-demand
  }

  /**
   * Remove a specific event listener
   * @param {string} event - Event name
   * @param {Object} subscription - Subscription object returned by addListener
   * @private
   */
  _removeListener(event, subscription) {
    if (!this.listeners[event]) {
      return;
    }

    const index = this.listeners[event].indexOf(subscription);
    if (index !== -1) {
      this.listeners[event].splice(index, 1);
      subscription.remove();
    }

    // Inform native module about removed listener
    if (MediaNotification.removeListeners) {
      MediaNotification.removeListeners(1);
    }
  }
}

export default new MediaNotificationManager();
