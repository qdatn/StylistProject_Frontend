import React, { useEffect, useState } from 'react';
import { Product } from '@src/types/Product';
import { Upload, Button, Input, message, Modal } from 'antd';

interface ProductStorageFormProps {
    initialProduct?: Partial<Product>;
    onSave: (product: Partial<Product>) => void;
    onCancel: () => void;
    type: string;
}

const ProductStorageForm: React.FC<ProductStorageFormProps> = ({ initialProduct = {}, onSave, onCancel, type }) => {
    const [product, setProduct] = useState<Partial<Product>>(initialProduct);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!product._id) newErrors.id = 'Product ID is required.';
        if (!product.product_name) newErrors.name = 'Product name is required.';
        // if (!product.price || product.price <= 0)
        //     newErrors.originalPrice = 'Original price must be greater than 0.';
        // if (product.discountedPrice === undefined || product.discountedPrice < 0)
        //     newErrors.discountedPrice = 'Discounted price must not be negative.';
        // if (!product.brand) newErrors.brand = 'Brand is required.';
        if (product.stock_quantity !== undefined && product.stock_quantity < 0)
            newErrors.stock_quantity = 'Stock quantity cannot be negative.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSave = () => {
        if (validate()) {

            const finalProduct: Partial<Product> = {
                ...product,
            };
            console.log("FINAL", finalProduct);
            onSave(finalProduct);
        }
    };
    return (
        <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                <div>
                    <label className="block font-medium">Product ID</label>
                    <input
                        type="text"
                        name="_id"
                        value={product._id || ''}
                        onChange={handleChange}
                        placeholder="Enter product ID"
                        required
                        disabled
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
                        disabled
                        className={`w-full mt-1 p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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

export default ProductStorageForm;
