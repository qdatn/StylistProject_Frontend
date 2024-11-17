import { Attribute } from './Attribute';
import mockProducts, { Product } from './Product';
export interface Comment {
    _id: string;
    username: string;
    review: string;
    rating: number;
    attributes: Attribute[];
    created_date: string;
    product: Product;
}
const mockComments: Comment[] = [
    { 
        _id: '1', 
        username: "Alice", 
        review: "Great product! Loved the quality.", 
        rating: 5,
        attributes: [
            { key: "Color", value: ["Red"] },
            { key: "Material", value: ["Cotton"] },
            { key: "Size", value: ["M"] }
        ],
        created_date: "2024-10-01",
        product: mockProducts[1] // Add the product ID
    },
    { 
        _id: '2', 
        username: "Bob", 
        review: "The fit was perfect. Would recommend!", 
        rating: 4,
        attributes: [
            { key: "Color", value: ["Blue"] },
            { key: "Material", value: ["Polyester"] },
            { key: "Size", value: ["L"] }
        ],
        created_date: "2024-10-05",
        product:mockProducts[2] // Add the product ID
    },
    
];
export default mockComments;