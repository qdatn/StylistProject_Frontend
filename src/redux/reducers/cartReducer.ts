import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@src/types/Product";

interface CartProduct extends Product {
  quantity: number;
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
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload;
      const existingProduct = state.items.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        existingProduct.quantity += quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng với số lượng
        state.items.push({ ...product, quantity });
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
  },
});

// Selector để tính tổng số lượng sản phẩm trong giỏ hàng
export const selectCartCount = (state: RootState) =>
  state.persist.cart.items.reduce((total, item) => total + item.quantity, 0);

export const { addToCart, deleteItemFromCart, updateProductQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
