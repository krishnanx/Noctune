import { useEffect } from "react";
import { useSelector } from "react-redux";
import MediaNotificationManager from "../functions/MediaNotification";

const NotificationSync = () => {
  const seek = useSelector((state) => state.data.seek); // current second
  const data = useSelector((state) => state.data.data);
  const pos = useSelector((state) => state.data.pos);   // current song index

  const duration = data?.[pos]?.duration || 0; // fallback if undefined

  useEffect(() => {
    if (typeof seek === "number" && typeof duration === "number") {
        
      // Convert seconds to milliseconds for Android
      const positionMillis = Math.floor(seek * 1000);
      const durationMillis = Math.floor(duration * 1000);

      console.error(positionMillis);
      console.error(durationMillis);
      MediaNotificationManager.updateProgress(positionMillis, durationMillis);
    }
  }, [seek ,duration, pos]);

  return null; 
};

export default NotificationSync;
