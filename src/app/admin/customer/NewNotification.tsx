// app/admin/product/ProductList.tsx
import NotificationForm from "@components/NotificationForm";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notification } from "@src/types/Notification";
import axiosClient from "@api/axiosClient";
import { notification } from "antd";

const baseUrl = import.meta.env.VITE_API_URL;

const NewNotification: React.FC = () => {
  //const [notice, setNotifications] = useState<Notification[]>();
  const navigate = useNavigate();
  const addNotificationToDB = async (notice: Notification) => {
    try {
      const addNotification = axiosClient.post<Notification>(
        `${baseUrl}/api/notification`,
        notice
      );
    } catch (error) {
      alert(error);
    }
  };
  const handleAddNotification = (newNotification: Partial<Notification>) => {
    const notificationToAdd: Notification = { ...newNotification, id: newNotification._id } as Notification;
    addNotificationToDB(notificationToAdd);
    notification.success({
      message: "Discount added successfully!",
      description: "",
      placement: "topRight",
      duration: 2,
    });
    navigate("/admin/notification/list", { state: { refresh: true } }); // Chuyển hướng về danh sách sản phẩm
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
