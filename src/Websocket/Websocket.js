import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { LogBox, Alert, Platform } from "react-native";

import {
  addData,
  changeProgress,
  setCompleted,
} from "../../Store/DownloadSlice";
import {
  createFile,
  writeFile,
  getFileContent,
  openDocumentTree,
} from "react-native-saf-x";
import { saveFile } from "../functions/SaveFile";
import { initWebSocket, getWebSocket } from "./websocketfunc";
// Action to set the download path in your Redux store
// You'll need to add this to your DownloadSlice.js
// export const setDownloadPath = createSlice({
//   name: 'download',
//   ...
//   reducers: {
//     ...
//     setPath: (state, action) => {
//       state.path = action.payload;
//     },
//   },
// });

const Websocket = () => {
  const [deviceName, setDeviceName] = useState(null);
  const dispatch = useDispatch();
  // Prevent multiple WebSocket connections
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [isDownloading, setIsdownloading] = useState(false);
  const { songs, status, completed, path } = useSelector(
    (state) => state.download
  );
  const wsRef = useRef(null);

  // Process the queue with a specific path
  const processQueueWithPath = async (folderPath) => {
    console.warn("Processing queue with path:", folderPath);
    if (isDownloading || downloadQueue.length === 0) return;

    setIsdownloading(true);
    const { encodedData, onComplete } = downloadQueue[0];
    try {
      console.warn("Using path for download:", folderPath);

      // Pass the songs array from your Redux state
      await handleBase64Data({
        folderUri: folderPath,
        encodedData: encodedData,
        songs: songs, // Make sure to pass the songs array
      });

      dispatch(setCompleted(1));
      onComplete(); // Callback to notify when the download is complete
    } catch (error) {
      console.error("Error during download:", error);

      // If permission error, try to request permission again
      if (error.message && error.message.includes("Permission Denial")) {
        requestStoragePermission();
        return; // Don't remove from queue yet
      }
    } finally {
      setIsdownloading(false);
      setDownloadQueue((prevQueue) => prevQueue.slice(1));
    }
  };

  // Standard process queue that uses the current path
  const processQueue = async () => {
    // Use the selected path if available, otherwise fall back to Redux path
    const currentPath = path;

    console.warn("Process queue with current path:", currentPath);

    processQueueWithPath(currentPath);
  };

  const handleBase64Data = async ({ folderUri, encodedData, songs }) => {
    try {
      console.warn("Starting handleBase64Data with folderUri:", folderUri);

      // Check if folderUri has a trailing space - this might cause the issue
      if (folderUri.endsWith(" ")) {
        console.warn("Folder URI has trailing space, trimming it");
        folderUri = folderUri.trim();
      }

      // Validate folderUri
      if (!folderUri || folderUri.trim() === "") {
        console.error("Invalid folder URI");
        throw new Error("Invalid folder URI");
      }

      // Validate encodedData
      if (
        !encodedData ||
        !encodedData.data ||
        typeof encodedData.index !== "number"
      ) {
        console.error("Invalid encoded data provided:");
        return null;
      }

      // // Validate songs array
      // if (!Array.isArray(songs) || !songs[encodedData.index]) {
      //     console.error('Invalid songs data or index:');

      //     // Create a fallback title if songs data is not available
      //     const fallbackFileName = `download_${encodedData.index}_${Date.now()}.mp3`;
      //     return await saveFile(folderUri, fallbackFileName, encodedData.data);
      // }

      // Get song title
      const song = songs[encodedData.index];
      if (!song.title) {
        console.warn("Song has no title, using fallback");
        // Use fallback title if missing
        song.title = `song_${encodedData.index}`;
      }

      // Generate a safe filename from the song title
      const originalTitle = song.title;
      // Replace characters that might cause issues in filenames
      const safeTitle = originalTitle.replace(/[^\w\s.-]/g, "_");
      // Add timestamp to ensure uniqueness
      const fileName = `${safeTitle}_${Date.now()}`;

      return await saveFile({
        path: path,
        fileName: fileName,
        base64Data: encodedData.data,
      });
    } catch (error) {
      console.error("Error in handleBase64Data:", error);
      throw error; // Re-throw to handle in the calling function
    }
  };

  // Add download task to the queue
  const addDownloadTask = (encodedData, onComplete) => {
    console.warn("reached addDownloadTask");

    // Add to the queue
    setDownloadQueue((prev) => {
      const newQueue = [...prev, { encodedData, onComplete }];
      return newQueue;
    });
  };

  // Monitor queue changes
  useEffect(() => {
    if (downloadQueue.length > 0 && !isDownloading) {
      console.warn("Queue has items and not downloading, starting process");
      processQueue(); // Process queue when items are added and not currently downloading
    }
  }, [downloadQueue, isDownloading]);

  useEffect(() => {
    const fetchDeviceName = async () => {
      try {
        const name =
          Device.getDeviceNameAsync &&
          typeof Device.getDeviceNameAsync === "function"
            ? await Device.getDeviceNameAsync()
            : null;
        setDeviceName(
          name ||
            `${Device.manufacturer ?? "Unknown"} ${
              Device.modelName ?? "Device"
            }`
        );
      } catch (err) {
        console.error("Error fetching device name:", err);
        setDeviceName(
          `${Device.manufacturer ?? "Unknown"} ${Device.modelName ?? "Device"}`
        );
      }
    };
    fetchDeviceName();
  }, []);

  useEffect(() => {
    // hasConnected.current = true; // Prevent reconnecting on deviceName change
    // let ws;
    let reconnectTimeout;
    let pingInterval;
    const id = Math.random().toString(36).slice(2, 8);

    const connectWebSocket = () => {
      console.error(`[${id}] Connecting WebSocket...`);
      //Constants.expoConfig.extra.WEBSOC
      //ws://192.168.1.44:80

      const ws = getWebSocket();
      wsRef.current = ws;
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "ping",
              clientId: id,
              value: "hi",
            })
          );
          console.error("pinged");
        }
      }, 25000);
      wsRef.current.onmessage = (event) => {
        try {
          console.error("message!!");
          const parsed = JSON.parse(event.data);
          if (parsed.type == "progress") {
            dispatch(
              changeProgress({
                progress: parsed.value.percent,
                index: parsed.value.index,
              })
            );
          }
          if (parsed.type == "file") {
            console.warn("file is ready");

            // We have a path, proceed normally
            console.warn(path);
            console.error("starting....");
            addDownloadTask(parsed.value, () => {
              console.warn("Download Complete");
            });
            dispatch(addData({ final: parsed.value }));
          }
        } catch (e) {
          console.error("Non-JSON message received:", event.data);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket Error:", error.message);
        attemptReconnect();
      };

      wsRef.current.onclose = (event) => {
        console.error(
          `WebSocket closed: code=${event.code} reason=${event.reason} wasClean=${event.wasClean}`
        );
        clearInterval(pingInterval);
        attemptReconnect();
      };
    };

    let reconnectAttempts = 0;
    const attemptReconnect = () => {
      if (reconnectAttempts < 5) {
        reconnectAttempts++;
        console.error(`Reconnect attempt ${reconnectAttempts}...`);
        reconnectTimeout = setTimeout(
          connectWebSocket,
          2000 * reconnectAttempts
        );
      } else {
        console.error("Max reconnection attempts reached.");
      }
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimeout);
      clearInterval(pingInterval);
    };
  }, [deviceName]);

  return null;
};

export default Websocket;
