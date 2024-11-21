// app/admin/Discount/NewDiscount.tsx
import DiscountForm from "@components/DiscountForm"; // Import form cho Discount
import React, { useState } from "react";
import mockDiscounts, { Discount } from "@src/types/Discount"; // Import dữ liệu mẫu và type
import { useNavigate } from "react-router-dom";
import mockProducts from "@src/types/Product";
import { mockCategories } from "@src/types/Category";

const NewDiscount: React.FC = () => {
    const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts); // State lưu danh sách Discounts
    const navigate = useNavigate();

    // Xử lý thêm Discount mới
    const handleAddDiscount = (newDiscount: Partial<Discount>) => {
        const discountToAdd: Discount = {
            ...newDiscount,
            discount_id: newDiscount._id || `discount-${Date.now()}`, // Tạo ID nếu chưa có
            create_date: new Date(), // Tự động thêm ngày tạo
        } as Discount;

        setDiscounts((prevDiscounts) => [...prevDiscounts, discountToAdd]);
        alert("Discount added successfully!");
        navigate("/admin/discount"); // Chuyển hướng về danh sách đơn hàng
    };

    // Xử lý khi người dùng hủy thao tác
    const handleCancel = () => {
        navigate("/admin/discount");
    };

    return (
        <div>
            <div className="font-semibold text-xl p-6">New Discount</div>
            {/* Discount Form */}
            <div className="w-full">
                <DiscountForm
                    onSave={handleAddDiscount}
                    onCancel={handleCancel}
                    mockProducts={mockProducts} // Truyền mockProducts
                    mockCategories={mockCategories} // Truyền mockCategories
                />
            </div>
        </div>
    );
};

export default NewDiscount;
