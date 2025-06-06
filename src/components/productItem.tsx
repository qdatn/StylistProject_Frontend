import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@src/types/new/Product";
import { formatCurrency } from "@utils/format";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const navigate = useNavigate();
  const { _id, product_name, images, variants } = product;

  const handleClick = () => {
    navigate(`/product/${_id}`);
  };

  // Tìm giá thấp nhất và cao nhất trong variants
  const minPrice = variants && variants.length > 0
    ? Math.min(...variants.map((v) => v.price))
    : 0;
  const maxPrice = variants && variants.length > 0
    ? Math.max(...variants.map((v) => v.price))
    : 0;
  return (
    <div
      onClick={handleClick}
      className="border rounded-sm shadow hover:shadow-lg transition bg-white cursor-pointer relative group w-[250px]"
    >
      <div className="relative w-full h-[300px] overflow-hidden">
        <img
          loading="lazy"
          src={
            images?.length
              ? images[0]
              : "../src/public/assets/images/default-product-image.png"
          }
          alt={product_name}
          className="inset-0 w-full h-[300px] object-cover group-hover:scale-110 duration-500"
        />
      </div>

      <div className="font-medium flex flex-col p-2 w-[250px]">
        <h2 className="truncate pb-2 text-[14px] text-neutral-700 text-ellipsis overflow-hidden whitespace-nowrap">
          {product_name}
        </h2>

        <div className="font-semibold flex flex-col pb-2 w-[250px]">
          <div className="flex gap-4 pb-2 text-[14px] whitespace-nowrap">
            <p className="grow shrink font-bold text-red-500">
              {minPrice > 0 && maxPrice > 0
                ? minPrice === maxPrice
                  ? formatCurrency(minPrice)
                  : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
                : "Contact"}

            </p>
          </div>

          <div className="flex flex-row gap-2.5 self-start">
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
