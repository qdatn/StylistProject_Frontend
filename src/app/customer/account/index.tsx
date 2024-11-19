import React, { useEffect, useState } from "react";
import MenuSidebar from "./MenuSidebar";
import AccountDetails from "./AccountDetail";
import { UserAccount } from "@src/types/UserAccount";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import axiosClient from "@api/axiosClient";

const AccountPage = () => {
  const urlPath = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<UserAccount | null>(null);

  // useEffect(() => {
  //   const userID = localStorage.getItem('userID');
  //   if (userID) {
  //     fetch(`/api/user/${userID}`)
  //       .then((response) => response.json())
  //       .then((data) => setUser(data))
  //       .catch(() => setUser(null));
  //   } else {
  //     setUser(null);
  //   }
  // }, []);

  const userItem = useSelector((state: RootState) => state.auth);
  const userId: string = userItem.auth.user?.user._id || "";

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        try {
          const response = await axiosClient.getOne<UserAccount>(
            `${urlPath}/api/userinfo/${userId}`
          );

          setUser(response);
          console.log(response);
          console.log("user:");
        } catch (error) {
          alert(error);
        }
      }
    };

    fetchUserInfo();
  }, [userId, urlPath]);

  return (
    <div className="container mx-auto p-10 max-w-7xl flex">
      <MenuSidebar user={user} />
      <AccountDetails user={user} />
    </div>
  );
};

export default AccountPage;
