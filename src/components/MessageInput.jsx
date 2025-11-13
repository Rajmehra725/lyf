import React, { useState } from "react";
import { sendMessage } from "../api/chatApi";
import { useSocket } from "../../src/context/SocketContext";

const MessageInput = ({ activeUser, currentUser, setMessages }) => {
  const [text, setText] = useState("");
  const socket = useSocket();

  const handleSend = async () => {
    if (!text.trim()) return;

    const formData = new FormData();
    formData.append("receiverId", activeUser._id);
    formData.append("text", text);

    const res = await sendMessage(formData);
    const newMsg = res.data.data;

    setMessages((prev) => [...prev, newMsg]);

    // Emit to socket
    if (socket) {
      socket.emit("sendMessage", { senderId: currentUser._id, receiverId: activeUser._id, message: newMsg });
    }

    setText("");
  };

  return (
    <div style={{ display: "flex", padding: "0.5rem" }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1, padding: "0.5rem", borderRadius: "20px", border: "1px solid #ccc" }}
      />
      <button onClick={handleSend} style={{ marginLeft: "0.5rem" }}>Send</button>
    </div>
  );
};

export default MessageInput;
