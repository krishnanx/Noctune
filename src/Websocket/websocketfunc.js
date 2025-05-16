let socket = null;

export const initWebSocket = (url) => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(url);
    }
    return socket;
};

export const getWebSocket = () => socket;
