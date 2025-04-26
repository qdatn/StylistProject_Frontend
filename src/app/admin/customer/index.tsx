// app/admin/product/CustomerCategories.tsx
import { UserAccount, CustomerList } from "@src/types/UserAccount";
import React, { useEffect, useState } from "react";
import CustomerTable from "./CustomerTable";
import { PaginationType } from "@src/types/Pagination";
import axiosClient from "@api/axiosClient";
const urlPath = import.meta.env.VITE_API_URL;
const CustomerManagement: React.FC = () => {
  //const [Customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [customers, setCustomers] = useState<CustomerList>({
    data: [],
    pagination: {},
  });
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    pageSize: 8,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchCustomerItem = async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.getOne<CustomerList>(
        `${urlPath}/api/userinfo/`,
        //pagination params
        { page: page, limit: pageSize }
      );

      setCustomers(response);

      setPagination(response.pagination);
      // setHasMore(page < response.pagination.totalPages!);
    } catch (error) {
      alert(error);
    }
  };

  const pageSize = 8

  useEffect(() => {
    fetchCustomerItem(pagination.currentPage!, pagination.pageSize!);
  }, []);

  const refreshData = () => {
    // Fetch the updated data and set it to the state that controls `dataSource`
    fetchCustomerItem(pagination.currentPage!, pageSize!); // Your existing function to fetch updated data
  };

  const handlePageChange = (page: number) => {
    if (page <= pagination?.totalPages!) {
      setPagination({
        ...pagination,
        currentPage: page,
      });
    }
    //setPagination((prev) => ({ ...prev, currentPage: page, pageSize }));
    fetchCustomerItem(page, pageSize);
  };
  return (
    <div>
      <div className="font-semibold text-xl p-6">Customer Page</div>
      <div>
        <CustomerTable
          customers={customers}
          onDeleteSuccess={refreshData}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CustomerManagement;