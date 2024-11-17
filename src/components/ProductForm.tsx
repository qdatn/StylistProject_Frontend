import React, { useState } from 'react';
import { Product } from '@src/types/Product';
import { Category, mockCategories } from '@src/types/Category';
import { IoAddSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { Upload, Button, Input, message, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


interface ProductFormProps {
    initialProduct?: Partial<Product>;
    onSave: (product: Partial<Product>) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct = {}, onSave }) => {
    const [product, setProduct] = useState<Partial<Product>>(initialProduct);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [newCategory, setNewCategory] = useState<Category>({ _id: '', category_name: '', description: '' });
    const [showNewCategoryForm, setShowNewCategoryForm] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    //const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [fileList, setFileList] = useState<any[]>([]);
    const [newImageUrl, setNewImageUrl] = useState<string>('');
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

    // Xử lý upload file
    const handleUploadChange = (info: any) => {
        let newFileList = [...info.fileList];
        setFileList(newFileList);

        // Kiểm tra trạng thái upload
        if (info.file.status === 'done') {
            message.success(`${info.file.name} uploaded successfully.`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} upload failed.`);
        }
    };

    // Thêm ảnh từ URL
    const handleAddImageFromUrl = () => {
        if (!newImageUrl.trim()) {
            message.error('Image URL cannot be empty.');
            return;
        }

        // Thêm ảnh vào danh sách
        setFileList((prev) => [
            ...prev,
            {
                uid: Date.now().toString(),
                name: 'Custom URL',
                url: newImageUrl,
                status: 'done',
            },
        ]);

        setNewImageUrl('');
        setIsUrlModalOpen(false);
        message.success('Image URL added successfully.');
    };

    // Xóa ảnh
    const handleRemoveImage = (file: any) => {
        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
        message.info('Image removed.');
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setShowNewCategoryForm(false);
    };

    const handleNewCategoryFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };


    const toggleNewCategoryForm = () => {
        setShowNewCategoryForm((prev) => !prev);
        setNewCategory({ _id: '', category_name: '', description: '' });
        setErrors((prevErrors) => ({ ...prevErrors, newCategory: '' }));
    };

    const handleAddNewCategory = () => {
        if (!newCategory._id || !newCategory.category_name) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                newCategory: 'Category ID and name are required.',
            }));
            return;
        }
        setCategories([...categories, newCategory]);
        setSelectedCategory(newCategory._id);
        setShowNewCategoryForm(false);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!product._id) newErrors.id = 'Product ID is required.';
        if (!product.product_name) newErrors.name = 'Product name is required.';
        if (!product.originalPrice || product.originalPrice <= 0) newErrors.originalPrice = 'Original price must be greater than 0.';
        if (product.discountedPrice === undefined || product.discountedPrice < 0) newErrors.discountedPrice = 'Discounted price must not be negative.';
        if (!product.brand) newErrors.brand = 'Brand is required.';
        if (product.stock_quantity !== undefined && product.stock_quantity < 0) newErrors.stock_quantity = 'Stock quantity cannot be negative.';
        if (!selectedCategory && !showNewCategoryForm) newErrors.categories = 'Please select or add at least one category.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            const selectedCategoryObj = categories.find((cat) => cat._id === selectedCategory);
            const finalProduct: Partial<Product> = {
                ...product,
                categories: selectedCategoryObj ? [selectedCategoryObj] : [],
                image: fileList,
            };
            onSave(finalProduct);
        }
    };
    const today = new Date().toISOString().split('T')[0];
    return (
        <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                <div>
                    <label className="block font-medium">Product ID</label>
                    <input
                        type="text"
                        name="id"
                        value={product._id || ''}
                        onChange={handleChange}
                        placeholder="Enter product ID"
                        required
                        className={`w-full mt-1 p-2 border rounded-md ${errors.id ? 'border-red-500' : ''}`}
                    />
                    {errors.id && <p className="text-red-500 text-sm">{errors.id}</p>}
                </div>
                <div>
                    <label className="block font-medium">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={product.product_name || ''}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className={`w-full mt-1 p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>


                <div>
                    <label className="block font-medium">Original Price</label>
                    <input
                        type="number"
                        name="originalPrice"
                        value={product.originalPrice || 0}
                        onChange={handleChange}
                        min="0"
                        required
                        placeholder="Enter original price"
                        className={`w-full mt-1 p-2 border rounded-md ${errors.originalPrice ? 'border-red-500' : ''}`}
                    />
                    {errors.originalPrice && <p className="text-red-500 text-sm">{errors.originalPrice}</p>}
                </div>

                <div>
                    <label className="block font-medium">Discounted Price</label>
                    <input
                        type="number"
                        name="discountedPrice"
                        value={product.discountedPrice || 0}
                        onChange={handleChange}
                        min="0"
                        required
                        placeholder="Enter discounted price"
                        className={`w-full mt-1 p-2 border rounded-md ${errors.discountedPrice ? 'border-red-500' : ''}`}
                    />
                    {errors.discountedPrice && <p className="text-red-500 text-sm">{errors.discountedPrice}</p>}
                </div>

                <div>
                    <label className="block font-medium">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        value={product.brand || ''}
                        onChange={handleChange}
                        placeholder="Enter brand"
                        required
                        className={`w-full mt-1 p-2 border rounded-md ${errors.brand ? 'border-red-500' : ''}`}
                    />
                    {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
                </div>
            </div>
             
            
            <div >
                <div className="justify-center mt-2 pt-2 space-y-4">
                <label className="block font-medium">Product Images</label>

                    {/* Upload nhiều ảnh */}
                    <Upload
                        multiple
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        onRemove={handleRemoveImage}
                        beforeUpload={() => false} // Không upload ngay mà chỉ hiển thị
                    >
                        <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>

                    {/* Thêm ảnh từ URL */}
                    <Button
                        type="dashed"
                        onClick={() => setIsUrlModalOpen(true)}
                        className="mt-3"
                        block
                    >
                        Add Image by URL
                    </Button>

                    {/* Modal thêm ảnh từ URL */}
                    <Modal
                        title="Add Image by URL"
                        visible={isUrlModalOpen}
                        onOk={handleAddImageFromUrl}
                        onCancel={() => setIsUrlModalOpen(false)}
                    >
                        <Input
                            type="text"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="Enter image URL"
                            className="w-full p-2 border rounded"
                        />
                    </Modal>
                </div>

                <div className=' justify-center mt-4 '>
                    <label className=" block font-medium">Decription</label>
                    <textarea
                        className="w-full mt-1 p-3 border rounded"
                        value={product.description}

                        placeholder="Write decription."
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-row gap-6">
                <div className='w-1/2 justify-center'>

                    <div>
                        <label className="block font-medium">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock_quantity"
                            value={product.stock_quantity || 0}
                            onChange={handleChange}
                            min="0"
                            required
                            placeholder="Enter stock quantity"
                            className={`w-full mt-1 p-2 border rounded-md ${errors.stock_quantity ? 'border-red-500' : ''}`}
                        />
                        {errors.stock_quantity && <p className="text-red-500 text-sm">{errors.stock_quantity}</p>}
                    </div>
                    <div>
                        <label className="block font-medium">Min Quantity</label>
                        <input
                            type="number"
                            name="min_quantity"
                            value={product.min_quantity || 0}
                            onChange={handleChange}
                            min="0"
                            placeholder="Enter stock quantity"
                            className={`w-full mt-1 p-2 border rounded-md ${errors.min_quantity ? 'border-red-500' : ''}`}
                        />
                        {errors.min_quantity && <p className="text-red-500 text-sm">{errors.min_quantity}</p>}
                    </div>
                    <div>
                        <label className="block font-medium">Sold Quantity</label>
                        <input
                            type="number"
                            name="sold_quantity"
                            value={product.sold_quantity || 0}
                            onChange={handleChange}
                            min="0"
                            placeholder="Enter stock quantity"
                            className={`w-full mt-1 p-2 border rounded-md ${errors.sold_quantity ? 'border-red-500' : ''}`}
                        />
                        {errors.sold_quantity && <p className="text-red-500 text-sm">{errors.stock_quantity}</p>}
                    </div>
                    {/* Trường ngày tạo */}
                    <div>
                        <label className="block font-medium">Create Date</label>
                        <input
                            type="date"
                            name="create_date"
                            value={today} // Giá trị là ngày hiện tại
                            disabled // Không cho phép thay đổi
                            className={`w-full mt-1 p-2 border rounded-md ${errors.create_date ? 'border-red-500' : ''}`}
                        />
                        {errors.create_date && <p className="text-red-500 text-sm">{errors.create_date}</p>}
                    </div>
                </div>
                <div className='w-1/2 justify-center'>



                    <label className="block font-medium">Category</label>
                    <div className='flex flex-row pt-2'>
                        <select
                            name="categories"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className={`w-full mt-1 p-2 border rounded-md ${errors.categories ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        <button

                            onClick={toggleNewCategoryForm}
                            className=" text-black p-2 rounded-md"
                        >
                            {showNewCategoryForm ? <IoClose /> : <IoAddSharp />}
                        </button>
                    </div>
                    <div>
                        {showNewCategoryForm ? (
                            <div>
                                <input
                                    type="text"
                                    name="_id"
                                    value={newCategory._id}
                                    onChange={handleNewCategoryFieldChange}
                                    placeholder="Category ID"
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                                <input
                                    type="text"
                                    name="category_name"
                                    value={newCategory.category_name}
                                    onChange={handleNewCategoryFieldChange}
                                    placeholder="Category Name"
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                                <input
                                    type="text"
                                    name="description"
                                    value={newCategory.description || ''}
                                    onChange={handleNewCategoryFieldChange}
                                    placeholder="Description (optional)"
                                    className="w-full mb-2 p-2 border rounded-md"
                                />
                                {errors.newCategory && <p className="text-red-500 text-sm">{errors.newCategory}</p>}
                                <Button className='text-[16px] p-4 w-full' onClick={handleAddNewCategory}>
                                    Add Category
                                </Button>
                            </div>
                        ) : null}

                        {errors.categories && <p className="text-red-500 text-sm">{errors.categories}</p>}
                    </div>
                </div>
            </div>
            <div className='flex justify-end'>
                <Button className=' text-[16px] p-4 w-32 mt-6' onClick={handleSave}>
                    Save Product
                </Button>
            </div>

        </div>
    );
};

export default ProductForm;
