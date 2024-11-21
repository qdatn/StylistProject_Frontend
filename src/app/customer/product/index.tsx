import Transition from "@components/Transition";
// import Image from "next/image";
// import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import ProductItem from "@components/productItem"; // Nhập component ProductItem
import mockProducts, { ProductList } from "@src/types/Product";
import { Product } from "@src/types/Product";
import axiosClient from "@api/axiosClient";
import { Pagination } from "@src/types/Pagination";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductList>({
    data: [],
    pagination: {},
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);

  const urlPath = import.meta.env.VITE_API_URL;

  const fetchProductItem = async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.getOne<ProductList>(
        `${urlPath}/api/product/`,
        //pagination params
        { page: page, limit: pageSize }
      );

      setProducts((prev) => ({
        data:
          page === 1
            ? response.data
            : [...(prev?.data ?? []), ...response.data],
        pagination: response.pagination,
      }));
      setPagination(response.pagination);
      setHasMore(page < response.pagination.totalPages!);
    } catch (error) {
      alert(error);
    }
  };
  const fetchMoreData = async () => {
    // console.log("Bat dau fetch");
    // await setPagination(products?.pagination);
    if (pagination && pagination.currentPage! < pagination.totalPages!) {
      const nextPage = pagination.currentPage! + 1;
      console.log("nextPAGE:", pagination?.currentPage);
      await fetchProductItem(nextPage, pagination.pageSize!); // Fetch next page
    } else {
      setHasMore(false); // No more data to load
    }
  };
  useEffect(() => {
    fetchProductItem(pagination?.currentPage ?? 1, pagination.pageSize!);
    // fetchData();
  }, []);

  useEffect(() => {
    console.log("PRODUCT", products);
    console.log("PAGE:", pagination);
  }, [products, pagination]);

  // Hàm lấy sản phẩm
  // useEffect(() => {
  //   // Thay thế dữ liệu thật bằng dữ liệu giả
  //   setProducts(mockProducts); // Thiết lập sản phẩm với dữ liệu giả
  // }, []);

  return (
    <>
      <InfiniteScroll
        dataLength={products?.data.length ?? 10}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Spin tip="Loading" size="small"></Spin>}
        endMessage={
          <p className="mb-10 flex items-center justify-center">
            <b>All product had been loaded</b>
          </p>
        }
      >
        <div className="grid grid-rows-[auto_1fr_auto] bg-white items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          {/* Hiển thị danh sách sản phẩm */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {products &&
              products.data.map((product) => (
                <ProductItem key={product._id} product={product} /> // Truyền sản phẩm vào ProductItem
              ))}
          </div>
        </div>
      </InfiniteScroll>
      {/* <button onClick={handleClick}>Click herre</button> */}
    </>
  );
}
