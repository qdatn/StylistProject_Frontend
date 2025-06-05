// components/NotificationPopover.tsx
import { useEffect, useState } from "react";
import { Badge, notification } from "antd";
import { IoNotificationsOutline } from 'react-icons/io5';
import { Link } from "react-router-dom";
import axiosClient from "@api/axiosClient";
import { Notification, NotificationCustomerList, NotificationList } from "@src/types/Notification";
const baseUrl = import.meta.env.VITE_API_URL;


interface NotificationCustomerProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

const NotificationCustomer = ({ isOpen, onClose, userId }: NotificationCustomerProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [archievedCount, setArchievedCount] = useState(0);

    const fetchNotifications = async () => {
        if (!userId) return;

        try {
            const response = await axiosClient.getOne<NotificationCustomerList>(`${baseUrl}/api/notification/user/${userId}`);
            setNotifications(response.data);

        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
            console.log('----------', userId, '\n', notifications)
        }
    }, [isOpen, userId]);

    const markAsRead = async (notificationId: string) => {
        console.log(notificationId)
        try {
            await axiosClient.put<Notification>(`${baseUrl}/api/notification/${notificationId}`, {
                status: "read"
            });

            const updatedList = notifications.map((noti) =>
                noti._id === notificationId ? { ...noti, status: "read" } : noti
            );
            setNotifications(updatedList);
            setArchievedCount(updatedList.filter((n) => n.status === "archieved").length);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            // Lọc danh sách các thông báo chưa đọc
            const archievedNotifications = notifications.filter(noti => noti.status === "archieved");

            // Gửi request PUT cho từng thông báo để cập nhật thành "archieved"
            await Promise.all(
                archievedNotifications.map(noti =>
                    axiosClient.put(`${baseUrl}/api/notification/${noti._id}`, {
                        status: "read"
                    })
                )
            );

            // Cập nhật danh sách notification ở frontend
            const updatedList = notifications.map(noti =>
                noti.status === "archieved" ? { ...noti, status: "read" } : noti
            );

            setNotifications(updatedList);
            setArchievedCount(0);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-500 hover:text-blue-700"
                >
                    Mark all as read
                </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        No new notifications
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notification.status === "archieved" ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => markAsRead(notification._id)}
                        >
                            <div className="flex justify-between">
                                <h4 className="font-medium text-gray-800">{notification.title}</h4>
                                {notification.status === "archieved" && (
                                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(notification.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationCustomer;
