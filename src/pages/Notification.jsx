// import PushNotification from 'react-native-push-notification';

// // List of quotes/messages
// const motivationalQuotes = [
//   "Good morning! Start your day with beautiful music 🎶",
//   "Let music lift your mood today! 💖",
//   "Discover a new song and feel the vibe 🔥",
//   "Feeling low? Music is the cure 🎧",
//   "Brighten your day with your favorite beats 🎵",
//   "Smile and listen to something soothing today 😊",
// ];

// // Function to schedule a notification
// export const scheduleNotification = () => {
//   const randomQuote =
//     motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

//   PushNotification.localNotificationSchedule({
//     channelId: 'noctune-channel',   // Must match the ID from your App.jsx
//     title: "🎵 Noctune Reminder",
//     message: randomQuote,
//     date: new Date(Date.now() + 10 * 1000),  // Schedules 10 seconds later (change as needed)
//     allowWhileIdle: true,
//     playSound: true,
//     soundName: 'default',
//     importance: 'high',
//   });

//   console.log("Notification scheduled with message:", randomQuote);
// };
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
} from 'react-native';

const Notification = () => {
  const [progress, setProgress] = useState(0);

  // Simulate download progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(timer);
          return 1;
        }
        return prev + 0.01;
      });
    }, 100); // update every 100ms

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Notification</Text>

      <Image
       // source={require('../assets/song.jpg')} // ✅ Replace with your actual image path
        style={styles.image}
      />

      

      <Text style={styles.percent}>{Math.round(progress * 100)}%</Text>
      <Text style={styles.message}>
        {progress >= 1 ? 'Songs has been downloaded' : 'Downloading...'}
      </Text>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 20,
  },
  progress: {
    width: '85%',
    marginTop: 5,
  },
  percent: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 16,
  },
  message: {
    color: '#aaa',
    fontSize: 15,
    marginTop: 15,
  },
});