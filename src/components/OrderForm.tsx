// components/OrderForm.tsx
import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Select } from 'antd';
import { Order } from '@src/types/Order';
import { OrderItem, OrderItemList } from '@src/types/OrderItem';
import { Address } from "@src/types/Address";
import OrdertrackingAdmin from './OrdertrackingAdmin';
import axiosClient from '@api/axiosClient';
import Ordertracking from './OrdertrackingAdmin';
import { formatCurrency } from '@utils/format';
import { formatDate } from '@utils/format';
import moment from 'moment';

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
        let formattedValue = value;
        if (name === 'createdAt' || name === 'receive_date') {
            formattedValue = formatDate(new Date(value));
        }
        setOrder((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleDateChange = (date: moment.Moment | null, field: "createdAt" | "receive_date") => {
        if (date) {
            setOrder((prev) => ({
                ...prev,
                [field]: date.toDate(), // Đảm bảo lưu ngày dưới dạng Date object
            }));
        } else {
            setOrder((prev) => ({
                ...prev,
                [field]: undefined, // Nếu không có ngày chọn thì xóa giá trị
            }));
        }
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
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-blue-800">
                    {type === 'add' ? 'New Order' : 'Update Order'}
                </h2>
            </div>
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5">
                <div>
                    <label className="block font-medium">Order ID</label>
                    <Input
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
                    <Input
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
                    <Select
                        value={order.status || ''}
                        onChange={(value) => handleChange({ target: { name: 'status', value } } as React.ChangeEvent<HTMLInputElement>)}
                        className={`w-full mt-1 h-10 rounded-md ${errors.status ? 'border-red-500' : ''}`}
                    >
                        <option value="" disabled>Select Status</option>
                        <option value="Waiting for payment!">Waiting for payment!</option>
                        <option value="pending">Pending</option>
                        <option value="delivering">Delivering</option>
                        <option value="shipped">Shipped</option>
                        <option value="canceled">Canceled</option>
                    </Select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5">
                <div>
                    <div className='flex flex-grow gap-3'>
                        <label className="block font-medium">
                            Total Price:
                        </label>
                        <p className='pr-1 pl-1 text-blue-600 rounded-sm border border-blue-200 bg-blue-50'>
                            {formatCurrency(order.total_price || 0)}
                        </p>
                    </div>
                    <Input
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
                    <Input
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
                    <label className="block font-medium">Start Date</label>
                    <DatePicker
                        name="createdAt"
                        value={order.createdAt ? moment(order.createdAt) : null}
                        format="DD-MM-YYYY" // Định dạng ngày
                        onChange={(date) => handleDateChange(date, "createdAt")}
                        placeholder="Select creat date"
                        disabled
                        className={`w-full mt-1 p-2 border rounded-md ${errors.createdAt ? 'border-red-500' : ''}`}
                    />
                    {errors.createdAt && <p className="text-red-500 text-sm">{errors.createdAt}</p>}
                </div>
                <div>
                    <label className="block font-medium">Receive Date</label>
                    <DatePicker
                        name="receive_date"
                        value={order.receive_date ? moment(order.receive_date) : null}
                        format="DD-MM-YYYY" // Định dạng ngày
                        onChange={(date) => handleDateChange(date, "receive_date")}
                        placeholder="Select receive date"
                        className={`w-full mt-1 p-2 border rounded-md ${errors.receive_date ? 'border-red-500' : ''}`}
                    />
                    {errors.receive_date && <p className="text-red-500 text-sm">{errors.receive_date}</p>}
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
            <div className="mt-4 text-right">
            </div>
            {/* Button Save */}
            <div className="flex flex-row gap-2 justify-end">
                <Button
                    type="primary"
                    onClick={handleSave}
                    className="text-[16px] p-4 w-32 mt-6"
                >
                    Save
                </Button>
                <Button
                    onClick={onCancel}
                    className="text-[16px] p-4 w-32 mt-6"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default OrderForm;
