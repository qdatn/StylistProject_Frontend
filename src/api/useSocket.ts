import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";

const SOCKET_URL = import.meta.env.VITE_API_URL;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef;
};
