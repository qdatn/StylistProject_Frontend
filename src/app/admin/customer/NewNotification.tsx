// app/admin/product/ProductList.tsx
import NotificationForm from "@components/NotificationForm";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notification } from "@src/types/Notification";
import axiosClient from "@api/axiosClient";

const baseUrl = import.meta.env.VITE_API_URL;

const NewNotification: React.FC = () => {
 // const [categories, setNotifications] = useState<Notification[]>(mockNotifications);
  const navigate = useNavigate();
  const addNotificationToDB = async (notice: Notification) => {
    try {
      const addNotification = axiosClient.post<Notification>(
        `${baseUrl}/api/notice`,
       notice
      );
    } catch (error) {
      alert(error);
    }
  };
  const handleAddNotification = (newNotification: Partial<Notification>) => {
    const categoryToAdd: Notification = { ...newNotification, id: newNotification._id } as Notification;
    //setNotifications((prevNotification) => [...prevNotification, categoryToAdd]);
    addNotificationToDB(categoryToAdd);
    alert('Add successfully');
    navigate("/admin/notification/list"); // Chuyển hướng về danh sách sản phẩm
  };
  const handelCancel = () => {
    navigate("/admin/notification/list"); //
  };

  return (
    <div>
      {/* <div className="font-semibold text-xl p-6">New Product</div> */}
      
      {/* Notification Form */}
      <div className="w-full">
        <NotificationForm
        onSave={handleAddNotification}
        onCancel={handelCancel} 
        type="add"
        />
      </div>
    </div>
  );
};

export default NewNotification;
