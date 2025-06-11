import React, { useEffect, useState } from 'react';
import { Product, ProductVariant } from '@src/types/new/Product';
import { Button, Input, message, Modal, Checkbox } from 'antd';
import { Attribute, AttributeList } from '@src/types/Attribute';
import axiosClient from '@api/axiosClient';
import ProductAttribute from './new/ProductAttribute';

interface ProductStorageFormProps {
    initialProduct?: Partial<Product>;
    onSave: (product: Partial<Product>) => void;
    onCancel: () => void;
    type: string;
}

const ProductStorageForm: React.FC<ProductStorageFormProps> = ({ initialProduct = {}, onSave, onCancel, type }) => {
    const [product, setProduct] = useState<Partial<Product>>(initialProduct);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [activeStep, setActiveStep] = useState(0);

    const baseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const attrResponse = await axiosClient.getOne<AttributeList>(`${baseUrl}/api/attribute`);
                setAttributes(attrResponse.data || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [baseUrl]);

    const handleAttributesChange = (variants: ProductVariant[]) => {
        setProduct(prev => ({ ...prev, variants }));
    };

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
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-blue-800">
                    {type === 'add' ? 'New Product' : 'Update Product'}
                </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
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
            <div className='mt-6'>
                <ProductAttribute
                    attributes={attributes}
                    variants={product.variants || []}
                    onChange={handleAttributesChange}
                    onAddKey={async (key) => {
                        try {
                            const response = await axiosClient.post<Attribute>(`${baseUrl}/api/attribute`, {
                                key: key.trim(),
                                value: [],
                            });
                            setAttributes(prev => [...prev, response]);
                        } catch (error) {
                            console.error("Error adding attribute key:", error);
                        }
                    }}
                    onDeleteKey={async (key) => {
                        try {
                            await axiosClient.delete(`${baseUrl}/api/attribute/${key}`);
                            setAttributes(prev => prev.filter(attr => attr.key !== key));
                        } catch (error) {
                            console.error("Error deleting attribute key:", error);
                        }
                    }}
                    onAddValue={async (key, value) => {
                        try {
                            await axiosClient.put(`${baseUrl}/api/attribute/${key}/addValues`, {
                                values: [value],
                            });
                            setAttributes(prev =>
                                prev.map(attr =>
                                    attr.key === key ? { ...attr, value: [...attr.value, value] } : attr
                                )
                            );
                        } catch (error) {
                            console.error("Error adding attribute value:", error);
                        }
                    }}
                    onDeleteValue={async (key, value) => {
                        try {
                            await axiosClient.put(`${baseUrl}/api/attribute/${key}/deleteValues`, {
                                values: [value],
                            });
                            setAttributes(prev =>
                                prev.map(attr =>
                                    attr.key === key ? { ...attr, value: attr.value.filter(v => v !== value) } : attr
                                )
                            );
                        } catch (error) {
                            console.error("Error deleting attribute value:", error);
                        }
                    }}
                />
            </div>

            <div className='flex items-center space-x-4 mt-4'>
                <label className="block font-medium">Status</label>
                <Checkbox
                    checked={product.status}
                    onChange={(e) =>
                        setProduct({ ...product, status: e.target.checked })
                    }
                    className={`text-lg font-medium ${errors.status ? "text-red-500" : ""}`}
                >
                    Active
                </Checkbox>
                {errors.status && (
                    <p className="text-red-500 text-sm">{errors.status}</p>
                )}
            </div>
            <div className='flex flex-row gap-2 justify-end'>
                <div className='flex '>
                    <Button
                        className=' text-[16px] p-4 w-32 mt-6'
                        type="primary"
                        onClick={handleSave}>
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
