import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NotificationForm from "@components/NotificationForm";
import { Notification } from "@src/types/Notification";
import axiosClient from "@api/axiosClient";
import { notification } from "antd";

const baseUrl = import.meta.env.VITE_API_URL;
const EditNotification: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID danh mục từ URL
  const navigate = useNavigate();
  const location = useLocation();
  const notificationFromState = location.state?.notice || null;

  const [notice, setNotification] = useState<Notification | null>(notificationFromState);

  const updateNotificationInDB = async (updatedNotification: Notification) => {
    try {
      const updateNotification = await axiosClient.put<Notification>(
        `${baseUrl}/api/notification/${id}`,
        updatedNotification
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const handleUpdateNotification = (updatedNotification: Partial<Notification>) => {
    if (notice) {
      // Đảm bảo rằng _id luôn có giá trị và không bị mất khi cập nhật
      const updatedNotificationWithId: Notification = {
        ...notice,
        ...updatedNotification,
        _id: notice._id, // Đảm bảo rằng _id không bị mất
      };

      // Cập nhật lại danh mục trong state
      setNotification(updatedNotificationWithId);
      updateNotificationInDB(updatedNotificationWithId);
      // Thông báo thành công
      console.log("Updated Notification:", updatedNotificationWithId);
      notification.success({
        message: "Notification updated successfully!",
        description: "",
        placement: "topRight",
        duration: 2,
      });

      // Chuyển hướng về trang danh sách danh mục
      navigate("/admin/notification/list");
    }
  };

  const handleCancel = () => {
    navigate("/admin/notification/list"); // Quay lại danh sách danh mục
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* <h1 className="font-semibold text-xl p-6">Notification Information</h1> */}
      {notice ? (
        <NotificationForm
          initialNotification={notice}
          onSave={handleUpdateNotification}
          onCancel={handleCancel}
          type="edit"
        />
      ) : (
        <p>Loading notification...</p>
      )}
    </div>
  );
};

export default EditNotification;
