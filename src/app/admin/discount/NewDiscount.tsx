// app/admin/Discount/NewDiscount.tsx
import DiscountForm from "@components/DiscountForm"; // Import form cho Discount
import React, { useEffect, useMemo, useState } from "react";
import mockDiscounts, { Discount } from "@src/types/Discount"; // Import dữ liệu mẫu và type
import { useNavigate } from "react-router-dom";
import { Product, ProductList } from "@src/types/new/Product";
import { Category, CategoryList, mockCategories } from "@src/types/Category";
import axiosClient from "@api/axiosClient";
import { notification } from "antd";

const baseUrl = import.meta.env.VITE_API_URL;
const NewDiscount: React.FC = () => {
    const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts); // State lưu danh sách Discounts
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]); // State lưu danh sách sản phẩm
    const [categories, setCategories] = useState<Category[]>([]); // State lưu danh sách danh mục
    const initialDiscount = useMemo(() => ({}), []);
    // Gọi API để lấy danh sách sản phẩm
    const fetchProducts = async () => {
        try {
            const response = await axiosClient.getOne<ProductList>(
                `${baseUrl}/api/product/?limit=10000`,
            );
            setProducts(response.data);
        } catch (error) {
            console.error("Failed:", error);
        }
    };

    // Gọi API để lấy danh sách danh mục
    const fetchCategories = async () => {
        try {
            const response = await axiosClient.getOne<CategoryList>(
                `${baseUrl}/api/category/?limit=10000`,
            );
            setCategories(response.data);
        } catch (error) {
            console.error("Failed:", error);
        }
    };


    // Dùng useEffect để gọi API khi component được render
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);
    const addDiscountToDB = async (discount: Discount) => {
        try {
            const addDiscount = axiosClient.post<Discount>(
                `${baseUrl}/api/discount`,
                discount
            );
        } catch (error) {
            alert(error);
        }
    };
    // Xử lý thêm Discount mới
    const handleAddDiscount = (newDiscount: Partial<Discount>) => {
        const discountToAdd: Discount = {
            ...newDiscount,
            //discount_id: newDiscount._id || `discount-${Date.now()}`, // Tạo ID nếu chưa có
        } as Discount;

        setDiscounts((prevDiscounts) => [...prevDiscounts, discountToAdd]);
        addDiscountToDB(discountToAdd);
        notification.success({
            message: "Discount added successfully!",
            description: "",
            placement: "topRight",
            duration: 2,
        });
        navigate("/admin/discount", { state: { refresh: true } }); // Chuyển hướng về danh sách đơn hàng
    };

    // Xử lý khi người dùng hủy thao tác
    const handleCancel = () => {
        navigate("/admin/discount");
    };

    return (
        <div>
            {/* <div className="font-semibold text-xl p-6">New Discount</div> */}
            {/* Discount Form */}
            <div className="w-full">
                <DiscountForm
                    initialDiscount={initialDiscount}
                    onSave={handleAddDiscount}
                    onCancel={handleCancel}
                    products={products}
                    categories={categories}
                    type="add"
                />
            </div>
        </div>
    );
};

export default NewDiscount;
