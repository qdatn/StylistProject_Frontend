// src/components/ProductItem.tsx
import React from 'react';
import Link from 'next/link';

// Định nghĩa interface cho các thuộc tính sản phẩm
// Định nghĩa kiểu cho sản phẩm
interface Product {
    id: number; // Thêm ID vào kiểu sản phẩm
    name: string;
    originalPrice: string;
    discountedPrice: string;
    image: string;
  }

interface ProductItemProps {
  product: Product; // Truyền sản phẩm vào dưới dạng prop
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { id, name, originalPrice, discountedPrice, image } = product;

  return (
  <Link href={`/product/${id}`} className=" border rounded-sm shadow hover:shadow-lg transition bg-white">
    <img
        loading="lazy"
        src={image}
        alt={name}
        className="object-contain w-full"/>
    <div className="font-medium flex flex-col p-2 w-full">
        <h2 className="pb-2 text-[14px] text-neutral-700">
            {name}
        </h2>
        <div className="font-semibold flex flex-col pb-2 w-full">
            <div className="flex gap-4 pb-2 text-[14px] whitespace-nowrap">
            <p className="self-start text-zinc-600 line-through">{originalPrice}</p>
            {discountedPrice && (
                <p className="grow shrink font-bold text-red-500">{discountedPrice}</p>
            )}
        </div>
        <div className="flex flex-wrap gap-2.5 self-start ">
            <div
                className="px-5 py-1.5 rounded-sm border border-solid bg-white border-zinc-300 text-zinc-600 text-xs font-semibold">
                MORE COLORS
            </div>
            <div
                className="px-5 py-1.5 rounded-sm border border-solid bg-stone-500 border-zinc-600 text-white text-xs font-semibold">
                STOCK OUT
            </div>
        </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
