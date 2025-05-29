import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatBox from "@layouts/main-layout/ChatBox";
import { UserAccount, mockUserAccounts } from "@src/types/UserAccount";
import axiosClient from "@api/axiosClient";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Dữ liệu mock cho admin (người nhận tin nhắn)
// const adminAccount: UserAccount = mockUserAccounts.find(
//   (acc: UserAccount) => acc.user.role === "admin"
// )!;

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

// const currentUser: UserAccount = fetchCurrentUser();

const UserChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminAccount, setAdminAccount] = useState<UserAccount | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const currentUserId: string = useSelector(
    (state: RootState) => state.persist.auth.user?.user._id as string
  );
  console.log("Current User ID:", currentUserId);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const user = await fetchUser(currentUserId);
      const admin = await fetchUser("680e17654a30f9d712b4cd11"); //id admin
      if (user) {
        setCurrentUser(user);
      }
      if (admin) {
        setAdminAccount(admin);
      }
    };

    loadCurrentUser();
  }, [currentUserId]);

  useEffect(() => {
    if (isOpen && !currentUserId) {
      navigate("/login");
    }
  }, [isOpen]);

  return (
    <>
      {/* Icon mở chat */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 text-white"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      {/* ChatBox */}
      {isOpen && currentUser && adminAccount && (
        <div className="fixed bottom-6 right-20 w-80 h-[450px] z-50">
          <ChatBox user={adminAccount} currentUser={currentUser} />
        </div>
      )}
    </>
  );
};

export default UserChatWidget;
