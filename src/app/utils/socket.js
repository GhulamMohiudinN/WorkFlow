import { io } from "socket.io-client";

const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
export const socket = io(backendUrl, {
  autoConnect: true,
});
