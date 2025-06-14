import { Category, CategoryList } from '@src/types/Category';
import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '@src/types/new/Product';
import { Attribute, AttributeList } from '@src/types/Attribute';
import axiosClient from '@api/axiosClient';
import ProductInfo from './ProductInfo';
import ProductAttribute from './ProductAttribute';

interface ProductFormProps {
    initialProduct?: Partial<Product>;
    onSave: (product: Partial<Product>, filesToUpload: File[], imagesToDelete: string[]) => void;
    onCancel: () => void;
    type: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
    initialProduct = {},
    onSave,
    onCancel,
    type,
}) => {
    const [product, setProduct] = useState<Partial<Product>>(initialProduct);
    const [categories, setCategories] = useState<Category[]>([]);
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [activeStep, setActiveStep] = useState(0);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const baseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catResponse = await axiosClient.getOne<CategoryList>(
                    `${baseUrl}/api/category?page=${1}&limit=30`
                );
                setCategories(catResponse.data || []);

                const attrResponse = await axiosClient.getOne<AttributeList>(`${baseUrl}/api/attribute`);
                setAttributes(attrResponse.data || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [baseUrl]);

    const handleProductInfoChange = (updatedInfo: Partial<Product>) => {
        setProduct(prev => ({ ...prev, ...updatedInfo }));
    };

    const handleAttributesChange = (variants: ProductVariant[]) => {
        setProduct(prev => ({ ...prev, variants }));
    };

    const handleImagesToDeleteChange = (images: string[]) => {
        setImagesToDelete(images);
    };

    const validateBasicInfo = (product: Partial<Product>) => {
        const newErrors: Record<string, string> = {};
        if (!product.product_name) newErrors.product_name = "Product name is required.";
        if (!product.description) newErrors.description = "Product description is required.";
        return newErrors;
    };
    const handleSubmit = () => {
        const validationErrors = validateBasicInfo(product);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSave(product, filesToUpload, imagesToDelete);
    };

    const steps = [
        {
            title: 'Product Information',
            component: (
                <ProductInfo
                    product={product}
                    categories={categories}
                    onChange={handleProductInfoChange}
                    onFilesChange={setFilesToUpload}
                    onImagesToDeleteChange={handleImagesToDeleteChange}
                    errors={errors}
                />
            )
        },
        {
            title: 'Attributes & Variants',
            component: (
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
                    errors={errors}
                />
            )
        }
    ];

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-blue-800">
                    {type === 'add' ? 'New Product' : 'Update Product'}
                </h2>
                <div className="flex space-x-3">
                    {activeStep > 0 && (
                        <button
                            onClick={() => setActiveStep(prev => prev - 1)}
                            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                        >
                            Back
                        </button>
                    )}
                    {activeStep < steps.length - 1 ? (
                        <button
                            onClick={() => setActiveStep(prev => prev + 1)}
                            className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            {type === 'add' ? 'Create Product' : 'Update'}
                        </button>
                    )}
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex border-b border-gray-300 flex-wrap gap-2">
                    {steps.map((step, index) => (
                        <button
                            key={index}
                            className={`px-6 py-3 font-semibold rounded-t-lg transition
              ${activeStep === index
                                    ? 'text-blue-700 bg-blue-100 shadow-inner border-b-4 border-blue-700'
                                    : 'text-gray-500 hover:text-blue-400'
                                }`}
                            onClick={() => setActiveStep(index)}
                        >
                            {step.title}
                        </button>
                    ))}
                </div>
            </div>

            <div
                className="p-6 bg-white rounded-lg min-h-[300px] transition-all duration-300 ease-in-out"
                key={activeStep}
            >
                {steps[activeStep].component}
            </div>
        </div>
    );
}

export default ProductForm;
