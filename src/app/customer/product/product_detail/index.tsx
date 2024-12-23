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
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setZoomPosition({ x: 0, y: 0 });
  };

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
      <div className="containermax-w-7xl mx-auto p-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {/* Phần bên trái - Hình ảnh */}
          <div className="flex justify-center lg:px-28 px-0">
            <div className="relative w-[600px] h-[400px] flex items-center justify-center">
              {/* Container hình ảnh */}
              <div
                className="w-[300px] h-[400px] overflow-hidden flex items-center justify-center rounded cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${product.product_name || "Product"} - ${currentImageIndex + 1
                    }`}
                  className="object-contain w-full h-full transform transition-transform duration-200"
                  style={{
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transform:
                      zoomPosition.x || zoomPosition.y ? "scale(1.5)" : "scale(1)",
                  }}
                />
              </div>
              {/* Nút mũi tên trái */}
              <button
                className="absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-800 p-2 rounded-full bg-gray-50 shadow hover:bg-gray-200"
                onClick={() =>
                  setCurrentImageIndex((prevIndex) =>
                    prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
                  )
                }
              >
                ❮
              </button>
              {/* Nút mũi tên phải */}
              <button
                className="absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-800 p-2 rounded-full bg-gray-50 shadow hover:bg-gray-200"
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
          {/* Phần bên phải - Thông tin sản phẩm */}
          <div className="mt-5 space-y-6">
            <h1 className="text-2xl font-medium text-gray-700">{product.product_name}</h1>
            <div className="text-2xl flex items-center gap-4">
              {/* <p className="text-gray-500 line-through font-semibold">{formatCurrency(product.price)}</p> */}
              <p className="text-red-500 font-bold">{formatCurrency(product.price)}</p>
            </div>

            <div className="mt-8 w-1/2">
              {product.attributes.map((attr) => (
                <div key={attr.key}>
                  <label className="text-lg font-medium text-gray-700 block mb-2">{attr.key}:</label>
                  <Select
                    value={selectedAttributes?.find((item) => item.key === attr.key)?.value || undefined}
                    onChange={(value) => handleAttributeChange(attr.key, value)}
                    placeholder={`Select ${attr.key}`}
                    className="w-full"
                    status={validationErrors[attr.key] ? "error" : ""}
                  >
                    {attr.value.map((optionValue) => (
                      <Select.Option key={optionValue} value={optionValue}>
                        {optionValue}
                      </Select.Option>
                    ))}
                  </Select>
                  {validationErrors[attr.key] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[attr.key]}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <button className="border p-2" onClick={() => setQuantity((q) => Math.max(q - 1, 1))}>
                <AiOutlineMinus />
              </button>
              <span className="mx-2 w-20 text-center">{quantity}</span>
              <button
                className="border p-2"
                onClick={() => setQuantity((q) => Math.min(q + 1, product.stock_quantity))}
              >
                <AiOutlinePlus />
              </button>
              <p className="text-gray-500">In stock: {product.stock_quantity}</p>
            </div>
            <button
              className="w-1/2 bg-gray-700 text-white py-2 rounded text-lg font-semibold"
              onClick={handleAddToCart}
            >
              ADD TO BAG
            </button>
          </div>
        </div>

        {/* Phần mô tả */}
        <div className="mt-10 w-full lg:px-28 px-0">
          <h1 className="text-xl font-bold">Description</h1>
          <p className="text-justify mt-4 whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* Phần đánh giá */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="mb-4 flex flex-row items-center gap-2">
              <p className="text-xl font-semibold text-gray-800">Review</p>
              <p className="text-xl font-bold text-yellow-500 flex items-center">
                {/* {totalRating.toFixed(1)} <FaStar className="ml-2" /> */}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comments?.data.map((comment) => (
                <CommentItem
                  key={comment._id}
                  username={comment.user_info?.name!}
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
