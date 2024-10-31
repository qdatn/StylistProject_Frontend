"use client";
import React, { useState } from 'react';
import CartItem from '@/components/CartItem';
import Header from '@/layouts/main-layout/header';
import Footer from '@/layouts/main-layout/footer';
import { Product } from '@/models/Product'; // Giả định bạn đã có định nghĩa Product trong mô hình

const CartPage: React.FC<{ items: Product[] }> = ({ items }) => { // Giả định bạn sẽ nhận items từ props
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        paymentMethod: ''
    });
    const [cartItems, setCartItems] = useState<Product[]>(items || []); // Sử dụng sản phẩm từ props
    const [discountCode, setDiscountCode] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const applyDiscount = (amount: number) => {
        if (discountCode === '10%') {
            return amount * 0.9; // Giảm giá 10%
        } else if (discountCode === '20%') {
            return amount * 0.8; // Giảm giá 20%
        }
        return amount; // Không có giảm giá
    };

    const totalAmount = applyDiscount(
        cartItems.reduce((total, item) => {
            if (selectedItems.includes(item.id)) {
                return total + (item.discountedPrice * item.stock_quantity);
            }
            return total;
        }, 0)
    );
    const updateQuantity = (itemId: string, increment: boolean) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, stock_quantity: increment ? item.stock_quantity + 1 : Math.max(item.stock_quantity - 1, 1) }
                    : item
            )
        );
    };

    const removeItem = (itemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        setSelectedItems(prevSelected => prevSelected.filter(id => id !== itemId));
    };

    const toggleSelectItem = (itemId: string, selected: boolean) => {
        setSelectedItems(prevSelected =>
            selected ? [...prevSelected, itemId] : prevSelected.filter(id => id !== itemId)
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        console.log("Order submitted with payment method:", formData.paymentMethod);
    };

    return (
        <>
        <Header/>
                <div className="container mx-auto p-4 flex flex-col md:flex-row bg-white">
                {/* Danh sách sản phẩm trong giỏ hàng */}
                <div className="md:w-2/3 p-4 border-r text-gray-700">
                    <h1 className="text-lg font-semibold mb-4">Shopping Cart</h1>
                    {cartItems.map(item => (
                        <CartItem
                        key={item.id}
                        id={item.id}
                        item={{
                            id: item.id, 
                            name: item.name,
                            originalPrice: item.originalPrice,
                            discountedPrice: item.discountedPrice,
                            attributes: item.attributes,
                            quantity: item.stock_quantity
            
                        }}
                        onUpdateQuantity={(increment) => updateQuantity(item.id, increment)}
                        onRemove={() => removeItem(item.id)}
                        onSelect={(selected) => toggleSelectItem(item.id, selected)}
                    />
                    ))}
                    <div className="flex justify-between font-semibold mt-4">
                        <span>Total Amount:</span>
                        <span>£{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="mt-2">
                        <label className="block">Choose Discount:</label>
                        <select
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="border p-2 w-full"
                        >
                            <option value="">Select Discount</option>
                            <option value="10%">10% Discount</option>
                            <option value="20%">20% Discount</option>
                        </select>
                    </div>
                </div>
                
                {/* Form nhập thông tin đặt hàng */}
                <div className="md:w-1/3 p-4 text-gray-700">
                    <h2 className="text-lg font-semibold mb-4">Information</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border p-2 w-full mb-4"
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border p-2 w-full mb-4"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border p-2 w-full mb-4"
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="border p-2 w-full mb-4"
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="border p-2 w-full mb-4"
                    />
                    <input
                        type="text"
                        name="district"
                        placeholder="District"
                        value={formData.district}
                        onChange={handleChange}
                        className="border p-2 w-full mb-4"
                    />
                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="border p-2 w-full mb-4"
                    >
                        <option value="">Select Payment Method</option>
                        <option value="COD">COD - Cash On Delivery</option>
                        <option value="CreditCard">Credit Card</option>
                    </select>
                    <button onClick={handleSubmit} className="bg-yellow-500 text-white py-2 px-4 rounded w-full">
                        Place Order
                    </button>
                    
                    {/* Nút Đặt Hàng */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 h-20 shadow-lg flex flex-row gap-2 hidden md:flex justify-end">
                        <div className='flex flex-row gap-2 text-lg font-medium items-center'>
                            <div className='truncate'>Total Amount:</div>
                            <div>£{totalAmount.toFixed(2)}</div>
                        </div>
                        <button onClick={handleSubmit} className="bg-yellow-500 text-lg font-medium text-white py-2 px-4 rounded w-[400px] h-full">
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CartPage;
