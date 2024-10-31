import { Attribute } from '@/models/Attribute';
export interface Comment {
    id: number;
    username: string;
    review: string;
    rating: number;
    attributes: Attribute[];
    created_date: string;
    productId: number;
}
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
];
export default mockComments;