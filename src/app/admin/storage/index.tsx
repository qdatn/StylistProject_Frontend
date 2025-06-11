// app/admin/product/ProductCategories.tsx
import React, { useEffect, useState } from "react";
import { Product, ProductList } from "@src/types/new/Product";
import StorageTable from "./StorageTable";
import { PaginationType } from "@src/types/Pagination";
import axiosClient from "@api/axiosClient";

const urlPath = import.meta.env.VITE_API_URL;

const StoragePage: React.FC = () => {
  const [products, setProducts] = useState<ProductList>({
    data: [],
    pagination: {},
  });
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    pageSize: 8,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchProductItem = async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.getOne<ProductList>(
        `${urlPath}/api/product/`,
        //pagination params
        { page: page, limit: pageSize }
      );

      setProducts(response);

      setPagination(response.pagination);
      // setHasMore(page < response.pagination.totalPages!);
    } catch (error) {
      alert(error);
    }
  };
  const pageSize =8 
  useEffect(() => {
    fetchProductItem(pagination.currentPage!, pagination.pageSize!);
  }, []);
  const refreshData = () => {
    // Fetch the updated data and set it to the state that controls `dataSource`
    fetchProductItem(pagination.currentPage!, pageSize!); // Your existing function to fetch updated data
  };
  const handlePageChange = (page: number) => {
    if (page <= pagination?.totalPages!) {
      setPagination({
        ...pagination,
        currentPage: page,
      });
    }
    //setPagination((prev) => ({ ...prev, currentPage: page, pageSize }));
    fetchProductItem(page, pageSize);
  };
  return (
    <div>
      <div className="font-semibold text-xl p-6"></div>
      <div>
        <StorageTable 
        products={products} 
        onDeleteSuccess={refreshData}
        pagination={pagination}
        onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default StoragePage;