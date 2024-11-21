import React, { useEffect, useState } from 'react';
import { Category, mockCategories } from '@src/types/Category';
import { Button } from 'antd';

interface CategoryFormProps {
    initialCategory?: Partial<Category>;
    onSave: (Category: Partial<Category>) => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialCategory = {}, onSave, onCancel }) => {
    const [Category, setCategory] = useState<Partial<Category>>(initialCategory);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Xử lý thay đổi dữ liệu trong form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategory((prev) => ({
            ...prev,
            [name]: value, // Cập nhật giá trị của trường đang thay đổi
        }));
    };

    // Kiểm tra tính hợp lệ của dữ liệu trước khi lưu
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!Category._id) newErrors.id = 'Category ID is required.';
        if (!Category.category_name) newErrors.name = 'Category name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Lưu dữ liệu và gọi hàm onSave
    const handleSave = () => {
        if (validate()) {
            console.log('Saving category:', Category);
            // Chỉ cần gọi onSave và truyền dữ liệu đã cập nhật
            onSave(Category);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2">
                <div>
                    <label className="block font-medium">Category ID</label>
                    <input
                        type="text"
                        name="_id"
                        value={Category._id || ''}
                        onChange={handleChange}
                        placeholder="Enter Category ID"
                        required
                        className={`w-full mt-1 p-2 border rounded-md ${errors.id ? 'border-red-500' : ''}`}
                    />
                    {errors.id && <p className="text-red-500 text-sm">{errors.id}</p>}
                </div>
                <div>
                    <label className="block font-medium">Category Name</label>
                    <input
                        type="text"
                        name="category_name" // Đảm bảo tên này khớp với trường trong Category
                        value={Category.category_name || ''}
                        onChange={handleChange}
                        placeholder="Enter Category name"
                        className={`w-full mt-1 p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className='justify-center mt-4'>
                    <label className="block font-medium">Description</label>
                    <textarea
                        className="w-full mt-1 p-3 border rounded"
                        name="description"
                        value={Category.description || ''}
                        onChange={handleChange}
                        placeholder="Write description."
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>
            </div>

            <div className='flex flex-row gap-2 justify-end'>
                <div className='flex'>
                    <Button className='text-[16px] p-4 w-32 mt-6' onClick={handleSave}>
                        Save
                    </Button>
                </div>
                <div className='flex justify-end'>
                    <Button
                        className='text-[16px] p-4 w-32 mt-6'
                        onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;
