import React, { useEffect, useRef, useState } from "react";
import { UserAccount } from "@src/types/UserAccount";
import { useSocket } from "@api/useSocket";
import { MessageChat, ProductRecommend } from "@src/types/Chat";
import axiosClient from "@api/axiosClient";
import { useNavigate } from "react-router-dom";

interface ChatBoxProps {
  user: UserAccount;
  currentUser: UserAccount;
}

const BOT_ID = "bot";

const ChatBox: React.FC<ChatBoxProps> = ({ user, currentUser }) => {
  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState<string[]>([]);
  const [messages, setMessages] = useState<MessageChat[]>([]);
  const socketRef = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  const currentUserId = currentUser.user._id;
  const userId = user.user._id;

  const navigate = useNavigate();
  // const handleSend = () => {
  //   if (!message.trim()) return;
  //   setMessages((prev) => [...prev, message]);
  //   setMessage("");
  // };

  // fetch để lấy tất cả tin nhắn giữa hai người dùng
  const fetchMessages = async () => {
    try {
      // Lần 1: Lấy tin nhắn giữa currentUserId và admin
      const response1 = await axiosClient.getMany<MessageChat>(
        `${api}/api/chat/messages`,
        {
          user1Id: currentUserId,
          user2Id: userId,
        }
      );

      // Lần 2: Lấy tin nhắn giữa currentUserId và BOT
      const response2 = await axiosClient.getMany<MessageChat>(
        `${api}/api/chat/messages`,
        {
          user1Id: currentUserId,
          user2Id: BOT_ID,
        }
      );

      console.log("Fetched messages with user:", response1);
      console.log("Fetched messages with bot:", response2);

      // Gộp và sắp xếp tin nhắn nếu muốn
      const allMessages = [
        ...(Array.isArray(response1) ? response1 : []),
        ...(Array.isArray(response2) ? response2 : []),
      ];

      // Sắp xếp tin nhắn theo thời gian gửi
      allMessages.sort(
        (a: MessageChat, b: MessageChat) =>
          new Date(a.createdAt ?? "").getTime() -
          new Date(b.createdAt ?? "").getTime()
      );

      if (Array.isArray(allMessages)) {
        setMessages(allMessages);
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
      sender: currentUserId,
      receiver: userId,
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
    socket.emit("user_status", currentUserId, "online");
    // Lưu trạng thái online vào localStorage
    localStorage.setItem(`user_${currentUserId}_status`, "online");

    const handleReceiveMessage = (data: MessageChat) => {
      if (
        (data.sender === userId && data.receiver === currentUserId) ||
        (data.sender === currentUserId && data.receiver === userId)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    // Theo dõi trạng thái người dùng online/offline
    const handleUserStatusChange = (userId: string, status: string) => {
      if (userId === userId) {
        setIsUserOnline(status === "online");
        localStorage.setItem(`user_${userId}_status`, status);
      }
    };

    socket.on("user_status", handleUserStatusChange);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.emit("user_status", currentUserId, "offline");
      socket.off("user_status", handleUserStatusChange);
      localStorage.setItem(`user_${currentUserId}_status`, "offline");
    };
  }, [socketRef.current, userId, currentUserId]);

  useEffect(() => {
    const userStatus = localStorage.getItem(`user_${userId}_status`);
    if (userStatus === "online") {
      setIsUserOnline(true);
    } else {
      setIsUserOnline(false);
    }
  }, [userId]);

  // Fetch tin nhắn khi component mở
  useEffect(() => {
    if (user && currentUser) {
      fetchMessages();
    }
  }, [userId, currentUserId]);

  const handleSuggestedPrompt = async (prompt: string) => {
    if (!currentUser?.body_shape || currentUser.body_shape === "No Provided") {
      navigate("/body-shape");
      return;
    } else {
      try {
        // Gửi prompt như một tin nhắn từ currentUser đến bot
        const userMessage: MessageChat = {
          sender: currentUserId,
          receiver: BOT_ID,
          content: prompt,
        };

        // Gửi tin nhắn lên socket
        socketRef.current?.emit("send_message", userMessage);

        // // Lưu tin nhắn vào DB (giả định API là POST /api/chat/messages)
        // await axiosClient.post(`${api}/api/chat/messages`, userMessage);

        // Thêm vào UI
        setMessages((prev) => [...prev, userMessage]);

        // Gọi API gợi ý sản phẩm (response là 1 chuỗi hoặc object chứa content)
        const response = await axiosClient.getOne<{ content: string }>(
          `${api}/api/chat/recommend/${currentUserId}`
        );

        // Nếu response.content là chuỗi JSON, parse ra:
        let products: ProductRecommend[] = [];

        try {
          // const parsed = JSON.parse(response.content);
          if (Array.isArray(response.content)) {
            products = response.content;
          }
        } catch (e) {
          console.error("Failed to parse product recommendations:", e);
        }

        const botMessage: MessageChat = {
          sender: BOT_ID,
          receiver: currentUserId,
          content: "__RECOMMEND__", // để đánh dấu đây là message đặc biệt
          recommendProducts: products,
        };

        // Thêm tin nhắn bot vào UI
        setMessages((prev) => [...prev, botMessage]);

        //  // Gửi tin nhắn lên socket của bot lưu vào DB
        socketRef.current?.emit("send_message", botMessage);
        // await axiosClient.post(`${api}/api/chat/messages`, botMessage);
      } catch (err) {
        console.error("Error sending suggested prompt:", err);
      }
    }
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
                msg.sender === currentUserId
                  ? "bg-blue-100 ml-auto self-end"
                  : "bg-white self-start"
              }`}
            >
              {/* Kiểm tra nếu là dạng gợi ý sản phẩm */}
              {msg.content === "__RECOMMEND__" && msg.recommendProducts ? (
                <div className="space-y-2">
                  {msg.recommendProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="p-3 border border-gray-300 rounded-md shadow-sm hover:shadow-md transition bg-slate-50"
                    >
                      <a
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h3 className="font-semibold text-blue-600 hover:underline">
                          {product.name}
                        </h3>
                        {/* <p className="text-gray-700 text-sm">
                          {product.description}
                        </p> */}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages to display.</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Suggested Prompts */}
      <div className="p-3 border-t bg-white flex flex-wrap gap-2">
        {["Which cloth suitable with my bodyshape?"].map((prompt, index) => (
          <button
            key={index}
            onClick={() => handleSuggestedPrompt(prompt)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs"
          >
            {prompt}
          </button>
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
