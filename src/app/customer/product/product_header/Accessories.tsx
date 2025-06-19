import Transition from "@components/Transition";
import React, { useEffect, useState } from "react";
import ProductItem from "@components/productItem";
import { ProductList } from "@src/types/new/Product";
import axiosClient from "@api/axiosClient";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import LoadingData from "@components/LoadingData";

interface AccessoriesPageProps { }

const AccessoriesPage: React.FC<AccessoriesPageProps> = () => {
    const [products, setProducts] = useState<ProductList>({
        data: [],
        pagination: {},
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [trackingLoaded, setTrackingLoaded] = useState(false);

    const urlPath = import.meta.env.VITE_API_URL;

    const currentUser = useSelector(
        (state: RootState) => state.persist.auth.user?.user
    );

    const location = useLocation();

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setTrackingLoaded(false);
            try {
                await fetchProducts();
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setTrackingLoaded(true);
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axiosClient.getOne<ProductList>(
                `${urlPath}/api/product/by-field`,
                {
                    field: "categories",
                    "value": "6852da577d17482206b857e2",
                    "limit": 1000
                }
            );
            setProducts(response);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="py-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            {loading ? (
                <LoadingData />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
                    {products?.data
                        ?.filter((product) => product.status === true)
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
            )}
        </div>
    );
};

export default AccessoriesPage;
