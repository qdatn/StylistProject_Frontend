import React, { useEffect, useRef, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { UserAccount } from "@src/types/UserAccount";
import { MessageChat } from "@src/types/Chat";
import { useSocket } from "@api/useSocket";

interface ChatBoxProps {
  user: UserAccount | null;
  currentUser: UserAccount | null;
  messages: MessageChat[];
  setMessages: React.Dispatch<React.SetStateAction<MessageChat[]>>;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  user,
  currentUser,
  messages,
  setMessages,
}) => {
  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState<MessageChat[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const socketRef = useSocket();
  const socketUrl = import.meta.env.VITE_API_URL;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !currentUser) return;

    // Khi người dùng đăng nhập, gửi trạng thái "online"
    socket.emit("user_status", currentUser._id, "online");
    // Lưu trạng thái online vào localStorage
    localStorage.setItem(`user_${currentUser._id}_status`, "online");

    const handleMessage = (newMessage: MessageChat) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("receive_message", handleMessage);

    // Theo dõi trạng thái người dùng online/offline
    const handleUserStatusChange = (userId: string, status: string) => {
      if (userId === user?._id) {
        setIsUserOnline(status === "online");
        localStorage.setItem(`user_${user._id}_status`, status);
      }
    };

    socket.on("user_status", handleUserStatusChange);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.emit("user_status", currentUser._id, "offline");
      socket.off("user_status", handleUserStatusChange);
      localStorage.setItem(`user_${currentUser._id}_status`, "offline");
    };
  }, [socketRef, currentUser]);

  useEffect(() => {
    const userStatus = localStorage.getItem(`user_${user?._id}_status`);
    if (userStatus === "online") {
      setIsUserOnline(true);
    } else {
      setIsUserOnline(false);
    }
  }, [user?._id]);

  const handleDelete = () => {
    // Logic to delete the message
    setShowPopup(false); // Close the pop-up after deleting
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-200 text-lg">
        Choose someone to start messaging
      </div>
    );
  }

  const handleSend = () => {
    if (!message.trim() || !currentUser || !user) return;

    const newMessage: MessageChat = {
      sender: currentUser._id,
      receiver: user._id,
      content: message,
    };

    socketRef.current?.emit("send_message", newMessage);
    setMessage("");
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-200 relative ml-2 rounded-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm rounded-t-sm">
        <div className="flex items-center gap-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <h2 className="font-semibold text-lg">{user.name}</h2>
        </div>
        <div className="flex gap-4 text-gray-600">
          <button
            className="flex items-center space-x-2 hover:text-gray-800"
            onClick={() => setShowPopup(!showPopup)}
          >
            <p className="text-sm">Delete message</p>
            <IoTrashOutline className="text-2xl" />
          </button>
          {showPopup && (
            <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg p-4 border w-40">
              <p className="text-sm">Are you sure you want to delete?</p>
              <div className="mt-2 flex justify-between">
                <button
                  onClick={handleDelete}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 text-sm hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm p-2 rounded-md max-w-[70%] break-words ${
                msg.sender === currentUser?._id
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
      <div className="flex items-center p-4 border-t bg-white gap-2 rounded-b-sm">
        <input
          type="text"
          placeholder="Enter message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
