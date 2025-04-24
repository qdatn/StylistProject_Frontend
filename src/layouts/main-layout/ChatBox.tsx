import React, { useState } from "react";
import { UserAccount } from "@src/types/UserAccount";

interface ChatBoxProps {
  user: UserAccount; 
}

const ChatBox: React.FC<ChatBoxProps> = ({ user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, message]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden border">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-blue-600 text-white">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.name}
          className="w-9 h-9 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-blue-200">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-100 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="bg-blue-100 text-sm p-2 rounded-md self-end max-w-[70%] ml-auto"
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex items-center gap-2 bg-white">
        <input
          type="text"
          placeholder="Enter message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-md px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
