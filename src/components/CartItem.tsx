import React from 'react';
import { Product } from '@src/types/Product';

export interface CartItemProps {
    product: Product;  // Dữ liệu sản phẩm từ Cart
    onUpdateQuantity: (increment: boolean) => void; // Hàm để cập nhật số lượng
    onRemove: () => void; // Hàm để xóa sản phẩm
    onSelect: (selected: boolean) => void; // Hàm để chọn sản phẩm
    quantity: number;  // Số lượng sản phẩm trong giỏ hàng
}

// Hàm để lấy hình ảnh sản phẩm dựa trên ID

const CartItem: React.FC<CartItemProps> = ({ product, onUpdateQuantity, onRemove, onSelect, quantity }) => {
    return (
        <div className="flex justify-between items-center border-b py-4">
            <div className="flex items-center">
                {/* Hình ảnh sản phẩm */}
                <img
                    src={product.image?.[0]} // Sử dụng ảnh đầu tiên trong mảng image
                    alt={product.product_name}
                    className="w-20 h-20 object-cover mr-4"
                />
                <div>
                    <h2 className="font-semibold">{product.product_name}</h2>
                    <p className="text-gray-600">Giá gốc: ${product.originalPrice.toFixed(2)}</p>
                    <p className="text-red-500">Giá đã giảm: ${product.discountedPrice?.toFixed(2)}</p>
                    <p className="text-gray-500">Số lượng: {quantity}</p>
                    <div className="mt-2">
                        {product.attributes?.map(attr => (
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
                    ${(product.discountedPrice! * quantity).toFixed(2)} {/* Tính tổng giá cho sản phẩm */}
                </p>
                <div className="flex gap-4 mt-2">
                    {/* Các nút điều chỉnh số lượng */}
                    <button onClick={() => onUpdateQuantity(true)} className="px-2 py-1 bg-blue-500 text-white rounded">+</button>
                    <button onClick={() => onUpdateQuantity(false)} className="px-2 py-1 bg-blue-500 text-white rounded">-</button>
                    {/* Nút xóa sản phẩm */}
                    <button onClick={onRemove} className="px-4 py-1 bg-red-500 text-white rounded">Xóa</button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
