import React from 'react';
import { CartProduct } from '../models/CartProduct';
import mockProducts from '../models/Product'; // Nhập dữ liệu sản phẩm giả

export interface CartItemProps {
    id: string; // ID sản phẩm
    item: CartProduct; // Sử dụng CartProduct thay vì định nghĩa lại
    onUpdateQuantity: (increment: boolean) => void; // Hàm để cập nhật số lượng
    onRemove: () => void; // Hàm để xóa sản phẩm
    onSelect: (selected: boolean) => void; // Hàm để chọn sản phẩm
}

// Hàm để lấy hình ảnh sản phẩm dựa trên ID
const getProductImage = (id: string) => {
    const product = mockProducts.find(prod => prod.id === id);
    return product ? product.image : ''; // Trả về đường dẫn hình ảnh hoặc chuỗi rỗng nếu không tìm thấy
};

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    return (
        <div className="flex justify-between items-center border-b py-4">
            <div className="flex items-center">
                <img
                    src={getProductImage(item.id)} // Lấy hình ảnh sản phẩm từ mô hình Product
                    alt={item.name}
                    className="w-20 h-20 object-cover mr-4"
                />
                <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-gray-600">Giá gốc: ${item.originalPrice.toFixed(2)}</p>
                    <p className="text-red-500">Giá đã giảm: ${item.discountedPrice.toFixed(2)}</p>
                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
                    <div className="mt-2">
                        {item.attributes.map(attr => (
                            <div key={attr.key} className="flex">
                                <span className="font-medium">{attr.key}: </span>
                                <span className="text-gray-600 ml-2">{attr.value.join(', ')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg">
                    ${(item.discountedPrice * item.quantity).toFixed(2)} {/* Tính tổng giá cho sản phẩm */}
                </p>
            </div>
        </div>
    );
};

export default CartItem;
