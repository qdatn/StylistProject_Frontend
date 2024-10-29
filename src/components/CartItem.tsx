// components/CartItem.tsx
import React from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

// Define CartItemProps to accept product data and quantity change handlers
interface CartItemProps {
    product: {
        id: number;
        name: string;
        image: string;
        price: string;
    };
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, quantity, onIncrease, onDecrease }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            {/* Product Image */}
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />

            {/* Product Details */}
            <div className="flex flex-col flex-grow pl-4">
                <h2 className="text-sm font-medium text-gray-700">{product.name}</h2>
                <p className="text-gray-500">{product.price}</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center">
                <button className="border p-2" onClick={onDecrease}>
                    <AiOutlineMinus />
                </button>
                <span className="mx-2 w-8 flex items-center justify-center">{quantity}</span> {/* Centered Quantity */}
                <button className="border p-2" onClick={onIncrease}>
                    <AiOutlinePlus />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
