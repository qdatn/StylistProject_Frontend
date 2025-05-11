import React, { useEffect, useRef, useState } from "react";
import { UserAccount } from "@src/types/UserAccount";
import { useSocket } from "@api/useSocket";
import { MessageChat } from "@src/types/Chat";
import axiosClient from "@api/axiosClient";

interface ChatBoxProps {
  user: UserAccount;
  currentUser: UserAccount;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user, currentUser }) => {
  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState<string[]>([]);
  const [messages, setMessages] = useState<MessageChat[]>([]);
  const socketRef = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  // const handleSend = () => {
  //   if (!message.trim()) return;
  //   setMessages((prev) => [...prev, message]);
  //   setMessage("");
  // };

  // fetch để lấy tất cả tin nhắn giữa hai người dùng
  const fetchMessages = async () => {
    try {
      const response = await axiosClient.getMany<MessageChat>(
        `${api}/api/chat/messages`,
        {
          user1Id: currentUser._id,
          user2Id: user._id,
        }
      );

      console.log("Fetched messages:", response);
      if (Array.isArray(response)) {
        setMessages(response);
      } else {
        setMessages([]); // Nếu không phải mảng, set lại thành mảng rỗng
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]); // Set lại khi có lỗi
    }
  };

  const handleSend = () => {
    if (!message.trim() || !socketRef.current) return;

    const msgData: MessageChat = {
      sender: currentUser._id,
      receiver: user._id,
      content: message,
    };

    socketRef.current.emit("send_message", msgData);
    setMessage(""); // Chỉ reset input
  };

  // Tự động scroll xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Nhận tin nhắn từ socket
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // Khi người dùng đăng nhập, gửi trạng thái "online"
    socket.emit("user_status", currentUser._id, "online");
    // Lưu trạng thái online vào localStorage
    localStorage.setItem(`user_${currentUser._id}_status`, "online");

    const handleReceiveMessage = (data: MessageChat) => {
      if (
        (data.sender === user._id && data.receiver === currentUser._id) ||
        (data.sender === currentUser._id && data.receiver === user._id)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    // Theo dõi trạng thái người dùng online/offline
    const handleUserStatusChange = (userId: string, status: string) => {
      if (userId === user._id) {
        setIsUserOnline(status === "online");
        localStorage.setItem(`user_${user._id}_status`, status);
      }
    };

    socket.on("user_status", handleUserStatusChange);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.emit("user_status", currentUser._id, "offline");
      socket.off("user_status", handleUserStatusChange);
      localStorage.setItem(`user_${currentUser._id}_status`, "offline");
    };
  }, [socketRef.current, user._id, currentUser._id]);

  useEffect(() => {
    const userStatus = localStorage.getItem(`user_${user._id}_status`);
    if (userStatus === "online") {
      setIsUserOnline(true);
    } else {
      setIsUserOnline(false);
    }
  }, [user._id]);

  // Fetch tin nhắn khi component mở
  useEffect(() => {
    if (user && currentUser) {
      fetchMessages();
    }
  }, [user._id, currentUser._id]);

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
          {/* <h3 className="font-semibold">{user.name}</h3> */}
          <h3 className="font-semibold">Customer Service</h3>
          <p className="text-sm text-blue-200">
            {isUserOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-100 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm p-2 rounded-md max-w-[70%] break-words ${
                msg.sender === currentUser._id
                  ? "bg-blue-100 ml-auto self-end"
                  : "bg-white self-start"
              }`}
            >
              {msg.content}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages to display.</p>
        )}
        <div ref={messagesEndRef} />
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
