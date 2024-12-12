import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@src/types/Product";
import { formatCurrency } from "@utils/format";

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
      className="border rounded-sm shadow hover:shadow-lg transition bg-white cursor-pointer relative group w-[250px]"
    >
      {/* Thêm lớp wrapper để cố định kích thước hình ảnh */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <img
          loading="lazy"
          src={images?.length ? images[0] : "https://via.placeholder.com/300x400"}
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
            {discounted_price ? (
              <>
                <p className="self-start text-zinc-600 line-through">
                  {formatCurrency(price)}
                </p>
                <p className="grow shrink font-bold text-red-500">
                  {formatCurrency(discounted_price)}
                </p>
              </>
            ) : (
              <p className="grow shrink font-bold text-red-500">
                {formatCurrency(price)}
              </p>
            )}
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
