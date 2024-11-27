// app/admin/product/ProductCategories.tsx
import React, { useEffect, useState } from "react";
import { Product, ProductList } from "@src/types/Product";
import mockProducts from "@src/types/Product"; // Import hàm cập nhật sản phẩm
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

  useEffect(() => {
    fetchProductItem(pagination.currentPage!, pagination.pageSize!);
  }, []);
  const refreshData = () => {
    // Fetch the updated data and set it to the state that controls `dataSource`
    fetchProductItem(pagination.currentPage!, pagination.pageSize!); // Your existing function to fetch updated data
  };

  return (
    <div>
      <div className="font-semibold text-xl p-6"></div>
      <div>
        <StorageTable products={products} onDeleteSuccess={refreshData} />
      </div>
    </div>
  );
};

export default StoragePage;