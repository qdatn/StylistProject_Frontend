import React, { useEffect, useState } from "react";
import { MessageSquare, Star, Settings } from "lucide-react";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import { UserAccount } from "@src/types/UserAccount"; // nhớ import interface
import axiosClient from "@api/axiosClient";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { MessageChat } from "@src/types/Chat";

const apiUrl = import.meta.env.VITE_API_URL;

async function fetchUser(currentUserId: string): Promise<UserAccount> {
  try {
    const response = await axiosClient.getOne<UserAccount>(
      `${apiUrl}/api/userinfo/${currentUserId}`
    );
    return response; // Assuming axiosClient.getOne returns the UserAccount directly in the response
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error; // Re-throw the error or handle it as needed
  }
}

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [messages, setMessages] = useState<MessageChat[]>([]); // Lưu tin nhắn

  const dispatch: AppDispatch = useDispatch();
  const currentUserId: string = useSelector(
    (state: RootState) => state.persist.auth.user?.user._id as string
  );

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadCurrentUser = async () => {
      const user = await fetchUser(currentUserId);
      if (user) {
        setCurrentUser(user);
      }
    };

    loadCurrentUser();
  }, [currentUserId]);

  useEffect(() => {
    if (selectedUser) {
      const loadMessages = async () => {
        try {
          const response = await axiosClient.getMany<MessageChat>(
            `${api}/api/chat/messages`,
            {
              user1Id: currentUser?._id,
              user2Id: selectedUser?._id,
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
      loadMessages();
    }
  }, [selectedUser, currentUserId]); // Khi chọn người dùng mới, load lại tin nhắn

  return (
    <div className="flex h-[82vh] w-full">
      {/* Chat list */}
      <ChatList onSelectUser={setSelectedUser} />
      {/* Chat Box */}
      <ChatBox user={selectedUser} currentUser={currentUser} messages={messages} setMessages={setMessages}/>
    </div>
  );
};

export default ChatPage;
