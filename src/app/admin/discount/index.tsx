// app/admin/discount/DiscountCategories.tsx
import mockDiscounts, { Discount, DiscountList } from "@src/types/Discount";
import React, { useEffect, useState } from "react";
import DiscountTable from "./DiscountTable";
import { PaginationType } from "@src/types/Pagination";
import axiosClient from "@api/axiosClient";

const urlPath = import.meta.env.VITE_API_URL;
const DiscountManagement: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountList>({
    data: [],
    pagination: {},
  });
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    pageSize: 8,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchDiscountItem = async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.getOne<DiscountList>(
        `${urlPath}/api/discount/`,
        //pagination params
        { page: page, limit: pageSize }
      );

      setDiscounts(response);

      setPagination(response.pagination);
      // setHasMore(page < response.pagination.totalPages!);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchDiscountItem(pagination.currentPage!, pagination.pageSize!);
  }, []);

  // useEffect(() => {
  //   console.log("discount", discounts);
  //   console.log("pagination", pagination);
  // }, [discounts]);
  const refreshData = () => {
    // Fetch the updated data and set it to the state that controls `dataSource`
    fetchDiscountItem(pagination.currentPage!, pagination.pageSize!); // Your existing function to fetch updated data
  };

  return (
    <div>
      <div className="font-semibold text-xl p-6">Discount Page</div>
      <div>
        <DiscountTable
          discounts={discounts}
          onDeleteSuccess={refreshData} 
        />
      </div>
    </div>
  );
};

export default DiscountManagement;