import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";
import * as Device from "expo-device";

const Websocket = () => {
    const [deviceName, setDeviceName] = useState(null);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDeviceName = async () => {
            try {
                // Fallback if getDeviceNameAsync is not available
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
        if (!deviceName) return;

        let ws;
        let reconnectTimeout;
        let pingInterval;

        const connectWebSocket = () => {
            console.log("Attempting to connect to WebSocket...");
            const id = Math.random().toString(36).slice(2, 8);
            console.log(`[${id}] Connecting WebSocket...`);
            ws = new WebSocket(Constants.expoConfig.extra.WEBSOC);


            ws.onopen = () => {
                console.log("Connected to WebSocket server");
                ws.send("Hello from React Native!");

                setReconnectAttempts(0);

                pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: "ping", device: deviceName, id: id }));
                        console.log("pinged");
                    }
                }, 25000);
            };

            ws.onmessage = (event) => {
                try {
                    const parsed = typeof event.data === "string" ? JSON.parse(event.data) : {};
                    console.log("Parsed data:", parsed);

                    // Example: dispatch something if needed
                    // dispatch(addData(parsed.new));
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

        const attemptReconnect = () => {
            if (reconnectAttempts < 5) {
                const nextAttempt = reconnectAttempts + 1;
                console.log(`Reconnect attempt ${nextAttempt}...`);
                setReconnectAttempts(nextAttempt);

                reconnectTimeout = setTimeout(connectWebSocket, 2000 * nextAttempt); // Exponential backoff
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
