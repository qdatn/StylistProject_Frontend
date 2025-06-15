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
  // Thêm state để theo dõi trạng thái filter
  const [showActiveProducts, setShowActiveProducts] = useState<boolean>(true);

  const fetchProductItem = async (page: number, pageSize: number, status: boolean) => {
    try {
      const response = await axiosClient.getOne<ProductList>(  // Sử dụng axios.get thay vì axios.getOne
        `${urlPath}/api/product/by-field?field=status&value=${status}`,
        { page: page, limit: pageSize } // Thêm tham số page và limit
      );

      setProducts(response);
      setPagination(response.pagination);
    } catch (error) {
      alert(error);
    }
  };


  const pageSize = 8;

  useEffect(() => {
    fetchProductItem(pagination.currentPage!, pageSize, showActiveProducts);
  }, [showActiveProducts]); // Thêm dependency để fetch lại khi trạng thái thay đổi

  const refreshData = () => {
    fetchProductItem(pagination.currentPage!, pageSize, showActiveProducts);
  };
  const handlePageChange = (page: number) => {
    if (page <= pagination?.totalPages!) {
      setPagination({
        ...pagination,
        currentPage: page,
      });
      fetchProductItem(page, pageSize, showActiveProducts);
    }
  };

  // Hàm chuyển đổi giữa các form
  const toggleProductStatusView = () => {
    setShowActiveProducts(!showActiveProducts);
    // Reset về trang đầu tiên khi chuyển đổi
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="font-semibold text-xl p-6">Product List</div>

        {/* Navigation Tabs */}
        <div className="flex">
          <div
            onClick={() => setShowActiveProducts(true)}
            className={`${showActiveProducts
              ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
              : "text-slate-400 border-b-2 border-slate-300 font-medium"
              } py-2 px-6 cursor-pointer font-medium transition duration-300 hover:text-blue-500 hover:border-blue-500`}
          >
            Active Products
          </div>

          <div
            onClick={() => setShowActiveProducts(false)}
            className={`${!showActiveProducts
              ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
              : "text-slate-400 border-b-2 border-slate-300 font-medium"
              } py-2 px-6 cursor-pointer font-medium transition duration-300 hover:text-blue-500 hover:border-blue-500`}
          >
            Inactive Products
          </div>
        </div>
      </div>
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