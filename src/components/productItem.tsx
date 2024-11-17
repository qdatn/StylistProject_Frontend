// src/components/ProductItem.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@src/types/Product';

// Định nghĩa interface cho các thuộc tính sản phẩm
interface ProductItemProps {
  product: Product; // Truyền sản phẩm vào dưới dạng prop
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const navigate = useNavigate();
  const { _id, product_name, originalPrice, discountedPrice, image } = product;

  const handleClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded-sm shadow hover:shadow-lg transition bg-white cursor-pointer"
    >
      <img
        loading="lazy"
        src={product.image?.[0]} // Sử dụng ảnh đầu tiên trong mảng image
        alt={product.product_name}
        className="object-contain w-full"
      />
      <div className="font-medium flex flex-col p-2 w-full">
        <h2 className="pb-2 text-[14px] text-neutral-700">
          {product_name}
        </h2>
        <div className="font-semibold flex flex-col pb-2 w-full">
          <div className="flex gap-4 pb-2 text-[14px] whitespace-nowrap">
            <p className="self-start text-zinc-600 line-through">
              £{originalPrice.toFixed(2)}
            </p>
            {discountedPrice && (
              <p className="grow shrink font-bold text-red-500">
                £{discountedPrice.toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5 self-start">
            <div
              className="px-5 py-1.5 rounded-sm border border-solid bg-white border-zinc-300 text-zinc-600 text-xs font-semibold"
            >
              MORE COLORS
            </div>
            <div
              className="px-5 py-1.5 rounded-sm border border-solid bg-stone-500 border-zinc-600 text-white text-xs font-semibold"
            >
              STOCK OUT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
