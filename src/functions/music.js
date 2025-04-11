import TrackPlayer from "react-native-track-player";

export const playYoutubeStream = async () => {
  await TrackPlayer.add({
    id: "yt-stream",
    url: "http://your-express-server.com/stream?url=https://www.youtube.com/watch?v=kXYiU_JCYtU",
    title: "Numb",
    artist: "Linkin Park",
  });
  await TrackPlayer.play();
};
