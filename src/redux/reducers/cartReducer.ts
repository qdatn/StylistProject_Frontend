import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@src/types/Product";
import { OrderAttribute } from "@src/types/Attribute";

export interface CartProduct extends Product {
  quantity: number;
  cart_attributes: OrderAttribute[];
}

interface CartState {
  [userId: string]: {
    items: CartProduct[];
  };
}

const initialState: CartState = {
  "": { items: [] },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        userId: string;
        product: Product;
        quantity: number;
        cart_attributes?: OrderAttribute[];
      }>
    ) => {
      const { userId, product, quantity, cart_attributes } = action.payload;

      // Kiểm tra xem userId đã có trong state chưa
      if (!state[userId]) {
        state[userId] = { items: [] };
      }

      const userCart = state[userId].items;

      const existingProduct = state[userId].items.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        existingProduct.quantity += quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng với số lượng
        state[userId].items.push({
          ...product,
          quantity,
          cart_attributes: cart_attributes || [],
        });
      }
    },
    deleteItemFromCart: (
      state,
      action: PayloadAction<{ userId: string; productId: string }>
    ) => {
      // Lọc bỏ sản phẩm có _id tương ứng với productId
      const { userId, productId } = action.payload;
      state[userId].items = state[userId].items.filter(
        (item) => item._id !== productId
      );
    },
    updateProductQuantity: (
      state,
      action: PayloadAction<{
        userId: string;
        productId: string;
        quantity: number;
      }>
    ) => {
      // Tìm sản phẩm
      const { userId, productId, quantity } = action.payload;
      const product = state[userId].items.find(
        (item) => item._id === productId
      );

      if (product) {
        product.quantity = quantity;
      }
    },
    updateCartAttributes: (
      state,
      action: PayloadAction<{
        userId: string;
        productId: string;
        cart_attributes: OrderAttribute[];
      }>
    ) => {
      // Tìm sản phẩm trong giỏ hàng
      const { userId, productId, cart_attributes } = action.payload;
      const product = state[userId].items.find(
        (item) => item._id === productId
      );

      if (product) {
        // Cập nhật thuộc tính của sản phẩm
        product.cart_attributes = cart_attributes;
      }
    },
  },
});

// Selector để tính tổng số lượng sản phẩm trong giỏ hàng
export const selectCartCount = (userId: string) => (state: RootState) => {
  return state.persist.cart[userId]?.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
};
export const {
  addToCart,
  deleteItemFromCart,
  updateProductQuantity,
  updateCartAttributes,
} = cartSlice.actions;
export default cartSlice.reducer;
