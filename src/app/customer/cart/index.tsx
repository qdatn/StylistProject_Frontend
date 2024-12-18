"use client";
import React, { useEffect, useState } from "react";
import CartItem from "@components/CartItem";
import { Product } from "@src/types/Product"; // Giả định bạn đã có định nghĩa Product trong mô hình
import axiosClient from "@api/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Cart } from "@src/types/Cart";
import { Input, notification } from "antd";
import {
  CartProduct,
  deleteItemFromCart,
  updateProductQuantity,
} from "@redux/reducers/cartReducer";
import { Order } from "@src/types/Order";
import { OrderItem } from "@src/types/OrderItem";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Address } from "@src/types/Address";
import { redirect, useNavigate } from "react-router-dom";
import { formatCurrency } from "@utils/format";
const baseUrl = import.meta.env.VITE_API_URL;

const CartPage = () => {
  const user = useSelector((state: RootState) => state.persist.auth);
  const userId = user.user?.user._id;
  const cart = useSelector(
    (state: RootState) => state.persist.cart[userId!]?.items || []
  );

  const dispatch = useDispatch();

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
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    paymentMethod: "",
  });
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [discountCode, setDiscountCode] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const fetchCartItem = async () => {
    const userId = user.user?.user._id;
    setCartItems(cart);
    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      cart.map((item) => {
        updatedQuantities[item._id] = item.quantity;
      });
      return updatedQuantities;
    })
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

    //Cập nhật lại sl vào redux
    dispatch(
      updateProductQuantity({
        userId: userId!,
        productId: itemId,
        quantity: newQuantity,
      })
    );
  };

  useEffect(() => {
    console.log("quantities", quantities);
  }, [quantities]);

  const deleteProductInCart = async (productId: string) => {
    try {
      const res = await axiosClient.put<Product>(
        `${baseUrl}/api/cart/deleteProduct/${userId}`,
        { product: productId }
      );
      console.log(res);
    } catch (error) {
      alert(error);
    }
  };
  const removeItem = (itemId: string) => {
    try {
      console.log(itemId);
      deleteProductInCart(itemId);
      dispatch(deleteItemFromCart({ userId: userId!, productId: itemId }));
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
      setSelectedItems((prevSelected) =>
        prevSelected.filter((_id) => _id !== itemId)
      );
      setQuantities((prevQuantities) => {
        const updatedQuantities = { ...prevQuantities };
        delete updatedQuantities[itemId];
        return updatedQuantities;
      });
    } catch (error) {
      alert(error);
    }
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

  const createOrderToDB = async (
    order: any,
    order_items: any[],
    paymentMethod: string
  ) => {
    try {
      const createOrder: any = await axiosClient.post(`${baseUrl}/api/order`, {
        order,
        order_items,
      });

      notification.success({
        message: "Create order success",
        description: "",
        placement: "topRight",
        duration: 2,
      });
      console.log(createOrder);

      if (paymentMethod === "Momo") {
        const paymentBody = {
          order_id: createOrder
            ? createOrder.order._id
            : "6744965fe71b1bb313e1d951",
          amount: totalAmount,
          orderInfo: "Payment Service",
          requestType: "payWithMethod",
          extraData: "",
          autoCapture: true,
        };

        try {
          // Make the POST request to the MoMo API
          const response: any = await axiosClient.post(
            `${baseUrl}/api/payment/momo`,
            paymentBody
          );
          console.log("momo:", response);
          // Redirect to the MoMo payment URL
          if (response && response.payUrl) {
            window.location.href = response.payUrl; // Navigate to the payment page
          } else {
            console.error("Failed to retrieve payUrl from response");
          }
        } catch (error) {
          console.error("Error during payment request:", error);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  const createNewAddress = async (addressData: Address) => {
    try {
      const address: Address = await axiosClient.post(
        `${baseUrl}/api/address`,
        addressData
      );

      return address;
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async (values: any) => {
    await setCartItems(cart);
    const addressData: Address = {
      name: values.name,
      user: userId as string,
      address: values.address,
      phone_num: values.phone,
    };
    const address = await createNewAddress(addressData);
    const order = {
      // _id: "",
      user: userId ?? "",
      status:
        values.paymentMethod == "COD" ? "Pending" : "Waiting for payment!",
      discount: 20,
      total_price: totalAmount,
      method: values.paymentMethod,
      address: address?._id,
    };

    const order_items = cartItems
      .filter((item) => selectedItems.includes(item._id))
      .map((item) => ({
        // _id: "",
        order: "",
        product: item._id,
        quantity: /*item.quantity*/ quantities[item._id] || 1,
        note: "",
        attributes: item.cart_attributes,
      }));
      console.log("ORDER ITEM: ",order_items)
    if (order_items.length) {
      try {
        await createOrderToDB(order, order_items, values.paymentMethod);

        console.log(order);
        console.log({ order, order_items });
        // if (!validateForm()) return;
        order_items.map((item) => {
          removeItem(item.product);
        });
      } catch (error) {
        console.log(error);
      }
    } else if (!order_items.length) {
      notification.warning({
        message: "Please choose product to place order",
        description: "",
        placement: "topRight",
        duration: 2,
      });
    } else {
      console.log("Order submitted:", order);
    }
  };

  // Define the Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, "Full name must be at least 3 characters.")
      .required("Full name is required."),

    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits.")
      .required("Phone number is required."),

    address: Yup.string()
      .trim()
      .min(5, "Address must be at least 5 characters.")
      .required("Address is required."),

    paymentMethod: Yup.string()
      .oneOf(["COD", "Momo", "VNPay"], "Please select a valid payment method.")
      .required("Please select a payment method."),
  });

  const initialValues = {
    name: "",
    phone: "",
    // email: "",
    address: "",
    // city: "",
    // district: "",
    paymentMethod: "COD",
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
    if (!formData.phone.match(/^\d{10}$/))
      newErrors.phone = "Phone number must be 10 digits.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email address.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.district.trim()) newErrors.district = "District is required.";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Please select a payment method.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error); // Kiểm tra không có lỗi nào
  };
  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row bg-white">
      <div className="md:w-2/3 p-4 border-r text-gray-700">
        <h1 className="text-lg font-semibold mb-4">Shopping Cart</h1>
        {/* {cartItems.map((item) => ( */}
        {cart.map((item: any) => (
          <CartItem
            key={item._id}
            product={item}
            quantity={item.quantity}
            onUpdateQuantity={(newQuantity) =>
              updateQuantity(item._id, newQuantity)
            }
            onRemove={() => removeItem(item._id)}
            onSelect={(selected) => {toggleSelectItem(item._id, selected), console.log(item)}}
          />
        ))}
        <div className="flex justify-between font-semibold mt-4">
          <span>Total Amount:</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
        {/* DISCOUNT */}
        {/* <div className="mt-2">
          <label className="block">Choose Discount:</label>
          <select
            // value={discountCode}
            // onChange={(e) => setDiscountCode(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select Discount</option>
            <option value="10%">10% Discount</option>
            <option value="20%">20% Discount</option>
          </select>
        </div> */}
      </div>

      {/* Form nhập thông tin đặt hàng */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({}) => (
          <Form className="md:w-1/3 p-4 text-gray-700">
            <h2 className="text-lg font-semibold mb-4">Information</h2>
            <div>
              <Field
                type="text"
                name="name"
                placeholder="Full Name"
                className="border p-2 w-full my-4"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <Field
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="border p-2 w-full my-4"
              />
              <ErrorMessage
                name="phone"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <Field
                type="text"
                name="address"
                placeholder="Address"
                className="border p-2 w-full my-4"
              />
              <ErrorMessage
                name="address"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <Field
                as="select"
                name="paymentMethod"
                placeholder="Select Payment Method"
                // value={formData.paymentMethod}
                // onChange={handleChange}
                className="border p-2 w-full my-4"
              >
                <option value="COD">COD - Cash On Delivery</option>
                <option value="Momo">Momo</option>
                {/* <option value="VNPay">VNPay</option> */}
              </Field>
              <ErrorMessage
                name="paymentMethod"
                component="p"
                className="text-red-500 text-sm"
              />
              {/* {errors.paymentMethod && (
                <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
              )} */}
            </div>
            <button
              // onClick={handleSubmit}
              type="submit"
              className="bg-yellow-500 text-white py-2 px-4 rounded w-full"
              // disabled={!isValid || !Object.keys(touched).length}
            >
              Place Order
            </button>

            {/* Nút Đặt Hàng */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 h-20 shadow-lg flex flex-row gap-2 md:flex justify-end">
              <div className="flex flex-row gap-2 text-lg font-medium items-center">
                <div className="truncate">Total Amount:</div>
                <div>{formatCurrency(totalAmount)}</div>
              </div>
              <button
                // onClick={handleSubmit}
                type="submit"
                className="bg-yellow-500 text-lg font-medium text-white py-2 px-4 rounded w-[400px] h-full"
                // disabled={!isValid || !Object.keys(touched).length}
              >
                Place Order
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CartPage;
