// app/admin/notification/NotificationCategories.tsx
import { Notification, NotificationList } from "@src/types/Notification";
import React, { useEffect, useState } from "react";
import NotificationTable from "./NotificationTable";
import { PaginationType } from "@src/types/Pagination";
import axiosClient from "@api/axiosClient";

const urlPath = import.meta.env.VITE_API_URL;
const NotificationManagement: React.FC = () => {
  const [notices, setNotifications] = useState<NotificationList>({
    data: [],
    pagination: {},
  });
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    pageSize: 8,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchNotificationItem = async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.getOne<NotificationList>(
        `${urlPath}/api/notification/`,
        //pagination params
        { page: page, limit: pageSize }
      );

      setNotifications(response);

      setPagination(response.pagination);
      // setHasMore(page < response.pagination.totalPages!);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchNotificationItem(pagination.currentPage!, pagination.pageSize!);
  }, []);

  useEffect(() => {
    console.log("notice", notices);
    console.log("pagination", pagination);
  }, [notices]);

  const pageSize =8
  const refreshData = () => {
    // Fetch the updated data and set it to the state that controls `dataSource`
    fetchNotificationItem(pagination.currentPage!, pageSize!); // Your existing function to fetch updated data
  };
  const handlePageChange = (page: number) => {
    if (page <= pagination?.totalPages!) {
      setPagination({
        ...pagination,
        currentPage: page,
      });
    }
    //setPagination((prev) => ({ ...prev, currentPage: page, pageSize }));
    fetchNotificationItem(page, pageSize);
  };

  return (
    <div>
      <div className="font-semibold text-xl p-6">Notification Page</div>
      <div>
        <NotificationTable
          notices={notices}
          onDeleteSuccess={refreshData}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default NotificationManagement;