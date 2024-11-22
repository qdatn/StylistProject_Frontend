"use client";
import React, { useEffect, useState } from "react";
import CartItem from "@components/CartItem";
import { Product } from "@src/types/Product"; // Giả định bạn đã có định nghĩa Product trong mô hình
import axiosClient from "@api/axiosClient";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Cart } from "@src/types/Cart";
import { Input } from "antd";

const CartPage = () => {
  const user = useSelector((state: RootState) => state.auth);
  const urlPath = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    paymentMethod: "",
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    paymentMethod: '',
  });
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [discountCode, setDiscountCode] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const fetchCartItem = async () => {
    const userId = user.auth.user?.user._id;
    try {
      const cartItem = await axiosClient.getOne<Cart>(`${urlPath}/api/cart/${userId}`);
      setCartItems(cartItem.products);
      const initialQuantities = cartItem.products.reduce((acc, product) => {
        acc[product._id] = 1; // Khởi tạo số lượng mặc định là 1
        return acc;
      }, {} as { [key: string]: number });
      setQuantities(initialQuantities);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchCartItem();
  }, []);

  const applyDiscount = (amount: number) => {
    if (discountCode === "10%") return amount * 0.9;
    if (discountCode === "20%") return amount * 0.8;
    return amount;
  };

  const totalAmount = applyDiscount(
    cartItems.reduce((total, item) => {
      if (selectedItems.includes(item._id)) {
        return total + item.price * (quantities[item._id] || 1);
      }
      return total;
    }, 0)
  );

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: newQuantity,
    }));
  };

  const removeItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    setSelectedItems((prevSelected) => prevSelected.filter((_id) => _id !== itemId));
    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[itemId];
      return updatedQuantities;
    });
  };

  const toggleSelectItem = (itemId: string, selected: boolean) => {
    setSelectedItems((prevSelected) =>
      selected
        ? [...prevSelected, itemId]
        : prevSelected.filter((_id) => _id !== itemId)
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const order = cartItems
      .filter((item) => selectedItems.includes(item._id))
      .map((item) => ({
        productId: item._id,
        quantity: quantities[item._id] || 1,
      }));
    if (!validateForm()) return;
    console.log("Order submitted:", order);
  };
  const validateForm = () => {
    const newErrors: typeof errors = {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      district: "",
      paymentMethod: "",
    };

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone number must be 10 digits.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email address.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.district.trim()) newErrors.district = "District is required.";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Please select a payment method.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error); // Kiểm tra không có lỗi nào
  };
  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row bg-white">
      <div className="md:w-2/3 p-4 border-r text-gray-700">
        <h1 className="text-lg font-semibold mb-4">Shopping Cart</h1>
        {cartItems.map((item) => (
          <CartItem
            key={item._id}
            product={item}
            quantity={quantities[item._id] || 1}
            onUpdateQuantity={(newQuantity) => updateQuantity(item._id, newQuantity)}
            onRemove={() => removeItem(item._id)}
            onSelect={(selected) => toggleSelectItem(item._id, selected)}
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
        <div>
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <Input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div>
          <Input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>
        <div>
          <Input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>
        <div>
          <Input
            type="text"
            name="district"
            placeholder="District"
            value={formData.district}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />
          {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
        </div>
        <div>
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
          {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-yellow-500 text-white py-2 px-4 rounded w-full"
        >
          Place Order
        </button>

        {/* Nút Đặt Hàng */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 h-20 shadow-lg flex flex-row gap-2 hidden md:flex justify-end">
          <div className="flex flex-row gap-2 text-lg font-medium items-center">
            <div className="truncate">Total Amount:</div>
            <div>£{totalAmount.toFixed(2)}</div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 text-lg font-medium text-white py-2 px-4 rounded w-[400px] h-full"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
