// models/Product.ts
import { Attribute } from "./Attribute";
import { Category } from "./Category";
import { PaginationType } from "./Pagination";
export interface Product {
  _id: string;
  product_name: string;
  price: number;
  discountedPrice: number;
  description?: string;
  brand: string | null; // Để có thể có giá trị null
  stock_quantity: number;
  min_quantity?: number;
  sold_quantity?: number;
  categories: Category[] | string[]; 
  stock_update_date?: Date;
  status: boolean;
  images: string[];
  attributes: Attribute[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductList {
  data: Product[];
  pagination: PaginationType;
}

// Dữ liệu giả cho sản phẩm
const mockProducts: Product[] = [
  {
    _id: "1",
    product_name: "Wrap bodice balloon sleeve maxi dress",
    price: 46.0,
    discountedPrice: 36.0,
    description:
      "A detailed description of the Wrap bodice balloon sleeve maxi dress.",
    images: [
      "https://via.placeholder.com/300x400",
      "https://via.placeholder.com/400x600",
    ],
    stock_quantity: 10,
    categories: [
      { _id: "1", category_name: "Dresses", description: "Women's dresses" },
    ],
    attributes: [
      { key: "Color", value: ["Red", "Blue"] },
      { key: "Material", value: ["Cotton"] },
      { key: "Size", value: ["M", "L"] },
    ],
    brand: "none",
    createdAt: new Date("2024-10-31"), // Sử dụng Date cho ngày tạo
    status: true, // Trạng thái sản phẩm
  },
  {
    _id: "2",
    product_name: "Floral print sundress",
    price: 29.0,
    discountedPrice: 22.0,
    description: "A detailed description of the Floral print sundress.",
    images: ["https://via.placeholder.com/300x400"],
    stock_quantity: 10,
    categories: [
      { _id: "1", category_name: "Dresses", description: "Women's dresses" },
    ],
    attributes: [
      { key: "Color", value: ["Blue", "Green"] },
      { key: "Material", value: ["Polyester"] },
      { key: "Size", value: ["L", "XL"] },
    ],
    brand: null, // Có thể là null
    createdAt: new Date("2024-10-31"), // Sử dụng Date cho ngày tạo
    status: true, // Trạng thái sản phẩm
  },
  {
    _id: "3",
    product_name: "Classic denim jacket",
    price: 60.0,
    discountedPrice: 45.0,
    description: "A detailed description of the Classic denim jacket.",
    images: [
      "https://via.placeholder.com/300x400",
      "https://via.placeholder.com/400x600",
    ],
    stock_quantity: 10,
    categories: [
      { _id: "1", category_name: "Dresses", description: "Women's dresses" },
    ],
    attributes: [
      { key: "Color", value: ["Green"] },
      { key: "Material", value: ["Silk"] },
      { key: "Size", value: ["S"] },
    ],
    brand: null, // Có thể là null
    createdAt: new Date("2024-10-31"), // Sử dụng Date cho ngày tạo
    status: true, // Trạng thái sản phẩm
  },
  {
    _id: "4",
    product_name: "Classic denim jacket",
    price: 60.0,
    discountedPrice: 45.0,
    description: "A detailed description of the Classic denim jacket.",
    images: ["https://via.placeholder.com/300x400"],
    stock_quantity: 10,
    categories: [
      { _id: "1", category_name: "Dresses", description: "Women's dresses" },
    ],

    attributes: [
      { key: "Color", value: ["Green"] },
      { key: "Material", value: ["Silk"] },
      { key: "Size", value: ["S"] },
    ],
    brand: null, // Có thể là null
    createdAt: new Date("2024-10-31"), // Sử dụng Date cho ngày tạo
    status: true, // Trạng thái sản phẩm
  },
  {
    _id: "5",
    product_name: "Classic denim jacket",
    price: 60.0,
    discountedPrice: 45.0,
    description: "A detailed description of the Classic denim jacket.",
    images: ["https://via.placeholder.com/300x400"],
    stock_quantity: 10,
    categories: [
      { _id: "1", category_name: "Dresses", description: "Women's dresses" },
    ],
    attributes: [
      { key: "Color", value: ["Green"] },
      { key: "Material", value: ["Silk"] },
      { key: "Size", value: ["S"] },
    ],
    brand: null, // Có thể là null
    createdAt: new Date("2024-10-31"), // Sử dụng Date cho ngày tạo
    status: true, // Trạng thái sản phẩm
  },
  {
    _id: "6",
    product_name: "Classic denim jacket",
    price: 60.0,
    discountedPrice: 45.0,
    description: "A detailed description of the Classic denim jacket.",
    images: ["https://via.placeholder.com/300x400"],
    stock_quantity: 10,
    categories: [
      { _id: "1", category_name: "Dresses", description: "Women's dresses" },
    ],
    attributes: [
      { key: "Color", value: ["Green"] },
      { key: "Material", value: ["Silk"] },
      { key: "Size", value: ["S"] },
    ],
    brand: null, // Có thể là null
    createdAt: new Date("2024-10-31"), // Sử dụng Date cho ngày tạo
    status: true, // Trạng thái sản phẩm
  },
  {
    _id: "7",
    product_name: "Classic denim jacket",
    price: 60.0,
    discountedPrice: 45.0,
    description: "A detailed description of the Classic denim jacket.",
    images: ["https://via.placeholder.com/300x400"],
    stock_quantity: 10,
    categories: [
      { _id: "1", category_name: "Dresses", description: "Women's dresses" },
    ],
    attributes: [
      { key: "Color", value: ["Green"] },
      { key: "Material", value: ["Silk"] },
      { key: "Size", value: ["S"] },
    ],
    brand: null, // Có thể là null
    createdAt: new Date("2024-10-31"), // Sử dụng Date cho ngày tạo
    status: true, // Trạng thái sản phẩm
  },
];

export default mockProducts;
