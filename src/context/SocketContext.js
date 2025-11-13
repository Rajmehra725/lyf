import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://raaznotes-backend.onrender.com");
    setSocket(newSocket);

    // Join user room
    if (userId) newSocket.emit("join", userId);

    return () => newSocket.disconnect();
  }, [userId]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
