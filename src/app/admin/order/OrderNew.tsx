// app/admin/order/NewOrder.tsx
import OrderForm from "@components/OrderForm"; // Import form cho order
import React, { useState } from "react";
import mockOrders, { Order } from "@src/types/Order"; // Import dữ liệu mẫu và type
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

const NewOrder: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(mockOrders); // State lưu danh sách orders
    const navigate = useNavigate();

    // Xử lý thêm order mới
    const handleAddOrder = (newOrder: Partial<Order>) => {
        const orderToAdd: Order = {
            ...newOrder,
            order_id: newOrder._id || `order-${Date.now()}`, // Tạo ID nếu chưa có
            create_date: new Date(), // Tự động thêm ngày tạo
        } as Order;

        setOrders((prevOrders) => [...prevOrders, orderToAdd]);
        notification.success({
            message: "Order added successfully!",
            description: "",
            placement: "topRight",
            duration: 2,
        });
        navigate("/admin/order"); // Chuyển hướng về danh sách đơn hàng
    };

    // Xử lý khi người dùng hủy thao tác
    const handleCancel = () => {
        navigate("/admin/order");
    };

    return (
        <div>
            {/* <div className="font-semibold text-xl p-6">New Order</div> */}
            {/* Order Form */}
            <div className="w-full">
                <OrderForm
                    onSave={handleAddOrder}
                    onCancel={handleCancel}
                    type="add" />
            </div>
        </div>
    );
};

export default NewOrder;
