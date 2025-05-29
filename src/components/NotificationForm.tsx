import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Select } from 'antd';
import moment from 'moment';
import { CustomerList, UserAccount } from '@src/types/UserAccount';
import { Order, OrderListAdmin } from '@src/types/Order';
import axiosClient from '@api/axiosClient';
import { Notification } from '@src/types/Notification';

const baseUrl = import.meta.env.VITE_API_URL;

interface NotificationFormProps {
    initialNotification?: Partial<Notification>;
    onSave: (notice: Partial<Notification>) => void;
    onCancel: () => void;
    type: string;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
    initialNotification = {},
    onSave,
    onCancel,
    type
}) => {
    const [notice, setNotification] = useState<Partial<Notification>>(initialNotification);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [customers, setCustomers] = useState<UserAccount[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [customerPagination, setCustomerPagination] = useState({ page: 1, pageSize: 10, total: 0 });
    const [orderPagination, setOrderPagination] = useState({ page: 1, pageSize: 10, total: 0 });

    // Fetch customers and orders
    useEffect(() => {

        const fetchCustomers = async () => {
            try {
                const response = await axiosClient.getOne<CustomerList>(`${baseUrl}/api/userinfo/`, {
                });
                setCustomers(prev => [...prev, ...response.data]);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await axiosClient.getOne<OrderListAdmin>(`${baseUrl}/api/order/`, {
                });
                setOrders(prev => [...prev, ...response.data]);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchCustomers();
        fetchOrders();
    }, [customerPagination.page, orderPagination.page]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNotification(prev => ({ ...prev, [name]: value }));
    };

    // Kiểm tra dữ liệu trước khi lưu
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!notice.user?.length) newErrors.id = 'Notification email is required.';
        if (!notice.title) newErrors.title = 'Notification title is required.';
        if (!notice.type) newErrors.type = 'Notification type is required.';
        if (!notice.content) newErrors.content = 'Notification content is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            onSave(notice)
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
            {/* Title */}
            <div className='mb-6'>
                <label className="block font-medium mb-2">Notification Title</label>
                <Input
                    name="title"
                    value={notice.title || ''}
                    onChange={handleChange}
                    placeholder="Enter Notification Title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* User Select */}
                <div>
                    <label className="block font-medium mb-2">User Email</label>
                    <Select
                        mode="multiple"
                        placeholder="Select user"
                        value={notice.user?.map(user => user._id) || []}
                        onChange={(userIds) => {
                            // Lọc ra các user có ID nằm trong danh sách đã chọn
                            const selectedUsers = customers.filter(customer =>
                                userIds.includes(customer._id)
                            );

                            setNotification(prev => ({
                                ...prev,
                                user: selectedUsers,
                                // Tự động tạo title từ emails nếu chưa có
                                title: prev.title || selectedUsers
                                    .map(u => u.user.email)
                                    .join(', ')
                            }));
                        }}
                        className="w-full"
                        //optionLabelProp="label"
                        showSearch
                        filterOption={(input, option) => {
                            const label = typeof option?.children === 'string' ? option.children : '';
                            return label.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {customers.map(customer => (
                            <Select.Option
                                key={customer._id}
                                value={customer._id}
                                label={customer.user.email} // Hiển thị email khi đã chọn
                            >
                                <div className="flex justify-between">
                                    <span>{customer.name}</span>
                                    <span className="text-gray-500 ml-2">{customer.user.email}</span>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.user && <p className="text-red-500 text-sm ">{errors.user}</p>}
                </div>

                {/* Order Select */}
                <div>
                    <label className="block font-medium mb-2">Order ID</label>
                    <Select
                        placeholder="Select Order ID"
                        value={notice.order || undefined}
                        onChange={value => setNotification(prev => ({ ...prev, order: value }))}
                        className="w-full"
                        allowClear
                        showSearch
                        filterOption={(input, option) => {
                            const label = typeof option?.children === 'string' ? option.children : '';
                            return label.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {orders.map(order => (
                            <option key={order._id} value={order._id}>
                                {order._id}
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Priority Select */}
                <div>
                    <label className="block font-medium mb-2">Priority</label>
                    <Select
                        placeholder="Select Priority"
                        value={notice.priority}
                        onChange={value => handleChange({ target: { name: 'priority', value } } as React.ChangeEvent<HTMLInputElement>)}
                        className="w-full"
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </Select>
                    {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
                </div>

                {/* Status Select */}
                <div>
                    <label className="block font-medium mb-2">Status</label>
                    <Input
                        placeholder="Select Status"
                        disabled
                        onChange={handleChange}
                        value={notice.status || 'unread'}
                        className="w-full"
                    >
                    </Input>
                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                </div>

                {/* Type Select */}
                <div>
                    <label className="block font-medium mb-2">Type</label>
                    <Select
                        placeholder="Select Type"
                        value={notice.type || ''}
                        onChange={value => handleChange({ target: { name: 'type', value } } as React.ChangeEvent<HTMLInputElement>)}
                        className="w-full mt-1 h-10 rounded-md ${errors.status ? 'border-red-500' : ''}"
                    >
                        <option value="general">General</option>
                        <option value="event">Event</option>
                        <option value="alert">Alert</option>
                        <option value="system">System</option>
                        <option value="user">User</option>
                        <option value="custom">Custom</option>
                    </Select>
                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>

                {/* Date Pickers */}
                <div>
                    <label className="block font-medium mb-2">Create Day</label>
                    <DatePicker
                        name="createdAt"
                        disabled
                        value={notice.createdAt ? moment(notice.createdAt) : null}
                        format="DD-MM-YYYY" // Định dạng ngày
                        className={`w-full mt-1 p-2 border rounded-md ${errors.createdAt ? 'border-red-500' : ''}`}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">Update Day</label>
                    <DatePicker
                        name="updatedAt"
                        disabled
                        value={notice.updatedAt ? moment(notice.updatedAt) : null}
                        format="DD-MM-YYYY" // Định dạng ngày
                        className={`w-full mt-1 p-2 border rounded-md ${errors.receive_date ? 'border-red-500' : ''}`}
                    />
                </div>

                {/* Content TextArea */}
                <div className="md:col-span-2">
                    <label className="block font-medium mb-2">Content</label>
                    <Input.TextArea
                        name="content"
                        value={notice.content || ''}
                        onChange={handleChange}
                        rows={6}
                        className={`w-full ${errors.content ? 'border-red-500' : ''}`}
                    />
                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>
            </div>

            <div className="flex flex-row gap-2 justify-end">
                <Button type="primary" onClick={handleSave} className="text-[16px] p-4 w-32 mt-6">
                    Save
                </Button>
                <Button onClick={onCancel} className="text-[16px] p-4 w-32 mt-6">
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default NotificationForm;