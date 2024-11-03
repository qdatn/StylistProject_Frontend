// models/Product.ts
import { Attribute } from './Attribute';

export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  description?: string;
  brand: string | null; // Để có thể có giá trị null
  stock_quantity: number;
  min_quantity?: number;
  sold_quantity?: number;
  categories?: string[];
  create_date: Date; // Thay đổi định dạng cho ngày tháng
  update_date?: Date;
  stock_update_date?: Date;
  status: boolean;
  image: string;
  attributes: Attribute[];
}

// Dữ liệu giả cho sản phẩm
const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Wrap bodice balloon sleeve maxi dress',
        originalPrice: 46.00,
        discountedPrice: 36.00,
        description: 'A detailed description of the Wrap bodice balloon sleeve maxi dress.',
        image: 'https://via.placeholder.com/300x400',
        stock_quantity: 10,
        attributes: [
            { key: "Color", value: ["Red", "Blue"] },
            { key: "Material", value: ["Cotton"] },
            { key: "Size", value: ["M", "L"] }
        ],
        brand: 'none',
        create_date: new Date('2024-10-31'), // Sử dụng Date cho ngày tạo
        status: true, // Trạng thái sản phẩm
    },
    {
        id: '2',
        name: 'Floral print sundress',
        originalPrice: 29.00,
        discountedPrice: 22.00,
        description: 'A detailed description of the Floral print sundress.',
        image: 'https://via.placeholder.com/300x400',
        stock_quantity: 10,
        attributes: [
            { key: "Color", value: ["Blue", "Green"] },
            { key: "Material", value: ["Polyester"] },
            { key: "Size", value: ["L", "XL"] }
        ],
        brand: null, // Có thể là null
        create_date: new Date('2024-10-31'), // Sử dụng Date cho ngày tạo
        status: true, // Trạng thái sản phẩm
    },
    {
        id: '3',
        name: 'Classic denim jacket',
        originalPrice: 60.00,
        discountedPrice: 45.00,
        description: 'A detailed description of the Classic denim jacket.',
        image: 'https://via.placeholder.com/300x400',
        stock_quantity: 10,
        attributes: [
            { key: "Color", value: ["Green"] },
            { key: "Material", value: ["Silk"] },
            { key: "Size", value: ["S"] }
        ],
        brand: null, // Có thể là null
        create_date: new Date('2024-10-31'), // Sử dụng Date cho ngày tạo
        status: true, // Trạng thái sản phẩm
    },
    {
        id: '4',
        name: 'Classic denim jacket',
        originalPrice: 60.00,
        discountedPrice: 45.00,
        description: 'A detailed description of the Classic denim jacket.',
        image: 'https://via.placeholder.com/300x400',
        stock_quantity: 10,
        attributes: [
            { key: "Color", value: ["Green"] },
            { key: "Material", value: ["Silk"] },
            { key: "Size", value: ["S"] }
        ],
        brand: null, // Có thể là null
        create_date: new Date('2024-10-31'), // Sử dụng Date cho ngày tạo
        status: true, // Trạng thái sản phẩm
    },
    {
        id: '5',
        name: 'Classic denim jacket',
        originalPrice: 60.00,
        discountedPrice: 45.00,
        description: 'A detailed description of the Classic denim jacket.',
        image: 'https://via.placeholder.com/300x400',
        stock_quantity: 10,
        attributes: [
            { key: "Color", value: ["Green"] },
            { key: "Material", value: ["Silk"] },
            { key: "Size", value: ["S"] }
        ],
        brand: null, // Có thể là null
        create_date: new Date('2024-10-31'), // Sử dụng Date cho ngày tạo
        status: true, // Trạng thái sản phẩm
    },
];

export default mockProducts;
