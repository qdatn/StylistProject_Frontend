import Transition from "@components/Transition";
// import Image from "next/image";
// import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import ProductItem from "@components/productItem"; // Nhập component ProductItem
import mockProducts, { ProductList } from "@src/types/Product";
import { Product } from "@src/types/Product";
import axiosClient from "@api/axiosClient";
import { PaginationType } from "@src/types/Pagination";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { debounce } from "lodash";

interface ProductListPageProps {
  name?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
}

const ProductListPage: React.FC<ProductListPageProps> = ({
  name,
  category,
  sortBy,
  sortOrder,
}) => {
  const [products, setProducts] = useState<ProductList>({
    data: [],
    pagination: {},
  });
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);

  const urlPath = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const [query, setQuery] = useState<any>({
    name,
    category,
    sortBy,
    sortOrder,
  });
  console.log("SERRRR", name, category, sortBy, sortOrder);
  const fetchProductItem = async (page: number, pageSize: number) => {
    try {
      const response = name
        ? await axiosClient.getOne<ProductList>(
            `${urlPath}/api/product/search/query?name=${name}&category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}`
            // {
            //   params: {
            //     name,
            //     category: category || "All",
            //     sortBy: sortBy || "product_name",
            //     sortOrder: sortOrder || "asc",
            //     page,
            //     limit: pageSize,
            //   },
            // }
          )
        : await axiosClient.getOne<ProductList>(
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
      console.log(response);
    } catch (error) {
      alert(error);
    }
  };
  const fetchMoreData = debounce(async () => {
    // console.log("Bat dau fetch");
    // await setPagination(products?.pagination);
    if (pagination && pagination.currentPage! < pagination.totalPages!) {
      const nextPage = pagination.currentPage! + 1;
      console.log("nextPAGE:", pagination?.currentPage);
      await fetchProductItem(nextPage, pagination.pageSize!); // Fetch next page
    } else {
      setHasMore(false); // No more data to load
    }
  });
  useEffect(() => {
    fetchProductItem(pagination?.currentPage ?? 1, pagination.pageSize!);
    // fetchData();
  }, [name, category, sortBy, sortOrder]);

  useEffect(() => {
    console.log("PRODUCT", products);
    console.log("PAGE:", pagination);
  }, [products, pagination]);

  // Animation Variants for Framer Motion
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <InfiniteScroll
        dataLength={products?.data.length ?? 10}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <Spin tip="Loading" size="large" className=" flex justify-center" />
        }
        endMessage={
          <p className="mb-10 flex items-center justify-center">
            <b>All products have been loaded</b>
          </p>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-4 py-8 overflow-hidden">
          {/* Hiển thị danh sách sản phẩm */}
          {products &&
            products.data.map((product, index) => (
              <motion.div
                key={product._id}
                className="w-full max-w-[250px] mx-auto"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.5,
                  delay: index * 0.1, // Stagger effect
                }}
              >
                <ProductItem product={product} />
              </motion.div>
            ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default ProductListPage;
