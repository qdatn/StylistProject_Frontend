import React, { useEffect, useState } from 'react';
import { Category, mockCategories } from '@src/types/Category';
import { Button } from 'antd';

interface CategoryFormProps {
    initialCategory?: Partial<Category>;
    onSave: (category: Partial<Category>) => void;
    onCancel: () => void;
    type: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialCategory = {}, onSave, onCancel, type }) => {
    const [category, setCategory] = useState<Partial<Category>>(initialCategory);
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
        //if (!Category._id) newErrors.id = 'Category ID is required.';
        if (!category.category_name) newErrors.name = 'Category name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Lưu dữ liệu và gọi hàm onSave
    const handleSave = () => {

        if (validate()) {
            console.log('Saving category:', category);
            // Chỉ cần gọi onSave và truyền dữ liệu đã cập nhật
            onSave(category);
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-blue-800">
                    {type === 'add' ? 'New Category' : 'Update Category'}
                </h2>
            </div>
            <div className="gap-y-4 md:grid-cols-2 lg:grid-cols-2">

                <div>
                    <label className="block font-medium">Category Name</label>
                    <input
                        type="text"
                        name="category_name" // Đảm bảo tên này khớp với trường trong Category
                        value={category.category_name || ''}
                        onChange={handleChange}
                        placeholder="Enter Category name"
                        className={`w-full mt-1 p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className='justify-center mt-4'>
                    <label className="block font-medium">Description</label>
                    <textarea
                        className="w-full mt-1 p-3 border rounded h-40"
                        name="description"
                        value={category.description || ''}
                        onChange={handleChange}
                        placeholder="Write description."
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>
            </div>

            <div className='flex flex-row gap-2 justify-end'>
                <div className='flex'>
                    <Button className='text-[16px] p-4 w-32 mt-6'
                        type="primary"
                        onClick={handleSave}>
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
