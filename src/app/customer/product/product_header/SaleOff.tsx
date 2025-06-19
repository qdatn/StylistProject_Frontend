import Transition from "@components/Transition";
import React, { useCallback, useEffect, useState } from "react";
import ProductItem from "@components/productItem";
import { ProductList } from "@src/types/new/Product";
import { Product } from "@src/types/new/Product";
import axiosClient from "@api/axiosClient";
import { Spin } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { debounce, set } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { UserAccount } from "@src/types/UserAccount";
import LoadingData from "@components/LoadingData";

interface SalePageProps { }

const SalePage: React.FC<SalePageProps> = ({ }) => {
    const [products, setProducts] = useState<ProductList>({
        data: [],
        pagination: {},
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [styleProductIds, setStyleProductIds] = useState<string[]>([]);
    const [hasCheckedPreference, setHasCheckedPreference] = useState(false);
    const [trackingLoaded, setTrackingLoaded] = useState(false);
    const [sortedProducts, setSortedProducts] = useState<Product[]>([]);

    const urlPath = import.meta.env.VITE_API_URL;

    const currentUser = useSelector(
        (state: RootState) => state.persist.auth.user?.user
    );
    const currentUserId = currentUser?._id as string;

    const location = useLocation();

    useEffect(() => {
        const storageKey = `styleProductIds_${currentUserId}`;
        const cachedIds = sessionStorage.getItem(storageKey);

        // Nếu có trong session storage, sử dụng ngay
        if (cachedIds) {
            setStyleProductIds(JSON.parse(cachedIds));
            setHasCheckedPreference(true);
            return;
        }
    }, [currentUserId]);

    // Effect tải sản phẩm chính
    useEffect(() => {
        // Chỉ tải khi đã kiểm tra xong preference hoặc có bộ lọc
        const loadProducts = async () => {
            setLoading(true);
            setTrackingLoaded(false);

            try {
                await fetchProducts();
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [
        styleProductIds,
        hasCheckedPreference,
    ]);
    const sortProducts = useCallback((products: Product[]) => {
        // Nếu không có styleProductIds hoặc rỗng, giữ nguyên thứ tự
        if (!styleProductIds || styleProductIds.length === 0) {
            setSortedProducts(products);
            return;
        }

        // Tạo map để tra cứu nhanh vị trí của từng product ID
        const positionMap = new Map<string, number>();
        styleProductIds.forEach((id, index) => {
            positionMap.set(id, index);
        });

        // Sắp xếp sản phẩm:
        const sorted = [...products].sort((a, b) => {
            const aPosition = positionMap.has(a._id) ? positionMap.get(a._id)! : Number.MAX_SAFE_INTEGER;
            const bPosition = positionMap.has(b._id) ? positionMap.get(b._id)! : Number.MAX_SAFE_INTEGER;

            return aPosition - bPosition;
        });

        setSortedProducts(sorted);
    }, [styleProductIds]);

    // Hàm fetch sản phẩm thường
    const fetchProducts = async () => {
        try {
            const response = await axiosClient.getOne<ProductList>(
                `${urlPath}/api/product/sale-off?limit=10000`
            );
            setProducts(response);

            // Sắp xếp sản phẩm ngay sau khi nhận được response
            sortProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        if (products.data && products.data.length > 0) {
            sortProducts(products.data);
        }
    }, [styleProductIds, products.data, sortProducts]);

    // Animation Variants for Framer Motion
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    if (loading) {
        return <LoadingData />;
    }

    return (
        <>
            <div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6 py-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                    {/* Sử dụng sortedProducts thay vì products.data */}
                    {sortedProducts
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
                                    delay: index * 0.08,
                                }}
                            >
                                <ProductItem product={product} />
                            </motion.div>
                        ))}
                </div>
            </div>
        </>
    );
};


export default SalePage;
