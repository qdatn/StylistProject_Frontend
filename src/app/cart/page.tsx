// app/cart/page.tsx
"use client"; // Đánh dấu file này là Client Component

import React, { useState } from 'react';
import CartItem from '@/components/CartItem';

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Product 1', image: 'https://via.placeholder.com/64', price: '£30.00', quantity: 1 },
        { id: 2, name: 'Product 2', image: 'https://via.placeholder.com/64', price: '£45.00', quantity: 2 },
    ]);

    const handleIncreaseQuantity = (index: number) => {
        const newCartItems = [...cartItems];
        newCartItems[index].quantity += 1;
        setCartItems(newCartItems);
    };

    const handleDecreaseQuantity = (index: number) => {
        const newCartItems = [...cartItems];
        newCartItems[index].quantity = Math.max(1, newCartItems[index].quantity - 1);
        setCartItems(newCartItems);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
            {cartItems.map((item, index) => (
                <CartItem
                    key={item.id}
                    product={item}
                    quantity={item.quantity}
                    onIncrease={() => handleIncreaseQuantity(index)}
                    onDecrease={() => handleDecreaseQuantity(index)}
                />
            ))}
        </div>
    );
};

export default CartPage;
