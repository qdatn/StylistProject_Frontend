import React, { useState } from 'react';
import { Button } from 'antd';
import { Order } from '@src/types/Order';
import OrdertrackingAdmin from './OrdertrackingAdmin';

interface OrderFormProps {
    initialOrder?: Partial<Order>;
    onSave: (order: Partial<Order>) => void;
    onCancel: () => void;
    type: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ initialOrder = {}, onSave, onCancel, type }) => {
    const [order, setOrder] = useState<Partial<Order>>(initialOrder);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Xử lý thay đổi dữ liệu trong form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setOrder((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Kiểm tra dữ liệu trước khi lưu
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!order._id) newErrors.id = 'Order ID is required.';
        if (!order.status) newErrors.status = 'Order status is required.';
        if (!order.user) newErrors.user = 'User is required.';
        if (!order.status) newErrors.status = 'Order status is required.';
        if (!order.method) newErrors.method = 'method is required.';
        if (!order.total_price) newErrors.total_price = 'Total price is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Lưu thông tin order
    const handleSave = () => {
        if (validate()) {
            console.log('Saving order:', order);
            onSave(order);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
            {/* Form thông tin cơ bản */}
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5">
                <div>
                    <label className="block font-medium">Order ID</label>
                    <input
                        type="text"
                        name="_id"
                        value={order._id || ''}
                        onChange={handleChange}
                        placeholder="Enter Order ID"
                        required
                        className={`w-full mt-1 p-2 border rounded-md ${errors.id ? 'border-red-500' : ''}`}
                    />
                    {errors.id && <p className="text-red-500 text-sm">{errors.id}</p>}
                </div>
                <div>
                    <label className="block font-medium">User</label>
                    <input
                        type="text"
                        name="user"
                        value={order.user || ''}
                        onChange={handleChange}
                        placeholder="Enter User ID"
                        required
                        className={`w-full mt-1 p-2 border rounded-md ${errors.user ? 'border-red-500' : ''}`}
                    />
                    {errors.user && <p className="text-red-500 text-sm">{errors.user}</p>}
                </div>
                <div>
                    <label className="block font-medium">Status</label>
                    <select
                        name="status"
                        value={order.status || ''}
                        onChange={(e) => handleChange({ target: { name: e.target.name, value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                        required
                        className={`w-full mt-1 p-2 border rounded-md ${errors.status ? 'border-red-500' : ''}`}
                    >
                        <option value="" disabled>
                            Select Status
                        </option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}

                </div>
            </div>
            <div className='grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5'>
                <div>
                    <label className="block font-medium">Total Price</label>
                    <input
                        type="number"
                        name="total_price"
                        value={order.total_price || 0}
                        onChange={handleChange}
                        min="0"
                        placeholder="Enter Total Price"
                        required
                        className={`w-full mt-1 p-2 border rounded-md ${errors.total_price ? 'border-red-500' : ''}`}
                    />
                    {errors.total_price && <p className="text-red-500 text-sm">{errors.total_price}</p>}
                </div>
                <div>
                    <label className="block font-medium">Discount</label>
                    <input
                        type="number"
                        name="discount"
                        value={order.discount || 0}
                        onChange={handleChange}
                        min="0"
                        placeholder="Enter Discount (if any)"
                        className={`w-full mt-1 p-2 border rounded-md ${errors.discount ? 'border-red-500' : ''}`}
                    />
                    {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
                </div>
                <div>
                    <label className="block font-medium">Method</label>
                    <select
                        name="method"
                        value={order.method || ''}
                        onChange={(e) => handleChange({ target: { name: e.target.name, value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                        className={`w-full mt-1 p-2 border rounded-md ${errors.method ? 'border-red-500' : ''}`}
                    >
                        <option value="" disabled>
                            Select Payment Method
                        </option>
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="cash_on_delivery">Cash on Delivery</option>
                        {/* <option value="bank_transfer">Bank Transfer</option> */}
                    </select>
                    {errors.method && <p className="text-red-500 text-sm">{errors.method}</p>}
                </div>
            </div>
            <div className='grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5'>

                <div>
                    <label className="block font-medium">Receive Date</label>
                    <input
                        type="date"
                        name="receive_date"
                        value={order.receive_date ? new Date(order.receive_date).toISOString().split('T')[0] : ''}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-medium">Create Date</label>
                    <input
                        type="date"
                        name="create_date"
                        value={order.create_date ? new Date(order.create_date).toISOString().split('T')[0] : ''}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-md"
                    />
                </div>
            </div>

            {/* Giao diện hiển thị Order Items */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                {order.order_items && order.order_items.length > 0 ? (
                    <OrdertrackingAdmin order={order as Order} />
                ) : (
                    <p className="text-gray-600">No items in this order.</p>
                )}
            </div>

            {/* Nút hành động */}
            <div className="flex flex-row gap-2 justify-end mt-6">
                <Button className="text-[16px] p-4 w-32" onClick={handleSave}>
                    Save
                </Button>
                <Button className="text-[16px] p-4 w-32" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default OrderForm;
