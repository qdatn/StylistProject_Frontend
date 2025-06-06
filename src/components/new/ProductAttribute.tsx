import { ProductVariant } from '@src/types/new/Product';
import { Attribute } from '@src/types/Attribute';
import React, { useState } from 'react';
import { IoAddSharp, IoClose } from 'react-icons/io5';

interface ProductAttributeProps {
    attributes: Attribute[];
    variants: ProductVariant[];
    onChange: (variants: ProductVariant[]) => void;
    onAddKey: (key: string) => void;
    onDeleteKey: (key: string) => void;
    onAddValue: (key: string, value: string) => void;
    onDeleteValue: (key: string, value: string) => void;
}

const ProductAttribute: React.FC<ProductAttributeProps> = ({
    attributes,
    variants,
    onChange,
    onAddKey,
    onDeleteKey,
    onAddValue,
    onDeleteValue,
}) => {
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
    const [variantValues, setVariantValues] = useState<Record<string, string[]>>({});
    const [generatedVariants, setGeneratedVariants] = useState<ProductVariant[]>(variants);
    const [newKey, setNewKey] = useState('');
    const [newValues, setNewValues] = useState<Record<string, string>>({});
    const existingKeys = attributes.map(attr => attr.key);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleAttributeSelect = (attrKey: string) => {
        if (selectedAttributes.includes(attrKey)) {
            const updated = selectedAttributes.filter(attr => attr !== attrKey);
            setSelectedAttributes(updated);
            const newValues = { ...variantValues };
            delete newValues[attrKey];
            setVariantValues(newValues);
        } else {
            setSelectedAttributes([...selectedAttributes, attrKey]);
            const attr = attributes.find(a => a.key === attrKey);
            if (attr) {
                setVariantValues({
                    ...variantValues,
                    [attrKey]: [],
                });
            }
        }
    };

    const handleValueToggle = (attrKey: string, value: string) => {
        const currentValues = variantValues[attrKey] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        setVariantValues({
            ...variantValues,
            [attrKey]: newValues,
        });
    };

    const generateVariants = () => {
        const newVariants: ProductVariant[] = [];

        const generateCombinations = (attrs: string[], index = 0, current: any = {}) => {
            if (index === attrs.length) {
                const variant = {
                    attributes: Object.keys(current).map(key => ({
                        key,
                        value: current[key],
                    })),
                    price: 0,
                    stock_quantity: 0,
                    min_quantity: 1,
                    discounted_price: 0,
                    sold_quantity: 0,
                };

                const exists = generatedVariants.some(v =>
                    v.attributes.every(attr =>
                        current[attr.key] === attr.value
                    )
                );

                if (!exists) {
                    newVariants.push(variant);
                }
                return;
            }

            const attrKey = attrs[index];
            variantValues[attrKey].forEach(value => {
                generateCombinations(attrs, index + 1, { ...current, [attrKey]: value });
            });
        };

        generateCombinations(selectedAttributes);

        if (newVariants.length > 0) {
            const updated = [...generatedVariants, ...newVariants];
            setGeneratedVariants(updated);
            onChange(updated);
        }
    };

    const handleVariantChange = (index: number, field: string, value: any) => {
        const updated = [...generatedVariants];
        updated[index] = { ...updated[index], [field]: value };
        setGeneratedVariants(updated);
        onChange(updated);
    };

    const handleDeleteVariant = (index: number) => {
        const updated = generatedVariants.filter((_, i) => i !== index);
        setGeneratedVariants(updated);
        onChange(updated);
    };

    const handleAddKeySubmit = () => {
        const trimmedKey = newKey.trim();

        if (!trimmedKey) return;

        const isDuplicate = attributes.some(
            (attr) => attr.key.toLowerCase() === trimmedKey.toLowerCase()
        );

        if (isDuplicate) {
            setErrors((prev) => ({
                ...prev,
                newKey: "This attribute key already exists.",
            }));
            return;
        }

        onAddKey(trimmedKey);
        setNewKey('');
        setErrors((prev) => ({ ...prev, newKey: '' })); // Clear error
    };

    const handleAddValueSubmit = (key: string) => {
        const valueToAdd = newValues[key]?.trim();
        if (valueToAdd) {
            onAddValue(key, valueToAdd);
            setNewValues(prev => ({ ...prev, [key]: '' }));
        }
    };

    return (
        <div className="space-y-6 ">
            <div className="border rounded-lg p-4 bg-white">
                <div className="mb-4">
                    <h3 className="font-medium mb-2">Manage Attributes</h3>
                    <div className='flex justify-between items-center'>
                        <div className="flex flex-wrap gap-2">
                            {attributes.map(attr => (
                                <div key={attr.key} className={`group flex items-center px-1 rounded ${selectedAttributes.includes(attr.key)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200'
                                    }`}>
                                    <button
                                        type="button"
                                        onClick={() => handleAttributeSelect(attr.key)}
                                        className={`px-3 py-1 rounded-full`}
                                    >
                                        {attr.key}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDeleteKey(attr.key)}
                                        className="text-gray-500 hover:underline"
                                        title={`Delete ${attr.key} attribute`}
                                    >
                                        <IoClose />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={newKey}
                                    onChange={(e) => setNewKey(e.target.value)}
                                    placeholder="Enter new attribute key"
                                    className="flex-1 px-3 py-2 border rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddKeySubmit}
                                    className="px-1 text-gray-600 hover:text-gray-800 text-xl"
                                    title="Add Attribute"
                                >
                                    <IoAddSharp />
                                </button>
                            </div>
                            {errors.newKey && (
                                <p className="text-red-500 text-sm mt-1">{errors.newKey}</p>
                            )}
                        </div>
                    </div>
                </div>



                {selectedAttributes.length > 0 && (
                    <div className="mt-4 ">
                        <h4 className="font-medium mb-2 ">Select Attribute Values</h4>
                        {selectedAttributes.map(attrKey => {
                            const attr = attributes.find(a => a.key === attrKey);
                            return (
                                <div key={attrKey} className="mb-4 p-3 bg-white rounded-md">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-medium">{attrKey}</p>
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                value={newValues[attrKey] || ''}
                                                onChange={(e) => {
                                                    setNewValues(prev => ({
                                                        ...prev,
                                                        [attrKey]: e.target.value
                                                    }));

                                                }}
                                                placeholder="Add new value"
                                                className="px-3 py-1 border rounded-md "
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleAddValueSubmit(attrKey)}
                                                className="px-1 text-gray-600 hover:text-gray-800 text-xl"
                                            >
                                                <IoAddSharp />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {attr?.value.map(val => (
                                            <div key={val}
                                                className={`group flex items-center px-1 rounded  ${variantValues[attrKey]?.includes(val)
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200'
                                                    }`}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleValueToggle(attrKey, val)}
                                                    className={`px-3 py-1 rounded-full  `}
                                                >
                                                    {val}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteValue(attrKey, val)}
                                                    className="text-gray-300 group-hover:text-gray-800"
                                                    title={`Delete ${val} value`}
                                                >
                                                    <IoClose />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={generateVariants}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                            Generate Variants
                        </button>
                    </div>
                )}
            </div>

            {
                generatedVariants.length > 0 && (
                    <div className="overflow-x-auto">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium">Manage Variants</h3>
                            <p className="text-sm text-gray-500">
                                {generatedVariants.length} variants created
                            </p>
                        </div>

                        <table className="min-w-full border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">Attributes</th>
                                    <th className="border p-2">Original Price ($)</th>
                                    {/* <th className="border p-2">Discounted Price ($)</th> */}
                                    <th className="border p-2">Stock</th>
                                    <th className="border p-2">Min Quantity</th>
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generatedVariants.map((variant, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">
                                            {variant.attributes.map((attr, i) => (
                                                <div key={i} className="flex items-center">
                                                    <span className="font-medium">{attr.key}:</span>
                                                    <span className="ml-1">{attr.value}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                value={variant.price || 0}
                                                onChange={(e) =>
                                                    handleVariantChange(index, 'price', Number(e.target.value))
                                                }
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </td>

                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                value={variant.stock_quantity || 0}
                                                onChange={(e) =>
                                                    handleVariantChange(index, 'stock_quantity', Number(e.target.value))
                                                }
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                value={variant.min_quantity || 0}
                                                onChange={(e) =>
                                                    handleVariantChange(index, 'min_quantity', Number(e.target.value))
                                                }
                                                min="1"
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </td>
                                        <td className="border p-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteVariant(index)}
                                                className="text-red-600 hover:text-red-800 px-2 py-1"
                                                title="Delete variant"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div >
    );
};

export default ProductAttribute;