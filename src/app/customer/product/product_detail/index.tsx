"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@redux/reducers/cartReducer";
import CommentItem from "@components/CommentItem";
import { CommentList } from "@src/types/Comment";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineShoppingCart } from "react-icons/ai";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { notification, Select } from "antd";
import axiosClient from "@api/axiosClient";
import formatDateTime from "@utils/formatDateTime";
import { RootState } from "@redux/store";
import { Cart } from "@src/types/Cart";
import { OrderAttribute } from "@src/types/Attribute";
import { formatCurrency } from "@utils/format";
import { Product, ProductVariant } from "@src/types/new/Product";

const DEFAULT_IMAGE = "../src/public/assets/images/default-product-image.png";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<CommentList | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.persist.auth);
  const userId = user.user?.user._id;
  const reviewRef = useRef<HTMLDivElement | null>(null);

  const cart = useSelector(
    (state: RootState) => state.persist.cart[userId!]?.items || []
  );
  const [validationErrors, setValidationErrors] = useState<any>({});
  const urlPath = import.meta.env.VITE_API_URL;


  const scrollToReviews = () => {
    reviewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  // Get product detail
  const fetchProductDetail = async () => {
    try {
      const response = await axiosClient.getOne<Product>(
        `${urlPath}/api/product/${id}`
      );
      setProduct(response);

      // Auto-select first variant if exists
      if (response.variants && response.variants.length > 0) {
        setSelectedVariant(response.variants[0]);
        const initialAttributes: Record<string, string> = {};
        response.variants[0].attributes.forEach(attr => {
          initialAttributes[attr.key] = attr.value;
        });
        setSelectedAttributes(initialAttributes);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      notification.error({
        message: "Product Error",
        description: "Could not load product details",
      });
    }
  };

  // Get comment by productid
  const fetchComment = async () => {
    try {
      const response = await axiosClient.getOne<CommentList>(
        `${urlPath}/api/comment/product/${id}`
      );
      setComments(response);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetail();
      fetchComment();
    }
  }, [id]);

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

  // Check if attribute option is available (stock > 0)
  const isOptionAvailable = (key: string, value: string): boolean => {
    if (!product?.variants) return false;
    
    return product.variants.some(variant => 
      variant.attributes.some(attr => 
        attr.key === key && 
        attr.value === value
      ) &&
      variant.stock_quantity > 0
    );
  };

  // Handle attribute selection
  const handleAttributeChange = (key: string, value: string) => {
    // Prevent selection if option is unavailable
    if (!isOptionAvailable(key, value)) return;

    const newAttributes = {
      ...selectedAttributes,
      [key]: value
    };

    setSelectedAttributes(newAttributes);

    // Find matching variant
    if (product?.variants) {
      const matchingVariant = product.variants.find(variant =>
        variant.attributes.every(attr =>
          newAttributes[attr.key] === attr.value
        )
      );

      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
        // Reset quantity if exceeds new variant stock
        setQuantity(prev => Math.min(prev, matchingVariant.stock_quantity));
      } else {
        setSelectedVariant(null);
      }
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      notification.error({
        message: "Selection Required",
        description: "Please select all product options",
      });
      return;
    }

    if (!product) return;

    try {
      const productId = product._id;
      const userId = user.user?.user._id;

      // Update cart via API
      await axiosClient.put<Cart>(
        `${urlPath}/api/cart/${userId}`,
        {
          products: [{
            productId: productId?.toString(),
            variantId: selectedVariant._id,
            quantity
          }]
        }
      );

      // Update local state
      const updatedProduct = await axiosClient.getOne<Product>(
        `${urlPath}/api/product/${productId}`
      );
      setProduct(updatedProduct);

      // Find updated variant
      const updatedVariant = updatedProduct.variants?.find(
        v => v._id === selectedVariant._id
      );

      if (updatedVariant) {
        setSelectedVariant(updatedVariant);
      }

      // Dispatch to Redux
      dispatch(
        addToCart({
          userId: userId!,
          product: {
            ...product,
            // Use selected variant's price and stock
            price: selectedVariant.price,
            stock_quantity: selectedVariant.stock_quantity
          },
          variant: selectedVariant,
          quantity,
          cart_attributes: Object.entries(selectedAttributes).map(([key, value]) => ({
            key,
            value
          }))
        })
      );
      notification.success({
        message: "Added to Cart",
        description: `${product.product_name} has been added to your cart`,
        placement: "topRight",
        duration: 2,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      notification.error({
        message: "Cart Error",
        description: "Could not add item to cart",
      });
    }
  };

  if (!product) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Find available options for each attribute
  const attributeOptions: Record<string, string[]> = {};

  // Only proceed if product has variants
  if (product.variants && product.variants.length > 0) {
    // First, collect all attribute keys from all variants
    const allKeys = new Set<string>();
    product.variants.forEach(variant => {
      variant.attributes.forEach(attr => {
        allKeys.add(attr.key);
      });
    });

    // Then collect unique values for each key
    Array.from(allKeys).forEach(key => {
      const values = new Set<string>();
      product.variants?.forEach(variant => {
        const attr = variant.attributes.find(a => a.key === key);
        if (attr) {
          values.add(attr.value);
        }
      });
      attributeOptions[key] = Array.from(values);
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Product Unavailable Overlay */}
      {product.status === false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
          <div className="relative z-10 px-10 py-8 text-center max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Product Unavailable</h3>
            <p className="text-white mb-6">
              We're sorry, this item is currently out of stock.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-block w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <div className={`${product.status === false ? 'opacity-60 pointer-events-none' : ''}`}>
        {/* Product Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
          {/* Image Gallery */}
          <div className="flex flex-col">
            <div className="relative h-96 w-full overflow-hidden ">
              <div
                className="w-full h-full flex items-center justify-center"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={product.images?.length ? product.images[currentImageIndex] : DEFAULT_IMAGE}
                  alt={product.product_name}
                  className="object-contain max-h-full max-w-full"
                  style={{
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transform: zoomPosition.x || zoomPosition.y ? "scale(1.8)" : "scale(1)",
                  }}
                />
              </div>

              <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100"
                onClick={() => setCurrentImageIndex(prev =>
                  prev === 0 ? (product.images?.length || 1) - 1 : prev - 1
                )}
              >
                <FaChevronLeft className="text-gray-700" />
              </button>

              <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100"
                onClick={() => setCurrentImageIndex(prev =>
                  prev === (product.images?.length || 1) - 1 ? 0 : prev + 1
                )}
              >
                <FaChevronRight className="text-gray-700" />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto py-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-5 space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-medium text-gray-600">{product.product_name}</h1>
              {/* <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">(42 reviews)</span>
              </div> */}
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-3">
                {selectedVariant ? (
                  <span className="text-2xl font-bold text-red-600">
                    {formatCurrency(selectedVariant.price)}
                  </span>
                ) : (
                  <span className="text-lg text-gray-500">
                    Select options to see price
                  </span>
                )}
              </div>
            </div>

            {/* Product Attributes */}
            <div className="space-y-5 mb-8">
              {Object.keys(attributeOptions).map((key) => (
                <div key={key}>
                  <label className="block font-medium text-gray-700 mb-2">
                    {key}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {attributeOptions[key]?.map((value) => {
                      const isAvailable = isOptionAvailable(key, value);
                      const isSelected = selectedAttributes[key] === value;
                      
                      return (
                        <button
                          key={value}
                          title={!isAvailable ? "Out of stock" : undefined}
                          onClick={() => handleAttributeChange(key, value)}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-full text-sm border ${!isAvailable 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                            : isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                  {validationErrors[key] && (
                    <p className="mt-1 text-red-500 text-sm">
                      {validationErrors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-10 mb-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  className="h-11 w-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={!selectedVariant}
                >
                  <AiOutlineMinus className="text-gray-600" />
                </button>
                <span className="w-20 text-center font-medium">{quantity}</span>
                <button
                  className="h-11 w-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
                  onClick={() => setQuantity(q =>
                    Math.min(q + 1, selectedVariant?.stock_quantity || 1)
                  )}
                  disabled={!selectedVariant}
                >
                  <AiOutlinePlus className="text-gray-600" />
                </button>
              </div>
              {selectedVariant && (
                <div className="mt-1 text-green-600 font-medium">
                  In Stock: {selectedVariant.stock_quantity}
                </div>
              )}

            </div>
            <button
              className={`w-3/5 gap-2 flex-1 flex items-center justify-center py-3 font-semibold text-white rounded-lg transition-colors ${selectedVariant
                ? "bg-gray-700 hover:bg-blue-500"
                : "bg-gray-500 cursor-not-allowed"
                }`}
              onClick={handleAddToCart}
              disabled={!selectedVariant}
            >
              <AiOutlineShoppingCart className="text-lg" />
              {selectedVariant ? "ADD TO BAG" : "SELECT OPTIONS"}
            </button>


          </div>
        </div>

        {/* Description & Details */}
        <div className="mt-16">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-10">
              <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
                Description
              </button>

              <button
                onClick={scrollToReviews}
                className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Reviews ({comments?.data.length || 0})
              </button>
            </nav>
          </div>

          {/* Description */}
          <div className="mt-6 prose prose-lg max-w-none text-gray-600 space-y-3 mb-2">
            <h2 className="text-xl font-semibold text-gray-800 ">Description</h2>
            <div>
              <span className="font-medium">Category:</span>{' '}
              {product.categories?.[0]?.category_name || 'Electronics'}
            </div>
            <div>
              <span className="font-medium">Brand:</span> {product.brand}
            </div>
            {product.description}
          </div>

          {/* Reviews Section */}
          <div ref={reviewRef} className="mt-12">
            <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
            {comments?.data && comments.data.length > 0 ? (
              <>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {comments.data.map((comment) => (
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
              </>
            ) : (
              <div className="mt-6 text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;