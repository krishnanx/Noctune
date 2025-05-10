import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { LogBox } from 'react-native';
import { setClientID } from "../../Store/UserSlice";
import { changeProgress, setCompleted } from "../../Store/DownloadSlice";
const Websocket = () => {
    const [deviceName, setDeviceName] = useState(null);
    const dispatch = useDispatch();
    const hasConnected = useRef(false); // Prevent multiple WebSocket connections

    useEffect(() => {
        const fetchDeviceName = async () => {
            try {
                const name =
                    Device.getDeviceNameAsync && typeof Device.getDeviceNameAsync === "function"
                        ? await Device.getDeviceNameAsync()
                        : null;

                setDeviceName(
                    name || `${Device.manufacturer ?? "Unknown"} ${Device.modelName ?? "Device"}`
                );
            } catch (err) {
                console.error("Error fetching device name:", err);
                setDeviceName(`${Device.manufacturer ?? "Unknown"} ${Device.modelName ?? "Device"}`);
            }
        };

        fetchDeviceName();
    }, []);

    useEffect(() => {
        if (!deviceName || hasConnected.current) return;

        hasConnected.current = true; // Prevent reconnecting on deviceName change
        let ws;
        let reconnectTimeout;
        let pingInterval;
        const id = Math.random().toString(36).slice(2, 8);

        const connectWebSocket = () => {
            console.error(`[${id}] Connecting WebSocket...`);
            //Constants.expoConfig.extra.WEBSOC
            //ws://192.168.1.44:80
            const ws = new WebSocket(`ws://192.168.1.44:80/download-progress`);

            ws.onopen = () => {
                console.error("Connected to WebSocket server");
                dispatch(setClientID({ id: id }))
                ws.send(JSON.stringify({
                    type: "register",
                    clientId: id,
                    value: "hi"
                }));
                pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({
                            type: "ping",
                            clientId: id,
                            value: "hi"
                        }));
                        console.error("pinged");
                    }
                }, 25000);
            };

            ws.onmessage = (event) => {
                try {
                    const parsed = JSON.parse(event.data);
                    if (parsed.type == "progress") {

                        dispatch(changeProgress({ progress: parsed.value.percent, index: parsed.value.index }))
                    }
                    if (parsed.type == "file") {
                        dispatch(setCompleted(1))
                    }
                    // dispatch(addData(parsed));
                } catch (e) {
                    console.error("Non-JSON message received:", event.data);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket Error:", error.message);
                attemptReconnect();
            };

            ws.onclose = () => {
                console.error("WebSocket disconnected");
                clearInterval(pingInterval);
                attemptReconnect();
            };
        };

        let reconnectAttempts = 0;

        const attemptReconnect = () => {
            if (reconnectAttempts < 5) {
                reconnectAttempts++;
                console.error(`Reconnect attempt ${reconnectAttempts}...`);

                reconnectTimeout = setTimeout(connectWebSocket, 2000 * reconnectAttempts);
            } else {
                console.error("Max reconnection attempts reached.");
            }
        };

        connectWebSocket();

        return () => {
            clearTimeout(reconnectTimeout);
            clearInterval(pingInterval);
            ws?.close();
        };
    }, [deviceName]);

    return null;
};

export default Websocket;
