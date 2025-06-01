import React, { useEffect, useState } from 'react';
import { UserAccount } from '@src/types/UserAccount';
import { Button, DatePicker } from 'antd';
import moment from 'moment';

interface CustomerFormProps {
    initialCustomer?: Partial<UserAccount>;
    onSave: (customer: Partial<UserAccount>) => void;
    onCancel: () => void;
    type: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ initialCustomer = {}, onSave, onCancel }) => {
    const [customer, setCustomer] = useState<Partial<UserAccount>>(initialCustomer);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Xử lý thay đổi dữ liệu trong form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({
            ...prev,
            [name]: value, // Cập nhật giá trị của trường đang thay đổi
        }));
    };

    // Kiểm tra tính hợp lệ của dữ liệu trước khi lưu
    const validate = () => {
        const newErrors: Record<string, string> = {};
        //if (!Customer._id) newErrors.id = 'Customer ID is required.';
        if (!customer.name) newErrors.name = 'Customer name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Lưu dữ liệu và gọi hàm onSave
    const handleSave = () => {

        if (validate()) {
            console.log('Saving customer:', customer);
            // Chỉ cần gọi onSave và truyền dữ liệu đã cập nhật
            onSave(customer);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5">

                <div>
                    <label className="block font-medium">Customer Name</label>
                    <div className={`w-full mt-1 p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}>
                        {customer.name || ''}
                    </div>
                </div>
                <div>
                    <label className="block font-medium">Customer Email</label>
                    <div className={`w-full mt-1 p-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}>
                        {customer.user?.email || ''}
                    </div>
                </div>
                <div className='justify-center'>
                    <label className="block font-medium">Customer Gender</label>
                    <div className={`w-full mt-1 p-2 border rounded-md ${errors.gender ? 'border-red-500' : ''}`}>
                        {customer.gender || ''}
                    </div>
                </div>
                <div>
                    <label className="block font-medium">Customer Birthday</label>
                    <DatePicker
                        name="birthday"
                        value={customer.birthday ? moment(customer.birthday) : null}
                        format="DD-MM-YYYY" // Định dạng ngày
                        placeholder="Select creat date"
                        disabled
                        className={`w-full mt-1 p-2 border rounded-md ${errors.birthday ? 'border-red-500' : ''}`}
                    />
                    {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday}</p>}
                </div>

                <div className='justify-center'>
                    <label className="block font-medium">Phone Number</label>
                    <div className={`w-full mt-1 p-2 border rounded-md ${errors.phone_number ? 'border-red-500' : ''}`}>
                        {customer.phone_number || ''}
                    </div>
                </div>

                {/* <div className='justify-center'>
                    <label className="block font-medium">Style Preferences </label>
                    <div className={`w-full mt-1 p-2 border rounded-md ${errors.style_preferences ? 'border-red-500' : ''}`}>
                        {customer.style_preferences || 'No provided'}
                    </div>
                </div> */}
            </div>
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2 pb-5">
                <div className='justify-center'>
                    <label className="block font-medium">Body Shape</label>
                    <div className={`w-full mt-1 p-2 border rounded-md ${errors.body_shape ? 'border-red-500' : ''}`}>
                        {customer.body_shape || ''}
                    </div>
                </div>
                <div className='justify-center'>
                    <label className="block font-medium">Height</label>
                    <div className={`w-full mt-1 p-2 border rounded-md ${errors.height ? 'border-red-500' : ''}`}>
                        {customer.height || 'No Provided'}
                    </div>
                </div>
                <div className='justify-center'>
                    <label className="block font-medium">Weight</label>
                    <div className={`w-full mt-1 p-2 border rounded-md ${errors.weight ? 'border-red-500' : ''}`}>
                        {customer.weight || 'No Provided'}
                    </div>
                </div>
            </div>

            <div className='flex flex-row gap-2 justify-end'>
                {/* <div className='flex'>
                    <Button className='text-[16px] p-4 w-32 mt-6'
                        type="primary"
                        onClick={handleSave}>
                        Save
                    </Button>
                </div> */}
                <div className='flex justify-end'>
                    <Button
                        className='text-[16px] p-4 w-32 mt-6'
                        onClick={onCancel}>
                        Back
                    </Button>
                </div>
            </div>
        </div>

    );
};

export default CustomerForm;
