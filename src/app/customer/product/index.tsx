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
  const [hasCheckedPreference, setHasCheckedPreference] = useState(false);

  const [trackingLoaded, setTrackingLoaded] = useState(false);

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

  // // Kiểm tra và lấy style preference - CHỈ GỌI 1 LẦN
  // useEffect(() => {
  //   const checkStylePreference = async () => {
  //     if (!currentUserId) return;

  //     try {
  //       const userInfo = await axiosClient.getOne<UserAccount>(
  //         `${urlPath}/api/userinfo/${currentUserId}`
  //       );

  //       if (userInfo?.style_preferences?._id) {
  //         // Lấy danh sách ID sản phẩm được đề xuất
  //         const styleProductIds = await axiosClient.getOne<string[]>(
  //           `${urlPath}/api/product/user/${currentUserId}`
  //         );

  //         setStyleProductIds(styleProductIds);
  //         setHasStylePreference(true);
  //       }
  //     } catch (error) {
  //       console.error("Error checking style preference:", error);
  //     }
  //   };

  //   checkStylePreference();
  // }, [currentUserId]);

  // // Reset API type khi có bộ lọc
  // useEffect(() => {
  //   if (name || category) {
  //     setUseStyleBasedAPI(false);
  //   } else if (hasStylePreference) {
  //     setUseStyleBasedAPI(true);
  //   }
  // }, [name, category, hasStylePreference]);

  // const fetchProductItem = async (page: number, pageSize: number) => {
  //   try {
  //     let response: ProductList;
  //     if (name) {
  //       response = await axiosClient.getOne<ProductList>(
  //         `${urlPath}/api/product/search/query?name=${name}&category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  //       );
  //     } else if (useStyleBasedAPI && styleProductIds.length > 0) {
  //       // Sản phẩm theo style preference (API mới)
  //       response = await axiosClient.post<ProductList>(
  //         `${urlPath}/api/product/by-style?page=${page}&limit=${pageSize}`,
  //         { productIds: styleProductIds }
  //       );
  //       console.log("Style-based API response:", response);
  //     } else {
  //       response = await axiosClient.getOne<ProductList>(
  //         `${urlPath}/api/product/`,
  //         //pagination params
  //         { page: page, limit: pageSize }
  //       );
  //     }

  //     setProducts((prev) => ({
  //       data:
  //         page === 1
  //           ? response.data
  //           : [...(prev?.data ?? []), ...response.data],
  //       pagination: response.pagination,
  //     }));
  //     setPagination(response.pagination);
  //     setHasMore(page < response.pagination.totalPages!);
  //     console.log(response);

  //     // Đánh dấu đã hoàn thành lần tải đầu tiên
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  // // Xác định khi nào sử dụng API style-based
  // useEffect(() => {
  //   const shouldUseStyleAPI = hasStylePreference && !name && !category;
  //   setUseStyleBasedAPI(shouldUseStyleAPI);
  // }, [name, category, hasStylePreference]);

  // // Fetch dữ liệu khi có thay đổi
  // useEffect(() => {
  //   setPagination((prev) => ({ ...prev, currentPage: 1 }));
  //   fetchProductItem(1, pagination.pageSize!);
  // }, [name, category, sortBy, sortOrder, useStyleBasedAPI]);

  // const fetchMoreData = useCallback(
  //   debounce(async () => {
  //     if (pagination && pagination.currentPage! < pagination.totalPages!) {
  //       const nextPage = pagination.currentPage! + 1;
  //       console.log("nextPAGE:", pagination?.currentPage);
  //       await fetchProductItem(nextPage, pagination.pageSize!); // Fetch next page
  //     } else {
  //       setHasMore(false); // No more data to load
  //     }
  //   }, 300),
  //   [hasMore, pagination, fetchProductItem]
  // );
  // useEffect(() => {
  //   setPagination((prev) => ({ ...prev, currentPage: 1 }));
  //   fetchProductItem(pagination?.currentPage ?? 1, pagination.pageSize!);
  //   // fetchData();
  // }, [name, category, sortBy, sortOrder, useStyleBasedAPI]);

  // useEffect(() => {
  //   if (styleProductIds.length > 0 && hasStylePreference) {
  //     // Tải lại khi có danh sách ID sản phẩm
  //     setPagination((prev) => ({ ...prev, currentPage: 1 }));
  //     fetchProductItem(1, pagination.pageSize!);
  //   }
  // }, [styleProductIds]);

  // useEffect(() => {
  //   console.log("PRODUCT", products);
  //   console.log("PAGE:", pagination);
  // }, [products, pagination]);
  // Hàm cập nhật sản phẩm chung

  // Hàm cập nhật sản phẩm chung
  // Hàm fetch sản phẩm theo style (chỉ sử dụng khi có danh sách ID)
  // 1. Kiểm tra style preference với session storage
  useEffect(() => {
    const checkStylePreference = async () => {
      if (!currentUserId) {
        setHasCheckedPreference(true);
        return;
      }

      const storageKey = `styleProductIds_${currentUserId}`;
      const cachedIds = sessionStorage.getItem(storageKey);

      // Nếu có trong session storage, sử dụng ngay
      if (cachedIds) {
        setStyleProductIds(JSON.parse(cachedIds));
        setHasCheckedPreference(true);
        return;
      }

      try {
        const userInfo = await axiosClient.getOne<UserAccount>(
          `${urlPath}/api/userinfo/${currentUserId}`
        );

        // Kiểm tra nếu người dùng có style preference
        if (userInfo?.style_preferences?._id) {
          const ids = await axiosClient.getOne<string[]>(
            `${urlPath}/api/product/user/${currentUserId}`
          );
          
          // Lưu vào session storage
          sessionStorage.setItem(storageKey, JSON.stringify(ids));
          setStyleProductIds(ids);
        }
      } catch (error) {
        console.error("Error checking style preference:", error);
      } finally {
        // Luôn đánh dấu đã kiểm tra dù có lỗi hay không
        setHasCheckedPreference(true);
      }
    };

    checkStylePreference();
  }, [currentUserId]);

  // 2. Effect tải sản phẩm chính
  useEffect(() => {
    // Chỉ tải khi đã kiểm tra xong preference hoặc có bộ lọc
    if (!hasCheckedPreference && !name && !category) return;

    const loadProducts = async () => {
      setLoading(true);
      setTrackingLoaded(false);

      const initialPage = 1;
      const pageSize = pagination.pageSize || 8;

      try {
        // Sử dụng API style-based khi:
        // - Đã kiểm tra xong preference
        // - Có danh sách ID sản phẩm
        // - Không có bộ lọc
        if (styleProductIds.length > 0 && !name && !category) {
          await fetchStyleProducts(initialPage, pageSize, styleProductIds);
        } else {
          await fetchRegularProducts(initialPage, pageSize);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setTrackingLoaded(true);
        setLoading(false);
      }
    };

    loadProducts();
  }, [
    name,
    category,
    sortBy,
    sortOrder,
    styleProductIds,
    hasCheckedPreference,
  ]);

  // 3. Hàm fetch sản phẩm theo style
  const fetchStyleProducts = async (
    page: number,
    pageSize: number,
    ids: string[]
  ) => {
    try {
      const response = await axiosClient.post<ProductList>(
        `${urlPath}/api/product/by-style?page=${page}&limit=${pageSize}`,
        { productIds: ids }
      );

      updateProducts(response, page);
      console.log("Style-based API response:", response);
    } catch (error) {
      console.error("Error fetching style products:", error);
      // Fallback về API thường nếu có lỗi
      await fetchRegularProducts(page, pageSize);
    }
  };

  // 4. Hàm fetch sản phẩm thường
  const fetchRegularProducts = async (page: number, pageSize: number) => {
    try {
      let response: ProductList;

      if (name || category) {
        // API tìm kiếm với bộ lọc
        response = await axiosClient.getOne<ProductList>(
          `${urlPath}/api/product/search/query?name=${name}&category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&limit=${pageSize}`
        );
      } else {
        // API tất cả sản phẩm
        response = await axiosClient.getOne<ProductList>(
          `${urlPath}/api/product/`,
          { page, limit: pageSize }
        );
      }

      updateProducts(response, page);
      console.log("Regular API response:", response);
    } catch (error) {
      console.error("Error fetching regular products:", error);
    }
  };

  // 5. Cập nhật state sản phẩm
  const updateProducts = (response: ProductList, page: number) => {
    setProducts((prev) => ({
      data:
        page === 1
          ? response.data
          : [...(prev?.data || []), ...response.data],
      pagination: response.pagination,
    }));

    setPagination(response.pagination);
    setHasMore(page < response.pagination.totalPages!);
  };

  // 6. Hàm tải thêm dữ liệu
  const fetchMoreData = useCallback(
    debounce(async () => {
      if (!hasMore || !trackingLoaded || loading) return;

      const nextPage = pagination.currentPage! + 1;
      const pageSize = pagination.pageSize!;

      if (styleProductIds.length > 0 && !name && !category) {
        await fetchStyleProducts(nextPage, pageSize, styleProductIds);
      } else {
        await fetchRegularProducts(nextPage, pageSize);
      }
    }, 300),
    [
      hasMore,
      trackingLoaded,
      loading,
      pagination,
      styleProductIds,
      name,
      category,
    ]
  );

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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 py-6 px-4 sm:px-6 md:px-8 lg:px-16">
          {/* Hiển thị danh sách sản phẩm */}

          {products &&
            products.data
              .filter((product) => product.status == true)
              .map((product, index) => (
                <motion.div
                  key={product._id}
                  className="w-full max-w-[280px] mx-auto"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08, // Stagger effect
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
