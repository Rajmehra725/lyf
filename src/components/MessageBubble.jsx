import React from "react";

const MessageBubble = ({ message, currentUser }) => {
  const isSender = message.sender._id === currentUser._id;
  return (
    <div style={{ display: "flex", justifyContent: isSender ? "flex-end" : "flex-start", marginBottom: "0.5rem" }}>
      <div style={{
        maxWidth: "60%",
        padding: "0.5rem 1rem",
        borderRadius: "20px",
        background: isSender ? "#0b93f6" : "#e5e5ea",
        color: isSender ? "white" : "black"
      }}>
        {message.text}
        {message.media?.map((url, i) => (
          <img key={i} src={url} alt="media" style={{ maxWidth: "100%", borderRadius: "10px", marginTop: "0.3rem" }} />
        ))}
      </div>
    </div>
  );
};

export default MessageBubble;
