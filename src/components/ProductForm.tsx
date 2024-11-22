import React, { useEffect, useState } from 'react';
import { Product } from '@src/types/Product';
import { Category, mockCategories } from '@src/types/Category';
import { IoAddSharp, IoRemove } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { Upload, Button, Input, message, Modal, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Attribute, mockAttributes } from '@src/types/Attribute';

interface ProductFormProps {
    initialProduct?: Partial<Product>;
    onSave: (product: Partial<Product>) => void;
    onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct = {}, onSave, onCancel }) => {
    const [product, setProduct] = useState<Partial<Product>>(initialProduct);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState<Category>({
        _id: '',
        category_name: '',
        description: '',
    });
    const [showNewCategoryForm, setShowNewCategoryForm] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [fileList, setFileList] = useState<any[]>([]);
    const [newImageUrl, setNewImageUrl] = useState<string>('');
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [attributes, setAttributes] = useState<Attribute[]>(mockAttributes);
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
    const [newKey, setNewKey] = useState<string>('');
    const [newValues, setNewValues] = useState<Record<string, string>>({});
    const [selectedValues, setSelectedValues] = useState<Record<string, Set<string>>>({});
    // Thêm key mới
    const handleAddKey = () => {
        if (!newKey.trim()) return;
        if (attributes.some((attr) => attr.key === newKey)) {
            alert('This attribute already exists.');
            return;
        }
        setAttributes((prev) => [...prev, { key: newKey, value: [] }]);
        setNewKey('');
    };

    // Xóa key
    const handleDeleteKey = (key: string) => {
        setAttributes((prev) => prev.filter((attr) => attr.key !== key));
        setSelectedValues((prev) => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
    };

    // Toggle hiển thị giá trị của một key
    const toggleKey = (key: string) => {
        setExpandedKeys((prev) => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(key)) {
                newExpanded.delete(key);
            } else {
                newExpanded.add(key);
            }
            return newExpanded;
        });
    };

    // Thêm giá trị vào một key
    const handleAddValue = (key: string) => {
        if (!newValues[key]?.trim()) return;
        setAttributes((prev) =>
            prev.map((attr) =>
                attr.key === key
                    ? { ...attr, value: [...attr.value, newValues[key].trim()] }
                    : attr
            )
        );
        setNewValues((prev) => ({ ...prev, [key]: '' }));
    };

    // Xóa giá trị khỏi một key
    const handleDeleteValue = (key: string, value: string) => {
        setAttributes((prev) =>
            prev.map((attr) =>
                attr.key === key ? { ...attr, value: attr.value.filter((v) => v !== value) } : attr
            )
        );
        setSelectedValues((prev) => {
            const updated = { ...prev };
            if (updated[key]) {
                updated[key].delete(value);
            }
            return updated;
        });
    };

    // Xử lý checkbox thay đổi
    const handleCheckboxChange = (key: string, value: string) => {
        setSelectedValues((prev) => {
            const updated = { ...prev };
            if (!updated[key]) {
                updated[key] = new Set();
            }
            if (updated[key].has(value)) {
                updated[key].delete(value);
            } else {
                updated[key].add(value);
            }
            return updated;
        });
    };
    useEffect(() => {
        if (initialProduct?.images) {
            // Chuyển đổi URL sang format fileList
            const formattedImages = initialProduct.images.map((url, index) => ({
                uid: `${index}`,
                name: `Image-${index + 1}`,
                status: 'done',
                url: url, // URL của ảnh
            }));
            setFileList(formattedImages);
        }
        if (initialProduct?.categories) {
            const categoryIds = initialProduct.categories.map((category) => category._id);
            setSelectedCategories(categoryIds);
        }
        if (initialProduct?.attributes) {
            // Cập nhật attributes dựa trên sản phẩm
            const productAttributes: Attribute[] = product.attributes || [];
            setAttributes((prevAttributes) => {
                return prevAttributes.map((attr) => {
                    const productAttr = productAttributes.find((pa) => pa.key === attr.key);
                    return productAttr
                        ? { ...attr, value: Array.from(new Set([...attr.value, ...productAttr.value])) }
                        : attr;
                });
            });

            // Cập nhật các giá trị đã được chọn (checkbox)
            const selected = productAttributes.reduce((acc, attr) => {
                acc[attr.key] = new Set(attr.value);
                return acc;
            }, {} as Record<string, Set<string>>);

            setSelectedValues(selected);
        }
    }, [initialProduct]);
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

    const handleCategoryCheckboxChange = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId) // Bỏ chọn nếu đã tồn tại
                : [...prev, categoryId] // Thêm nếu chưa tồn tại
        );
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

        setShowNewCategoryForm(false);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!product._id) newErrors.id = 'Product ID is required.';
        if (!product.product_name) newErrors.name = 'Product name is required.';
        if (!product.price || product.price <= 0)
            newErrors.originalPrice = 'Original price must be greater than 0.';
        if (product.discountedPrice === undefined || product.discountedPrice < 0)
            newErrors.discountedPrice = 'Discounted price must not be negative.';
        if (!product.brand) newErrors.brand = 'Brand is required.';
        if (product.stock_quantity !== undefined && product.stock_quantity < 0)
            newErrors.stock_quantity = 'Stock quantity cannot be negative.';
        if (selectedCategories.length === 0) newErrors.categories = 'Please select at least one category.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            const updatedAttributes = attributes.map((attr) => ({
                key: attr.key,
                value: Array.from(selectedValues[attr.key] || []),
            }));
            const selectedCategoryObjects = categories.filter((cat) =>
                selectedCategories.includes(cat._id)
            );
            const finalProduct: Partial<Product> = {
                ...product,
                attributes: updatedAttributes,
                categories: selectedCategoryObjects,
                images: fileList.map((file) => file.url || file.response?.url || ''), // Lấy URL từ fileList
            };
            onSave(finalProduct);
        }
    };
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">

            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2">
                <div>
                    <label className="block font-medium">Product ID</label>
                    <input
                        type="text"
                        name="_id"
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
                        name="product_name"
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
                        name="price"
                        value={product.price || 0}
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
                        name="description"
                        value={product.description || ''}
                        onChange={handleChange} // Thêm sự kiện onChange
                        placeholder="Write description."
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>
            </div>

            <div className="mt-6 flex flex-row ">
                <div className='w-1/2 justify-center pr-6'>

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
                            name="createdAt"
                            value={today} // Giá trị là ngày hiện tại
                            disabled // Không cho phép thay đổi
                            className={`w-full mt-1 p-2 border rounded-md ${errors.createdAt ? 'border-red-500' : ''}`}
                        />
                        {errors.createdAt && <p className="text-red-500 text-sm">{errors.createdAt}</p>}
                    </div>
                </div>

            </div>
            <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2">
                {/* Các attribute */}
                <div>
                    <label className="font-medium">Attributes</label>
                    <div className="flex items-center gap-2 mb-4">
                        <Input
                            type="text"
                            className="p-2 border rounded-md"
                            value={newKey}
                            placeholder="Enter new attribute (e.g., Color)"
                            onChange={(e) => setNewKey(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleAddKey}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            <IoAddSharp />
                        </button>
                    </div>

                    {/* Hiển thị danh sách attribute */}
                    {attributes.map((attr) => (
                        <div key={attr.key} className="border-b border-gray-200 pb-4 mb-4">
                            <div className="flex justify-between items-center">
                                {/* Key của attribute */}
                                <span
                                    className="cursor-pointer text-[15px] text-gray-800 flex items-center gap-1"
                                    onClick={() => toggleKey(attr.key)}
                                >
                                    {attr.key} {expandedKeys.has(attr.key) ? <IoRemove /> : <IoAddSharp />}
                                </span>

                                {/* Nút xóa key */}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteKey(attr.key)}
                                    className="text-gray-500 hover:underline"
                                >
                                    <IoClose />
                                </button>
                            </div>

                            {/* Hiển thị giá trị (value) nếu key được mở rộng */}
                            {expandedKeys.has(attr.key) && (
                                <div>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {attr.value.map((val) => (
                                            <div key={val} className="group flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedValues[attr.key]?.has(val) || false}
                                                    onChange={() => handleCheckboxChange(attr.key, val)}
                                                    className="form-checkbox"
                                                />
                                                <span>{val}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteValue(attr.key, val)}
                                                    className=" text-gray-300 group-hover:text-gray-800"
                                                >
                                                    <IoClose />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Thêm giá trị mới */}
                                    <div className="flex items-center gap-2 mt-4">
                                        <Input
                                            type="text"
                                            value={newValues[attr.key] || ''}
                                            placeholder={`Add value to ${attr.key}`}
                                            className=" border rounded-md w-1/2"
                                            onChange={(e) =>
                                                setNewValues((prev) => ({ ...prev, [attr.key]: e.target.value }))
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddValue(attr.key)}
                                            className="p-1.5 bg-gray-400 text-white rounded hover:bg-gray-500"
                                        >
                                            <IoAddSharp />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div >
                    <label className="block font-medium">Category</label>
                    <div className='flex flex-row pt-3 pb-3'>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2">
                            {categories.map((category) => (
                                <div key={category._id} className="flex items-center text-[15px]">
                                    <input
                                        type="checkbox"
                                        id={category._id}
                                        value={category._id}
                                        checked={selectedCategories.includes(category._id)}
                                        onChange={() => handleCategoryCheckboxChange(category._id)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={category._id}>{category.category_name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={toggleNewCategoryForm}
                            className=" text-black pt-2 text-[15px] rounded-md flex flex-row gap-2 justify-center items-center"
                        >Add new category
                            {showNewCategoryForm ? <IoClose /> : <IoAddSharp />}
                        </button>
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
                <div>
                    <label className="block font-medium">Status</label>
                    <Checkbox
                        checked={product.status}
                        onChange={(e) => setProduct({ ...product, status: e.target.checked })}
                        className={`mt-1 ${errors.status ? 'text-red-500' : ''}`}
                    >
                        Active
                    </Checkbox>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                </div>
            </div>
            <div className='flex flex-row gap-2 justify-end'>
                <div className='flex '>
                    <Button className=' text-[16px] p-4 w-32 mt-6' onClick={handleSave}>
                        Save
                    </Button>
                </div>
                <div className='flex justify-end'>
                    <Button
                        className=' text-[16px] p-4 w-32 mt-6'
                        onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default ProductForm;
