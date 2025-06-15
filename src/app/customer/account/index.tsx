import React, { useEffect, useState } from "react";
import MenuSidebar from "./MenuSidebar";
import AccountDetails from "./AccountDetail";
import { UserAccount } from "@src/types/UserAccount";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import axiosClient from "@api/axiosClient";
import { notification } from "antd";
import LoadingSpinner from "@components/loading";

const AccountPage = () => {
  const urlPath = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<UserAccount | null>(null);
  const userItem = useSelector((state: RootState) => state.persist.auth);
  const userId: string = userItem.user?.user._id || "";

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        try {
          const response = await axiosClient.getOne<UserAccount>(
            `${urlPath}/api/userinfo/${userId}`
          );
          console.log(response);
          setUser(response);
        } catch (error) {
          alert(error);
        }
      }
    };

    fetchUserInfo();
  }, [userId, urlPath]);

  // Update user info in database
  const handleUpdateUser = async (updatedUser: Partial<UserAccount>) => {
    if (!userId) return;

    try {
      const response = await axiosClient.put<UserAccount>(
        `${urlPath}/api/userinfo/${userId}`,
        updatedUser
      );
      setUser(response); // Cập nhật thông tin user trong state
      notification.success({
        message: "Order updated successfully!",
        description: "You have successfully logged in.",
        placement: "topRight",
        duration: 2,
      });
    } catch (error) {
      alert(error);
    }
  };
  if (!user) {
    return <LoadingSpinner />; // Có thể thay thế bằng spinner hoặc message loading khác
  }

  // Render component
  return (
    <div className="container mx-auto p-10 max-w-7xl flex">
      <MenuSidebar user={user} />
      <AccountDetails
        initialUser={user} // Add '!' to assert that 'user' is not null
        onSave={handleUpdateUser}
      />
    </div>
  );
};

export default AccountPage;
