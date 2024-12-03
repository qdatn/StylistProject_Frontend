// app/product/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@redux/reducers/cartReducer";

import CommentItem from "@components/CommentItem";
import { CommentList } from "@src/types/Comment";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import mockProducts from "@src/types/Product";
import { Product } from "@src/types/Product";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel, notification, Select, Slider } from "antd";
import axiosClient from "@api/axiosClient";
import formatDateTime from "@utils/formatDateTime";
import { RootState } from "@redux/store";
import { Cart } from "@src/types/Cart";
import { OrderAttribute } from "@src/types/Attribute";
import { formatCurrency } from "@utils/format";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<CommentList | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedAttributes, setSelectedAttributes] =
    useState<OrderAttribute[]>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.persist.auth);
  const userId = user.user?.user._id;
  const cart = useSelector(
    (state: RootState) => state.persist.cart[userId!]?.items || []
  );
  const [validationErrors, setValidationErrors] = useState<any>({});

  console.log(id);
  const urlPath = import.meta.env.VITE_API_URL;

  // Get product detail
  const fetchProductDetail = async () => {
    try {
      const response = await axiosClient.getOne<Product>(
        `${urlPath}/api/product/${id}`,
        //pagination params
        {}
      );

      setProduct(response);
      console.log("PRODUCT", response);
    } catch (error) {
      alert(error);
    }
  };

  // Get comment by productid
  const fetchComment = async () => {
    try {
      const response = await axiosClient.getOne<CommentList>(
        `${urlPath}/api/comment/product/${id}`,
        //pagination params
        {}
      );

      setComments(response);
      console.log("Comment", response);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (id) {
      // const foundProduct = mockProducts.find(product => product._id === id); // Tìm sản phẩm theo id
      // setProduct(foundProduct || null);
      fetchProductDetail();
      fetchComment();
    }
  }, [id]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [addToCartSuccess, setAddToCartSuccess] = useState(true);

  // Cập nhật handleAddToCart để hiển thị thông báo
  const handleAddToCart = async () => {
    const errors: Record<string, string> = {};
    product?.attributes.map((attr) => {
      if (!selectedAttributes?.find((item) => item.key === attr.key)?.value) {
        errors[attr.key] = `Please select ${attr.key}`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    if (product) {
      // Kiểm tra product có phải là null không
      // Gọi action addToCart để thêm sản phẩm vào giỏ hàng
      try {
        const productId = product._id;
        const userId = user.user?.user._id;
        const res = await axiosClient.put<Cart>(
          `${urlPath}/api/cart/${userId}`,
          {
            products: [productId.toString()],
          }
        );

        const getProduct = await axiosClient.getOne<Product>(
          `${urlPath}/api/product/${productId}`
        );
        await setProduct(getProduct);

        dispatch(
          addToCart({
            userId: userId!,
            product,
            quantity,
            cart_attributes: selectedAttributes,
          })
        );
        console.log("PRODDDUCTT + quantity", product, quantity);
        console.log("CART REDUX:", cart);

        notification.success({
          message: "Product have been added to cart!",
          description: "",
          placement: "topRight",
          duration: 2,
        });
      } catch (error) {
        alert(error);
      }
    } else {
      console.error("Product is not available.");
    }
  };

  const handleAttributeChange = (key: string, value: string) => {
    //   setSelectedAttributes((prev) => ({ ...prev, [key]: value }));
    // };
    // if (comments) {
    setSelectedAttributes((prev) => {
      const updatedAttributes = prev ? [...prev] : [];

      // Tìm thuộc tính trong danh sách hiện tại
      const existingAttributeIndex = updatedAttributes.findIndex(
        (attr) => attr.key === key
      );

      if (existingAttributeIndex > -1) {
        // Nếu thuộc tính đã tồn tại, cập nhật giá trị
        updatedAttributes[existingAttributeIndex].value = value;
      } else {
        // Nếu thuộc tính chưa tồn tại, thêm mới
        updatedAttributes.push({ key, value });
      }

      return updatedAttributes;
    });
  };

  useEffect(() => {
    console.log("SELECTED ATTR", selectedAttributes);
  }, [selectedAttributes]);

  if (!product) return <p>Loading...</p>;
  if (!product || !product.images || product.images.length === 0) {
    return <p>No products data or images available.</p>;
  }

  return (
    <>
      <div className="container mx-auto p-8 bg-white">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex justify-center w-full md:w-1/2">
            <div className="relative w-[600px] h-[400px]">
              {/* Hiển thị ảnh hiện tại */}
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.product_name || "Product"} - ${
                  currentImageIndex + 1
                }`}
                className="object-contain w-full h-full"
              />

              {/* Nút điều hướng bên trái */}
              <button
                className="absolute top-1/2 left-10 transform -translate-y-1/2 text-gray-800 p-2 rounded hover:bg-gray-200"
                onClick={() =>
                  setCurrentImageIndex((prevIndex) =>
                    prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
                  )
                }
              >
                ❮
              </button>

              {/* Nút điều hướng bên phải */}
              <button
                className="absolute top-1/2 right-10 transform -translate-y-1/2 text-gray-800 p-2 rounded hover:bg-gray-200"
                onClick={() =>
                  setCurrentImageIndex((prevIndex) =>
                    prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
                  )
                }
              >
                ❯
              </button>
            </div>
          </div>
          <div className="mt-5 flex flex-col w-full md:w-1/2">
            <h1 className="text-[20px] font-medium mb-8 text-gray-700">
              {product.product_name}
            </h1>
            <div className="text-2xl flex items-center gap-2">
              <p className="text-gray-500 line-through font-semibold">
                {formatCurrency(product.price)}
              </p>
              <p className="text-red-500 font-bold">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="mt-8">
              {product.attributes.map((attr) => (
                <div key={attr.key} className="mb-4">
                  <label className="text-[16px] font-medium text-gray-700 block mb-1">
                    {attr.key}:
                  </label>
                  {/* <div key={attr.key} className="mb-4">
                    <label className="text-[16px] font-medium text-gray-700 block mb-1">
                      {attr.key}:
                    </label>
                    <Select
                      value={selectedAttributes[attr.key] || undefined}
                      onChange={(value) =>
                        handleAttributeChange(attr.key, value)
                      }
                      placeholder={`Select ${attr.key}`}
                      className="w-40"
                    >
                      {attr.value.map((optionValue) => (
                        <Option key={optionValue} value={optionValue}>
                          {optionValue}
                        </Option>
                      ))}
                    </Select>
                  </div> */}
                  <Select
                    value={
                      selectedAttributes?.find((item) => item.key === attr.key)
                        ?.value || undefined
                    }
                    onChange={(value) => handleAttributeChange(attr.key, value)}
                    placeholder={`Select ${attr.key}`}
                    className="w-40"
                    status={validationErrors[attr.key] ? "error" : ""}
                  >
                    {attr.value.map((optionValue) => (
                      <Select.Option key={optionValue} value={optionValue}>
                        {optionValue}
                      </Select.Option>
                    ))}
                  </Select>
                  {/* Hiển thị lỗi nếu có */}
                  {validationErrors[attr.key] && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors[attr.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center text-gray-700">
              <button
                className="border p-2"
                onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
              >
                <AiOutlineMinus />
              </button>
              <span className="mx-2 w-20 flex items-center justify-center">
                {quantity}
              </span>
              <button
                className="border p-2"
                onClick={() =>
                  setQuantity((q) => Math.min(q + 1, product.stock_quantity))
                }
              >
                <AiOutlinePlus />
              </button>
              <p className="text-gray-500 ml-4">
                In stock: {product.stock_quantity}
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                className="w-60 bg-gray-700 text-white py-2 rounded-sm text-lg font-semibold"
                onClick={handleAddToCart}
              >
                ADD TO BAG
              </button>
            </div>
          </div>
        </div>
        {/* <div className="mt-10 flex justify-center py-24"> */}
          <div className="flex flex-col justify-center mb-10 py-24 px-20">
            <h1 className="text-xl font-bold py-10">Description</h1>
            <p className="text-justify">{product.description}</p>
          </div>
        {/* </div> */}
        {/* Comments Section */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="mb-4 w-full flex flex-row items-center gap-2">
              <p className="text-xl font-semibold text-gray-800 ">Review</p>
              <p className="text-xl font-bold text-yellow-500 flex items-center">
                {/* {totalRating.toFixed(1)} <FaStar className="ml-2" /> */}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comments?.data.map((comment) => (
                <CommentItem
                  key={comment._id}
                  username={comment.user_info?.name!}
                  //   username="Test user"
                  rating={comment.rating}
                  attributes={comment.attributes}
                  review={comment.review}
                  created_date={formatDateTime(comment.createdAt!)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
