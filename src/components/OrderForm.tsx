// components/OrderForm.tsx
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Order } from '@src/types/Order';
import { OrderItem, OrderItemList } from '@src/types/OrderItem';
import { Address } from "@src/types/Address";
import OrdertrackingAdmin from './OrdertrackingAdmin';
import axiosClient from '@api/axiosClient';
import Ordertracking from './OrdertrackingAdmin';

const baseUrl = import.meta.env.VITE_API_URL;

interface OrderFormProps {
    initialOrder?: Partial<Order>;  // Nhận dữ liệu OrderItem
    onSave: (order: Partial<Order>) => void;
    onCancel: () => void;
    type: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ initialOrder = {}, onSave, onCancel, type }) => {
    const [order, setOrder] = useState<Partial<Order>>(initialOrder);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [addressDetail, setAddressDetail] = useState<Address | null>(null);

    useEffect(() => {
        console.log("Order Address ID:", order.address); // Kiểm tra ID trước khi gọi API
        if (order.address) { // Kiểm tra ID tồn tại
            fetchAddressDetail();
        }
    }, [order.address]);

    const fetchAddressDetail = async (): Promise<void> => {
        try {
            const response = await axiosClient.getOne<Address>(`${baseUrl}/api/address/${order.address}`);
            const addressData = response
            console.log("Fetched Address:", addressData);
            setAddressDetail(addressData);
        } catch (error) {
            console.error("Error fetching address details:", error);
        }
    };
   
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
        if (!order.method) newErrors.method = 'Method is required.';
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
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5">
                <div>
                    <label className="block font-medium">Order ID</label>
                    <input
                        type="text"
                        name="_id"
                        disabled
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
                        disabled
                        value={order.user?.email}
                        onChange={handleChange}
                        placeholder="User ID"
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
                        <option value="" disabled>Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5">
                <div>
                    <label className="block font-medium">Total Price</label>
                    <input
                        type="number"
                        name="total_price"
                        disabled
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
                        disabled
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
                        disabled
                    >
                        <option value="" disabled>Select Payment Method</option>    
                        <option value="Credit_card">Credit Card</option>
                        <option value="Paypal">PayPal</option>
                        <option value="COD">COD</option>
                    </select>
                    {errors.method && <p className="text-red-500 text-sm">{errors.method}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5">
                <div className=''>
                    <label className="block font-medium">Address: </label>
                    <div className='border rounded-sm mt-2 p-2 flex flex-col gap-2'>
                        <label >Name: {addressDetail?.name}</label>
                        <label >Phone: {addressDetail?.phone_num}</label>
                        <label >Address: {addressDetail?.address}</label>
                    </div>
                </div>
            </div>
            
            {/* Button Save */}
            <div className="mt-4 text-right">
                <Button
                    type="primary"
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                    Save
                </Button>
            </div>
        </div>
    );
};

export default OrderForm;
