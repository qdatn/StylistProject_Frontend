import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@src/types/Product";
import { OrderAttribute } from "@src/types/Attribute";

export interface CartProduct extends Product {
  quantity: number;
  cart_attributes: OrderAttribute[];
}

interface CartState {
  items: CartProduct[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity: number;
        cart_attributes?: OrderAttribute[];
      }>
    ) => {
      const { product, quantity, cart_attributes } = action.payload;
      const existingProduct = state.items.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        existingProduct.quantity += quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng với số lượng
        state.items.push({
          ...product,
          quantity,
          cart_attributes: cart_attributes || [],
        });
      }
    },
    deleteItemFromCart: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      // Lọc bỏ sản phẩm có _id tương ứng với productId
      state.items = state.items.filter(
        (item) => item._id !== action.payload.productId
      );
    },
    updateProductQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      // Tìm sản phẩm
      const product = state.items.find(
        (item) => item._id === action.payload.productId
      );

      if (product) {
        product.quantity = action.payload.quantity;
      }
    },
    updateCartAttributes: (
      state,
      action: PayloadAction<{
        productId: string;
        cart_attributes: OrderAttribute[];
      }>
    ) => {
      // Tìm sản phẩm trong giỏ hàng
      const product = state.items.find(
        (item) => item._id === action.payload.productId
      );

      if (product) {
        // Cập nhật thuộc tính của sản phẩm
        product.cart_attributes = action.payload.cart_attributes;
      }
    },
  },
});

// Selector để tính tổng số lượng sản phẩm trong giỏ hàng
export const selectCartCount = (state: RootState) =>
  state.persist.cart.items.reduce((total, item) => total + item.quantity, 0);

export const {
  addToCart,
  deleteItemFromCart,
  updateProductQuantity,
  updateCartAttributes,
} = cartSlice.actions;
export default cartSlice.reducer;
