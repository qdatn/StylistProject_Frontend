import React, { useEffect, useState } from "react";
import { Product } from "@src/types/Product";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineDown,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { Input } from "antd";
import { Link } from "react-router-dom";
import { CartProduct, updateCartAttributes } from "@redux/reducers/cartReducer";
import { OrderAttribute } from "@src/types/Attribute";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "@utils/format";

export interface CartItemProps {
  // product: Product; // Dữ liệu sản phẩm từ Cart
  product: CartProduct; // Dữ liệu sản phẩm từ Cart
  onUpdateQuantity?: (newQuantity: number) => void; // Hàm để cập nhật số lượng, truyền trực tiếp số lượng mới
  onRemove?: () => void; // Hàm để xóa sản phẩm
  onSelect: (selected: boolean) => void; // Hàm để chọn sản phẩm
  quantity: number; // Số lượng sản phẩm trong giỏ hàng
}

// Hàm để lấy hình ảnh sản phẩm dựa trên ID

const CartItem: React.FC<CartItemProps> = ({
  product,
  onUpdateQuantity,
  onRemove,
  onSelect,
  quantity,
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState<
    OrderAttribute[]
  >(product.cart_attributes);
  const userId: string =
    useSelector((state: RootState) => state.persist.auth.user?.user._id) || "";
  const cart = useSelector(
    (state: RootState) => state.persist.cart[userId!]?.items || []
  );
  const [isSelected, setIsSelected] = useState(false);
  const dispatch = useDispatch();

  const handleAttributeChange = (key: string, value: string) => {
    // setSelectedAttributes((prev) => ({ ...prev, [key]: value }));
    setSelectedAttributes((prev) => {
      const updatedAttributes = prev ? [...prev] : [];

      // Tìm thuộc tính trong danh sách hiện tại
      const existingAttributeIndex = updatedAttributes.findIndex(
        (attr) => attr.key === key
      );

      if (existingAttributeIndex > -1) {
        // Nếu thuộc tính đã tồn tại, cập nhật giá trị
        // updatedAttributes[existingAttributeIndex].value = value;
        updatedAttributes[existingAttributeIndex] = {
          ...updatedAttributes[existingAttributeIndex],
          value: value, // Cập nhật giá trị trong bản sao
        };
      } else {
        // Nếu thuộc tính chưa tồn tại, thêm mới
        updatedAttributes.push({ key, value });
      }
      return updatedAttributes;
    });
  };

  useEffect(() => {
    if (selectedAttributes) {
      dispatch(
        updateCartAttributes({
          userId: userId,
          productId: product._id,
          cart_attributes: selectedAttributes!,
        })
      );
    }
  }, [selectedAttributes]);

  useEffect(() => {
    console.log("CART ATTR:", selectedAttributes);
    console.log("cart redux", cart);
  }, [selectedAttributes, cart]);

  const toggleSelect = () => {
    const newSelected = !isSelected;
    setIsSelected(newSelected);
    onSelect(newSelected);
  };
  return (
    <div className="flex flex-row items-start p-4 border-b rounded-lg bg-white-50 mb-4">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images?.[0]} // Sử dụng ảnh đầu tiên trong mảng image
          alt={product.product_name}
          className="w-20 h-20 object-cover rounded-lg mr-4"
        />
      </Link>

      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold mb-1">{product.product_name}</h2>
          <button
            onClick={onRemove}
            className="text-gray-300 hover:text-gray-700"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
        <div className="flex flex-row gap-2 font-bold mb-2">
          {/* <span className="text-gray-500 line-through">
            {formatCurrency(product.price)}
          </span> */}
          <span className="text-red-500">{formatCurrency(product.price)}</span>
        </div>
        <div className="flex items-center mb-2 flex-wrap">
          {product.attributes.map((attr) => (
            <div key={attr.key} className="flex items-center mr-4 mb-2">
              <label className="mr-2 text-[15px]">{attr.key}:</label>
              <div className="relative">
                <select
                  value={
                    selectedAttributes?.find((item) => item.key === attr.key)
                      ?.value ||
                    (product.cart_attributes &&
                      product.cart_attributes.find(
                        (item) => item.key === attr.key
                      )?.value)
                  }
                  onChange={(e) =>
                    handleAttributeChange(attr.key, e.target.value)
                  }
                  className="text-[15px] appearance-none px-4 py-2 text-gray-700 focus:outline-none bg-white pr-6"
                >
                  {attr.value.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <AiOutlineDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <button
            onClick={() => onUpdateQuantity && onUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className="p-1 rounded-l text-gray-600 hover:bg-gray-200"
          >
            <AiOutlineMinus />
          </button>
          <Input
            type="text"
            min="1"
            max={product.stock_quantity}
            value={quantity}
            onChange={(e) =>
              onUpdateQuantity &&
              onUpdateQuantity(
                Math.max(
                  1,
                  Math.min(Number(e.target.value), product.stock_quantity)
                )
              )
            }
            className="text-center w-14 border"
          />
          <button
            onClick={() => onUpdateQuantity && onUpdateQuantity(quantity + 1)}
            disabled={quantity >= product.stock_quantity}
            className="p-1 rounded-r text-gray-600 hover:bg-gray-200"
          >
            <AiOutlinePlus />
          </button>
        </div>
      </div>
      <button onClick={toggleSelect} className="ml-4">
        <div
          className={`w-6 h-6 border rounded ${
            isSelected ? "bg-gray-400" : "bg-white"
          } flex items-center justify-center`}
        >
          <AiOutlineCheck
            className={isSelected ? "text-white" : "text-transparent"}
          />
        </div>
      </button>
    </div>
  );
};

export default CartItem;
