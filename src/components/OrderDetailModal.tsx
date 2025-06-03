// components/OrderDetailModal.tsx
import React from "react";
import OrderItemPage from "@components/OrderItem";
import { formatCurrency } from "@utils/format";
import { Order } from "@src/types/Order";
import { OrderItem } from "@src/types/OrderItem";
import { Address } from "@src/types/Address";

interface OrderDetailModalProps {
    order: Order;
    orderitems: OrderItem[];
    onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
    order,
    orderitems,
    onClose,
}) => {

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Order Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thông tin đơn hàng */}
                    <div className="order-info mb-4 text-gray-600">
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p><strong>Order Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
                        <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
                        <p><strong>Payment Method:</strong> {order.method || 'N/A'}</p>
                        <p><strong>Shipping Address:</strong> {order.address.address || 'N/A'}</p>
                        {order.receive_date && (
                            <p><strong>Receive Date:</strong> {new Date(order.receive_date).toLocaleDateString()}</p>
                        )}
                    </div>

                    {/* Thông tin người dùng */}
                    <div className="user-info mb-4 text-gray-600">
                        <p><strong>Name:</strong> {order.address.name}</p>
                        <p><strong>Email:</strong> {order.user.email}</p>
                        <p><strong>Phone:</strong> {order.address?.phone_num || 'N/A'}</p>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="order-items mb-4 mt-6">
                    <h3 className="font-semibold text-lg mb-2">Products</h3>
                    {orderitems.map((item) => (
                        <OrderItemPage key={item._id} item={item} />
                    ))}
                </div>

                {/* Tổng tiền */}
                <div className="order-total flex justify-end pt-4 border-t">
                    <div className="text-right">
                        {order.discount && order.discount > 0 && (
                            <p className="mb-1">
                                <span className="font-medium">Discount:</span>{" "}
                                -{formatCurrency(order.discount)}
                            </p>
                        )}
                        <p className="text-lg font-bold mt-2">
                            Total: {formatCurrency(order.total_price)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;