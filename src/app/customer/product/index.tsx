import Transition from "@components/Transition";
import React, { useCallback, useEffect, useState } from "react";
import ProductItem from "@components/productItem";
import { ProductList } from "@src/types/new/Product";
import { Product } from "@src/types/Product";
import axiosClient from "@api/axiosClient";
import { PaginationType } from "@src/types/Pagination";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { debounce, set } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { UserAccount } from "@src/types/UserAccount";

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
    pageSize: 8,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [styleProductIds, setStyleProductIds] = useState<string[]>([]);
  const [hasStylePreference, setHasStylePreference] = useState(false);
  const [useStyleBasedAPI, setUseStyleBasedAPI] = useState(false);

  const urlPath = import.meta.env.VITE_API_URL;

  const currentUser = useSelector(
    (state: RootState) => state.persist.auth.user?.user
  );
  const currentUserId = currentUser?._id as string;

  const location = useLocation();
  const [query, setQuery] = useState<any>({
    name,
    category,
    sortBy,
    sortOrder,
  });

  // Kiểm tra và lấy style preference
  useEffect(() => {
    const checkStylePreference = async () => {
      try {
        const userInfo = await axiosClient.getOne<UserAccount>(
          `${urlPath}/api/userinfo/${currentUserId}`
        );

        if (userInfo?.style_preferences?._id) {
          const styleProducts = await axiosClient.getOne<string[]>(
            `${urlPath}/api/product/user/${currentUserId}`
          );
          setStyleProductIds(styleProducts);
          setHasStylePreference(true);
          if (!name && !category) {
            setUseStyleBasedAPI(true);
          }
        }
      } catch (error) {
        console.error("Error checking style preference:", error);
      }
    };

    if (currentUserId) {
      checkStylePreference();
    }
  }, [currentUserId]);

  // Reset API type khi có bộ lọc
  useEffect(() => {
    if (name || category) {
      setUseStyleBasedAPI(false);
    } else if (hasStylePreference) {
      setUseStyleBasedAPI(true);
    }
  }, [name, category, hasStylePreference]);

  const fetchProductItem = async (page: number, pageSize: number) => {
    try {
      let response: ProductList;

      if (useStyleBasedAPI && styleProductIds.length > 0) {
        response = await axiosClient.post<ProductList>(
          `${urlPath}/api/product/by-style?page=${page}&limit=${pageSize}`,
          { productIds: styleProductIds }
        );
      } else if (name) {
        response = await axiosClient.getOne<ProductList>(
          `${urlPath}/api/product/search/query?name=${name}&category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}`
        );
      } else {
        response = await axiosClient.getOne<ProductList>(
          `${urlPath}/api/product/`,
          //pagination params
          { page: page, limit: pageSize }
        );
      }

      // const response = styleProducts
      //   ? await axiosClient.post<ProductList>(
      //       `${urlPath}/api/product/by-style?page=${page}&limit=${pageSize}`,
      //       styleProducts,
      //     )
      //   : name
      //   ? await axiosClient.getOne<ProductList>(
      //       `${urlPath}/api/product/search/query?name=${name}&category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      //     )
      //   : await axiosClient.getOne<ProductList>(
      //       `${urlPath}/api/product/`,
      //       //pagination params
      //       { page: page, limit: pageSize }
      //     );

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

      // Đánh dấu đã hoàn thành lần tải đầu tiên
    } catch (error) {
      alert(error);
    }
  };
  const fetchMoreData = debounce(async () => {
    if (pagination && pagination.currentPage! < pagination.totalPages!) {
      const nextPage = pagination.currentPage! + 1;
      console.log("nextPAGE:", pagination?.currentPage);
      await fetchProductItem(nextPage, pagination.pageSize!); // Fetch next page
    } else {
      setHasMore(false); // No more data to load
    }
  });
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchProductItem(pagination?.currentPage ?? 1, pagination.pageSize!);
    // fetchData();
  }, [name, category, sortBy, sortOrder, useStyleBasedAPI]);

  useEffect(() => {
    if (styleProductIds.length > 0 && hasStylePreference) {
      // Tải lại khi có danh sách ID sản phẩm
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      fetchProductItem(1, pagination.pageSize!);
    }
  }, [styleProductIds]);

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
        className=""
        dataLength={products?.data.length ?? 8}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <Spin tip="Loading" size="large" className=" flex justify-center" />
        }
        endMessage={
          <p className="mb-6 flex items-center justify-center font-light text-gray-600">
            <b>All products have been loaded</b>
          </p>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 py-8 lg:pl-16 lg:pr-16 lg:min-w-[1300px] md:min-w-[800px]">
          {/* Hiển thị danh sách sản phẩm */}

          {products &&
            products.data
              .filter((product) => product.status == true)
              .map((product, index) => (
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
