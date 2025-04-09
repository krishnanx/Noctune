import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Constants from 'expo-constants';
const Websocket = () => {
    const [data, setData] = useState("Waiting for updates...");
    const dispatch = useDispatch();
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    useEffect(() => {
        let ws;
        let reconnectInterval = null;

        const connectWebSocket = () => {
            console.log("Attempting to connect to WebSocket...");

            ws = new WebSocket(Constants.expoConfig.extra.WEBSOC);

            ws.onopen = () => {
                console.log("Connected to WebSocket server");
                ws.send("Hello from React Native!");
                // dispatch(addStatus("idle"));

                // Reset reconnect attempts on successful connection
                setReconnectAttempts(0);

                // Send periodic pings to keep the connection alive
                const pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send("ping");
                    }
                }, 25000);

                // Cleanup ping interval on close
                ws.onclose = () => {
                    console.log("WebSocket disconnected");
                    clearInterval(pingInterval);
                    attemptReconnect();
                };
            };

            ws.onmessage = (event) => {
                console.log("Data received:", event);

                try {
                    const parsedData = JSON.parse(event.data);
                    console.log("Parsed data:", parsedData?.new);
                    //dispatch(addData(parsedData.new));
                } catch (e) {
                    console.log("Non-JSON message:", event.data);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket Error:", error);
                //dispatch(addStatus("error"));
                attemptReconnect();
            };

            // Clean up WebSocket on unmount
            return () => ws.close();
        };

        const attemptReconnect = () => {
            if (reconnectAttempts < 5) {
                console.log(`Reconnect attempt ${reconnectAttempts + 1}...`);
                setReconnectAttempts(reconnectAttempts + 1);

                reconnectInterval = setTimeout(() => {
                    connectWebSocket();
                }, 2000 * reconnectAttempts); // Exponential backoff
            } else {
                console.error("Max reconnection attempts reached.");
            }
        };

        connectWebSocket();

        return () => clearTimeout(reconnectInterval);
    }, []);

    return <></>;
};

export default Websocket;
