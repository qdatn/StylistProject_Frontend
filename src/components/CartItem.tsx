import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose, AiOutlineCheck, AiOutlineDown } from 'react-icons/ai';

interface CartItemType {
    id: number;
    name: string;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    attributes: { key: string; value: string[] }[];
    stock_quantity: number;
}

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (increment: boolean) => void;
    onRemove: () => void;
    onSelect: (selected: boolean) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove, onSelect }) => {
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
    const [isSelected, setIsSelected] = useState(false);

    const handleAttributeChange = (key: string, value: string) => {
        setSelectedAttributes(prev => ({ ...prev, [key]: value }));
    };

    const toggleSelect = () => {
        const newSelected = !isSelected;
        setIsSelected(newSelected);
        onSelect(newSelected);
    };

    return (
        <div className="flex flex-col sm:flex-row items-start p-4 border-b rounded-lg bg-white-50 mb-4">
            <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded-lg mr-4" />
            <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <h2 className="font-semibold mb-1">{item.name}</h2>
                    <button onClick={onRemove} className="text-gray-300 hover:text-gray-700">
                        <AiOutlineClose size={20} />
                    </button>
                </div>
                <div className="flex flex-row gap-2 font-bold mb-2">
                    <span className="text-gray-500 line-through">£{item.originalPrice.toFixed(2)}</span>
                    <span className="text-red-500">£{item.discountedPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center mb-2 flex-wrap">
                    {item.attributes.map(attr => (
                        <div key={attr.key} className="flex items-center mr-7 mb-2">
                            <label className="text-[15px]">{attr.key}:</label>
                            <div className="relative">
                                <select
                                    value={selectedAttributes[attr.key] || attr.value[0]}
                                    onChange={(e) => handleAttributeChange(attr.key, e.target.value)}
                                    className="text-[15px] appearance-none px-4 py-2 text-gray-700 focus:outline-none bg-white pr-8"
                                >
                                    {attr.value.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <AiOutlineDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 bg-gray" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center">
                    <button onClick={() => onUpdateQuantity(false)} className="p-1 rounded-l text-gray-600 hover:bg-gray-200">
                        <AiOutlineMinus />
                    </button>
                    <span className="flex justify-center w-10">{item.stock_quantity}</span>
                    <button onClick={() => onUpdateQuantity(true)} className="p-1 rounded-r text-gray-600 hover:bg-gray-200">
                        <AiOutlinePlus />
                    </button>
                </div>
            </div>
            <button onClick={toggleSelect} className="ml-4">
                <div className={`w-6 h-6 border ${isSelected ? 'bg-gray-700' : 'bg-white'} flex items-center justify-center`}>
                    <AiOutlineCheck className={isSelected ? 'text-white' : 'text-transparent'} />
                </div>
            </button>
        </div>
    );
};

export default CartItem;
