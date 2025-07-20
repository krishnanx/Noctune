import * as Notifications from 'expo-notifications';
export const sendSongFinishedNotification = async (songTitle) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Playback Finished",
      body: `"${songTitle}" has finished playing.`,
    },
    trigger: null,
  });
};
