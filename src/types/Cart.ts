// models/Cart.ts
import { CartProduct } from './CartProduct';

export interface Cart {
    user_id: string; // ID của khách hàng
    items: CartProduct[]; // Danh sách sản phẩm trong giỏ hàng
    total_price: number; // Tổng giá trị của giỏ hàng
}

// Dữ liệu giả cho giỏ hàng
const mockCart: Cart = {
    user_id: '64b123a5f0f6d4e123456780', // ID của khách hàng
    items: [
        {
            id: '1',
            name: 'Wrap bodice balloon sleeve maxi dress',
            originalPrice: 46.00,
            discountedPrice: 36.00,
            quantity: 2,
            attributes: [
                { key: "Color", value: ["Red"] },
                { key: "Size", value: ["M"] }
            ],
        },
        {
            id: '2',
            name: 'Floral print sundress',
            originalPrice: 29.00,
            discountedPrice: 22.00,
            quantity: 1,
            attributes: [
                { key: "Color", value: ["Blue"] },
                { key: "Size", value: ["L"] }
            ],
        },
    ],
    total_price: (2 * 36.00) + (1 * 22.00), // Tính tổng giá
};

export default mockCart;
