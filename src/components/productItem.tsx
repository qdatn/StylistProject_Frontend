// src/components/ProductItem.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@src/types/Product";
import { formatCurrency } from "@utils/format";

// Định nghĩa interface cho các thuộc tính sản phẩm
interface ProductItemProps {
  product: Product; // Truyền sản phẩm vào dưới dạng prop
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const navigate = useNavigate();
  const { _id, product_name, price, discounted_price, images } = product;

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
        src={images?.length ? images[0] : "https://via.placeholder.com/300x400"} // Sử dụng ảnh đầu tiên trong mảng image
        // src="https://res.cloudinary.com/dpnzwc8ti/image/upload/v1731837669/StylishEcommerce/product/%C3%81o%20kho%C3%A1c%20nam%20Zara_1731837673131/oclk6kqse1czydpjv9el.jpg"
        alt={product_name}
        className="object-contain w-full"
      />
      <div className="font-medium flex flex-col p-2 w-full">
        <h2 className="pb-2 text-[14px] text-neutral-700">{product_name}</h2>
        <div className="font-semibold flex flex-col pb-2 w-full">
          <div className="flex gap-4 pb-2 text-[14px] whitespace-nowrap">
            <p className="self-start text-zinc-600 line-through">
              {formatCurrency(price)}
            </p>
            {price && (
              <p className="grow shrink font-bold text-red-500">
                {formatCurrency(price)}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5 self-start">
            <div className="px-5 py-1.5 rounded-sm border border-solid bg-white border-zinc-300 text-zinc-600 text-xs font-semibold">
              MORE COLORS
            </div>
            <div className="px-5 py-1.5 rounded-sm border border-solid bg-stone-500 border-zinc-600 text-white text-xs font-semibold">
              NEW
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
