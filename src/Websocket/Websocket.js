import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";
import * as Device from "expo-device";

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
                console.log("Error fetching device name:", err);
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
            console.log(`[${id}] Connecting WebSocket...`);
            //Constants.expoConfig.extra.WEBSOC
            //ws://192.168.1.48:80
            ws = new WebSocket(Constants.expoConfig.extra.WEBSOC);

            ws.onopen = () => {
                console.log("Connected to WebSocket server");
                ws.send(`Hello from React Native ${id}!`);

                pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: "ping", device: deviceName, id }));
                        console.log("pinged");
                    }
                }, 25000);
            };

            ws.onmessage = (event) => {
                try {
                    const parsed = typeof event.data === "string" ? JSON.parse(event.data) : {};
                    console.log("Parsed data:", parsed);
                    // dispatch(addData(parsed));
                } catch (e) {
                    console.log("Non-JSON message received:", event.data);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket Error:", error.message);
                attemptReconnect();
            };

            ws.onclose = () => {
                console.log("WebSocket disconnected");
                clearInterval(pingInterval);
                attemptReconnect();
            };
        };

        let reconnectAttempts = 0;

        const attemptReconnect = () => {
            if (reconnectAttempts < 5) {
                reconnectAttempts++;
                console.log(`Reconnect attempt ${reconnectAttempts}...`);

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
