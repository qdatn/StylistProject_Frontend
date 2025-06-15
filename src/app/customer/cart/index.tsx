"use client";
import React, { useEffect, useMemo, useState } from "react";
import CartItem from "@components/CartItem";
import { Product, ProductList } from "@src/types/new/Product"; // Giả định bạn đã có định nghĩa Product trong mô hình
import {
  Discount,
  DiscountAvailable,
  PriceWithDiscount,
} from "@src/types/Discount";
import axiosClient from "@api/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Input, notification } from "antd";
import {
  CartProduct,
  deleteItemFromCart,
  updateCartProducts,
  updateProductQuantity,
} from "@redux/reducers/cartReducer";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Address } from "@src/types/Address";
import { formatCurrency } from "@utils/format";
import AddressAutocomplete from "@components/AddressAutocomplete";
import { OrderAttribute } from "@src/types/Attribute";
import { Order } from "@src/types/Order";
const baseUrl = import.meta.env.VITE_API_URL;

// Tạo ID duy nhất từ các thuộc tính
export const createAttributeId = (attributes: OrderAttribute[]): string => {
  if (!attributes || attributes.length === 0) return "default";

  // Sắp xếp thuộc tính theo key để đảm bảo thứ tự không ảnh hưởng
  const sortedAttributes = [...attributes].sort((a, b) =>
    a.key.localeCompare(b.key)
  );

  // Tạo chuỗi định danh từ các thuộc tính
  return sortedAttributes.map((attr) => `${attr.key}-${attr.value}`).join("_");
};

const CartPage = () => {
  const user = useSelector((state: RootState) => state.persist.auth);
  const userId = user.user?.user._id;
  const cart = useSelector(
    (state: RootState) => state.persist.cart[userId!]?.items || []
  );

  // Tạo uniqueId cho mỗi item (kết hợp productId + attributeId)
  const getUniqueId = (item: CartProduct): string => {
    const attributeId = createAttributeId(item.cart_attributes);
    return `${item._id}-${attributeId}`;
  };

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
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedDiscountCode, setSelectedDiscountCode] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  //const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const fetchCartItem = async () => {
    const userId = user.user?.user._id;
    setCartItems(cart);
    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      cart.map((item) => {
        updatedQuantities[item._id!] = item.quantity;
      });
      return updatedQuantities;
    });
  };

  // useEffect(() => {
  //   setSelectedProductIds(
  //     selectedItems.map((uniqueId) => uniqueId.split("-")[0])

  //   );
  //   console.log(selectedItems.map((uniqueId) => uniqueId.split("-")[0]))
  //   console.log(selectedProductIds)
  // }, [selectedItems]);

  useEffect(() => {
    fetchCartItem();
  }, []);

  useEffect(() => {
    const fetchUpdatedCart = async () => {
      try {
        // Lấy danh sách ID sản phẩm trong giỏ hàng
        const productIds = [...new Set(cart.map((item) => item._id))];

        // Gọi API lấy thông tin mới nhất
        const response = await axiosClient.post<ProductList>(
          `${baseUrl}/api/product/by-style?page=1&limit=1000`,
          { productIds: productIds }
        );

        const updatedProducts = response.data;

        // Cập nhật Redux store với dữ liệu mới
        dispatch(
          updateCartProducts({
            userId: userId!,
            updatedProducts: updatedProducts,
          })
        );
      } catch (error) {
        console.error("Failed to update cart data", error);
      }
    };

    if (cart.length > 0) {
      fetchUpdatedCart();
    }
  }, [userId, dispatch]);

  // Tính tổng tiền chưa giảm giá
  // const subtotal = useMemo(
  //   () =>
  //     cartItems.reduce((total, item) => {
  //       if (selectedItems.includes(item._id!)) {
  //         return total + item.price * (quantities[item._id!] || 1);
  //       }
  //       return total;
  //     }, 0),
  //   [cartItems, selectedItems, quantities]
  // );
  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const uniqueId = getUniqueId(item);
      if (selectedItems.includes(uniqueId)) {
        return total + item.price * (quantities[uniqueId] || 1);
      }
      return total;
    }, 0);
  }, [cartItems, selectedItems, quantities]);

  const selectedProducts = useMemo(() => {
    return cartItems
      .filter((item) => selectedItems.includes(getUniqueId(item)))
      .map((item) => {
        const uniqueId = getUniqueId(item);
        return {
          productId: uniqueId.split("-")[0],
          attribute: item.cart_attributes,
          quantity: quantities[uniqueId] || 1,
        };
      });
  }, [cartItems, selectedItems, quantities]);

  // Fetch available discounts khi có thay đổi
  // Xóa dòng khai báo state này
  // const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Xóa luôn useEffect này
  // useEffect(() => {
  //   setSelectedProductIds(
  //     selectedItems.map((uniqueId) => uniqueId.split("-")[0])
  //   );
  // }, [selectedItems]);

  useEffect(() => {
    const fetchAvailableDiscounts = async () => {
      // Tính toán productIds trực tiếp từ selectedItems
      const productIds = selectedItems.map(
        (uniqueId) => uniqueId.split("-")[0]
      );

      console.log("Sending productIds to API:", productIds);

      try {
        const discountList = await axiosClient.post<DiscountAvailable>(
          `${baseUrl}/api/discount/available-discounts/?limit=10000`,
          {
            productIds: productIds, // Sử dụng biến vừa tính toán
            totalPrice: subtotal,
          }
        );
        setDiscounts(discountList.data);
      } catch (error) {
        notification.error({
          message: "Error loading discounts",
          description: "Failed to fetch available discounts",
        });
      }
    };

    if (selectedItems.length > 0 && subtotal > 0) {
      fetchAvailableDiscounts();
    }
  }, [selectedItems, subtotal]); // Phụ thuộc vào selectedProducts

  // Sửa hàm apply discount
  const handleApplyDiscount = async (code: string) => {
    try {
      const response = await axiosClient.post<PriceWithDiscount>(
        `${baseUrl}/api/discount/apply-discount`,
        {
          code,
          cartItems: selectedProducts, // Sử dụng mảng sản phẩm đã chọn
          totalPrice: subtotal,
        }
      );

      setDiscountAmount(response.data.discountAmount);
      setFinalPrice(response.data.finalPrice);
      notification.success({
        message: "Discount applied successfully",
      });
    } catch (error: any) {
      notification.error({
        message: "Discount error",
        description:
          error.response?.data?.message || "Failed to apply discount",
      });
      setFinalPrice(subtotal);
      setDiscountAmount(0);
    }
  }; // Chỉ cần phụ thuộc vào selectedItems và subtotal

  // Reset discount khi subtotal thay đổi
  useEffect(() => {
    setFinalPrice(subtotal);
    setDiscountAmount(0);
    setSelectedDiscountCode("");
  }, [subtotal]);

  //apply discount

  //update quantity
  const updateQuantity = (
    itemId: string,
    newQuantity: number,
    cart_attributes: OrderAttribute[]
  ) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: newQuantity,
    }));

    // Tách productId từ uniqueId
    const productId = itemId.split("-")[0];

    //Cập nhật lại sl vào redux
    dispatch(
      updateProductQuantity({
        userId: userId!,
        // productId: itemId,
        productId: productId,
        quantity: newQuantity,
        cart_attributes,
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
  const removeItem = (itemId: string, cart_attributes: OrderAttribute[]) => {
    try {
      const productId = itemId.split("-")[0];
      // deleteProductInCart(itemId);
      deleteProductInCart(productId);
      dispatch(
        deleteItemFromCart({
          userId: userId!,
          // productId: itemId,
          productId: productId,
          cart_attributes,
        })
      );
      // setCartItems((prevItems) =>
      //   prevItems.filter((item) => item._id !== itemId)
      // );
      setCartItems((prev) =>
        prev.filter((item) => getUniqueId(item) !== itemId)
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
          amount: finalPrice,
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
            localStorage.setItem("momo_order_id", createOrder.order._id);
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

  useEffect(() => {
    setCartItems(cart);
  }, [cart]); // Cập nhật khi cart thay đổi

  const handleSubmit = async (values: any) => {
    // await setCartItems(cart);
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
        values.paymentMethod == "COD" ? "in progress" : "Waiting for payment!",
      discount: discountAmount,
      total_price: finalPrice,
      method: values.paymentMethod,
      address: address?._id,
    };

    const order_items = cartItems
      .filter((item) => selectedItems.includes(getUniqueId(item)))
      .map((item) => ({
        // _id: "",
        order: "",
        product: item._id,
        quantity: /*item.quantity*/ quantities[getUniqueId(item)] || 1,
        price: item.price,
        note: "",
        attributes: item.cart_attributes,
      }));
    console.log("ORDER ITEM: ", order_items);
    if (order_items.length) {
      try {
        await createOrderToDB(order, order_items, values.paymentMethod);

        console.log(order);
        console.log({ order, order_items });
        // if (!validateForm()) return;
        order_items.map((item) => {
          removeItem(item.product!, item.attributes);
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
            key={getUniqueId(item)}
            product={item}
            quantity={item.quantity}
            onUpdateQuantity={(newQuantity) =>
              // updateQuantity(item._id, newQuantity, item.cart_attributes)
              updateQuantity(
                getUniqueId(item),
                newQuantity,
                item.cart_attributes
              )
            }
            onRemove={() =>
              // removeItem(item._id, item.cart_attributes)
              removeItem(getUniqueId(item), item.cart_attributes)
            }
            onSelect={(selected) => {
              // toggleSelectItem(item._id, selected), console.log(item);
              toggleSelectItem(getUniqueId(item), selected);
            }}
          />
        ))}
        <div className="flex justify-between font-semibold mt-4">
          <span>Total Amount:</span>
          <span>{formatCurrency(finalPrice)}</span>
        </div>
        {/* Phần discount */}
        <div className="">
          <label className="mt-5 mb-2 block font-semibold">Choose Discount:</label>
          <select
            value={selectedDiscountCode}
            onChange={(e) => {
              setSelectedDiscountCode(e.target.value);
              handleApplyDiscount(e.target.value);
            }}
            className="border p-2 w-full"
          >
            <option value="">Select Discount</option>
            {discounts.map((discount) => (
              <option key={discount._id} value={discount.code}>
                {discount.code} ({discount.value}% off)
              </option>
            ))}
          </select>
        </div>

        {/* Phần hiển thị tổng tiền */}
        <div className="flex justify-between font-semibold mt-4">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-red-500 mt-2">
          <span>Discount:</span>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>

        <div className="flex justify-between font-semibold mt-2 border-t pt-2">
          <span>Total Amount:</span>
          <span>{formatCurrency(finalPrice)}</span>
        </div>
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
              {/* <Field
                type="text"
                name="address"
                placeholder="Address"
                className="border p-2 w-full my-4"
              /> */}
              <AddressAutocomplete
                name="address"
                className="border p-2 w-full my-4"
              />
              <ErrorMessage
                name="address"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <p className="mt-5 mb-2 font-semibold">Payment method</p>

              <div className="space-y-4">
                {/* COD */}
                <label className="flex items-center border p-3 rounded-lg cursor-pointer hover:shadow transition">
                  <Field
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    className="mr-3"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/891/891419.png"
                    alt="COD"
                    className="w-12 h-12 object-contain mr-4"
                  />
                  <span>COD</span>
                </label>

                {/* Momo */}
                <label className="flex items-center border p-3 rounded-lg cursor-pointer hover:shadow transition">
                  <Field
                    type="radio"
                    name="paymentMethod"
                    value="Momo"
                    className="mr-3"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                    alt="Momo"
                    className="w-12 h-12 object-contain mr-4"
                  />
                  <span>Momo</span>
                </label>
              </div>
              <ErrorMessage
                name="paymentMethod"
                component="p"
                className="text-red-500 text-sm"
              />
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
                <div>{formatCurrency(finalPrice)}</div>
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
    // Field select payment method
    // <Field
    //             as="select"
    //             name="paymentMethod"
    //             placeholder="Select Payment Method"
    //             // value={formData.paymentMethod}
    //             // onChange={handleChange}
    //             className="border p-2 w-full my-4"
    //           >
    //             <option value="COD">COD - Cash On Delivery</option>
    //             <option value="Momo">Momo</option>
    //             {/* <option value="VNPay">VNPay</option> */}
    //           </Field>
  );
};

export default CartPage;
