"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/reducers/cartReducer';
import Header from '@/layouts/main-layout/header';
import Footer from '@/layouts/main-layout/footer';
import CommentItem from '@/components/CommentItem';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';

interface Attribute {
    key: string;
    value: string[] ;
}

interface Product {
    id: number;
    name: string;
    originalPrice: string;
    discountedPrice: string;
    description: string;
    image: string;
    stock_quantity: number;
    attributes: Attribute[];
}

// Add productId to the Comment interface
interface Comment {
    id: number;
    username: string;
    review: string; // Content of the comment
    rating: number; // Number of stars
    attributes: Attribute[]; // List of attributes
    created_date: string; // Date of comment creation
    productId: number; // Link to the product
}

const mockProducts: Product[] = [
    {
        id: 1,
        name: 'Wrap bodice balloon sleeve maxi dress',
        originalPrice: '£46.00',
        discountedPrice: '£36.00',
        description: 'A detailed description of the Wrap bodice balloon sleeve maxi dress.',
        image: 'https://via.placeholder.com/300x400',
        stock_quantity: 10,
        attributes: [
            { key: "Color", value: ["Red, Blue"] },
            { key: "Material", value: ["Cotton"] },
            { key: "Size", value: ["M"] }
        ],
    },
    // Thêm các sản phẩm khác nếu cần...
    {
        id: 2,
        name: 'Floral print sundress',
        originalPrice: '£29.00',
        discountedPrice: '£22.00',
        description: 'A detailed description of the Floral print sundresss.',
        image: 'https://via.placeholder.com/300x400',
        stock_quantity: 10,
        attributes: [
            { key: "Color", value: ["Blue", "Green"] },
            { key: "Material", value: ["Polyester"] },
            { key: "Size", value: ["L"] }
        ],
    },
    // Thêm các sản phẩm khác nếu cần...
    {
        id: 3,
        name: 'Classic denim jacket',
        originalPrice: '£60.00',
        discountedPrice: '£45.00',
        description: 'A detailed description of the Classic denim jacket.',
        image: 'https://via.placeholder.com/300x400',
        stock_quantity: 10,
        attributes: [
            { key: "Color", value: ["Green"] },
            { key: "Material", value: ["Silk"] },
            { key: "Size", value: ["S"] }
        ],
    },
    // Thêm các sản phẩm khác nếu cần...
];

// Updated mockComments with productId
const mockComments: Comment[] = [
    { 
        id: 1, 
        username: "Alice", 
        review: "Great product! Loved the quality.", 
        rating: 5,
        attributes: [
            { key: "Color", value: ["Red"] },
            { key: "Material", value: ["Cotton"] },
            { key: "Size", value: ["M"] }
        ],
        created_date: "2024-10-01",
        productId: 1 // Add the product ID
    },
    { 
        id: 2, 
        username: "Bob", 
        review: "The fit was perfect. Would recommend!", 
        rating: 4,
        attributes: [
            { key: "Color", value: ["Blue"] },
            { key: "Material", value: ["Polyester"] },
            { key: "Size", value: ["L"] }
        ],
        created_date: "2024-10-05",
        productId: 2 // Add the product ID
    },
    { 
        id: 3, 
        username: "Charlie", 
        review: "Amazing design and comfort.", 
        rating: 5,
        attributes: [
            { key: "Color", value: ["Green"] },
            { key: "Material", value: ["Silk"] },
            { key: "Size", value: ["S"] }
        ],
        created_date: "2024-10-10",
        productId: 3 // Add the product ID
    },
];

interface ProductDetailProps {
    params: {
        id: string;
    };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ params }) => {
    const { id } = params;
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            const foundProduct = mockProducts.find(product => product.id === Number(id));
            setProduct(foundProduct || null);
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({ 
                id: product.id, 
                name: product.name, 
                price: product.discountedPrice,
                quantity 
            }));
        }
    };

    const handleAttributeChange = (key: string, value: string) => {
        setSelectedAttributes(prev => ({ ...prev, [key]: value }));
    };

    // Filter comments by the current product ID
    const filteredComments = mockComments.filter(comment => comment.productId === Number(id));
    
    // Calculate total rating based on filtered comments
    const totalRating = filteredComments.reduce((sum, comment) => sum + comment.rating, 0) / (filteredComments.length || 1);

    if (!product) return <p>Loading...</p>;

    return (
        <>
            <Header />
            <div className="container mx-auto p-8 bg-white">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex justify-center w-full md:w-1/2">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={600}
                            className="object-contain"
                        />
                    </div>
                    <div className="mt-5 flex flex-col w-full md:w-1/2">
                        <h1 className="text-[20px] font-medium mb-8 text-gray-700">{product.name}</h1>
                        <div className="text-2xl flex items-center gap-2">
                            <p className="text-gray-500 line-through font-semibold">{product.originalPrice}</p>
                            <p className="text-red-500 font-bold">{product.discountedPrice}</p>
                        </div>

                        {/* Attribute Selector */}
                        <div className="mt-8">
                            {product.attributes.map(attr => (
                                <div key={attr.key} className="mb-4">
                                    <label className="text-[16px] font-medium text-gray-700 block mb-1">{attr.key}:</label>
                                    <select
                                        value={selectedAttributes[attr.key] || ""}
                                        onChange={(e) => handleAttributeChange(attr.key, e.target.value)}
                                        className="w-40 border p-2 rounded-sm text-gray-700"
                                    >
                                        <option value="" disabled>Select {attr.key}</option>
                                        {attr.value.map(optionValue => (
                                            <option key={optionValue} value={optionValue}>{optionValue}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mt-8 flex items-center text-gray-700">
                            <button className="border p-2" onClick={() => setQuantity(q => Math.max(q - 1, 1))}>
                                <AiOutlineMinus />
                            </button>
                            <span className="mx-2 w-20 flex items-center justify-center">{quantity}</span>
                            <button className="border p-2" onClick={() => setQuantity(q => Math.min(q + 1, product.stock_quantity))}>
                                <AiOutlinePlus />
                            </button>
                            <p className="text-gray-500 ml-4">In stock: {product.stock_quantity}</p>
                        </div>

                        {/* Add to Bag and Buy Now Buttons */}
                        <div className="mt-8 flex gap-4">
                            <button className="w-60 bg-gray-700 text-white py-2 rounded-sm text-lg font-semibold" onClick={handleAddToCart}>
                                ADD TO BAG
                            </button>
                            <button className="w-60 bg-yellow-500 text-white py-2 rounded-sm text-lg font-semibold">
                                BUY NOW
                            </button>
                        </div>

                         {/* Product Details */}
                         <div className="mt-8">
                            <h2 
                                className="text-[16px] font-medium mb-2 cursor-pointer flex items-center text-gray-700" 
                                onClick={() => setDetailsVisible(!detailsVisible)}
                            >
                                Product Details
                                {detailsVisible ? <AiOutlineMinus className="ml-2" /> : <AiOutlinePlus className="ml-2" />}
                            </h2>
                            {detailsVisible && (
                                <ul className="list-disc ml-5 space-y-1 text-gray-700">
                                    <li>A lesson in layering</li>
                                    <li>Round neck</li>
                                    <li>Button placket</li>
                                    <li>Long sleeves</li>
                                    <li>Regular fit</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-10 flex justify-center">
                    <div className="w-full max-w-5xl">
                        <div className="mb-4 w-full flex flex-row items-center gap-2">
                            <p className="text-xl font-semibold text-gray-800 ">Review</p>
                            <p className="text-xl font-bold text-yellow-500 flex items-center">
                                {totalRating.toFixed(1)} <FaStar className="ml-2" />
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredComments.map(comment => (
                                <CommentItem 
                                    key={comment.id} 
                                    username={comment.username} 
                                    rating={comment.rating} 
                                    attributes={comment.attributes} // Pass attributes
                                    review={comment.review} 
                                    created_date={comment.created_date} // Pass creation date
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetail;
