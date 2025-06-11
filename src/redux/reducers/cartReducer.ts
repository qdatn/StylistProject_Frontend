import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductVariant } from "@src/types/new/Product";
import { OrderAttribute } from "@src/types/Attribute";

export interface CartProduct extends Product {
  quantity: number;
  price: number;
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

// Hàm so sánh mảng thuộc tính
const areAttributesEqual = (
  a: OrderAttribute[],
  b: OrderAttribute[]
): boolean => {
  if (a.length !== b.length) return false;
  const aMap = new Map(a.map((attr) => [attr.key, attr.value]));
  for (const attr of b) {
    if (aMap.get(attr.key) !== attr.value) {
      return false;
    }
  }
  return true;
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
        price: number;
        cart_attributes?: OrderAttribute[];
      }>
    ) => {
      const { userId, product, quantity, price, cart_attributes } =
        action.payload;

      // Kiểm tra xem userId đã có trong state chưa
      if (!state[userId]) {
        state[userId] = { items: [] };
      }

      const userCart = state[userId].items;

      const existingProduct = state[userId].items.find(
        (item) => item._id === product._id && areAttributesEqual(item.cart_attributes, cart_attributes!)
      );

      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        existingProduct.quantity += quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng với số lượng
        userCart.push({
          ...product,
          quantity,
          price,
          // cart_attributes: cart_attributes || [],
          cart_attributes: [...cart_attributes!],
        });
      }
    },
    deleteItemFromCart: (
      state,
      action: PayloadAction<{ userId: string; productId: string, cart_attributes: OrderAttribute[] }>
    ) => {
      // Lọc bỏ sản phẩm có _id tương ứng với productId
      const { userId, productId, cart_attributes } = action.payload;
      state[userId].items = state[userId].items.filter(
        (item) => !(item._id === productId && 
          areAttributesEqual(item.cart_attributes, cart_attributes))
          // item._id !== productId
      );
    },
    updateProductQuantity: (
      state,
      action: PayloadAction<{
        userId: string;
        productId: string;
        quantity: number;
        cart_attributes: OrderAttribute[];
      }>
    ) => {
      // Tìm sản phẩm
      const { userId, productId, quantity, cart_attributes } = action.payload;
      const product = state[userId].items.find(
        (item) => item._id === productId && 
        areAttributesEqual(item.cart_attributes, cart_attributes)
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
        oldAttributes: OrderAttribute[];
        newAttributes: OrderAttribute[];
        newPrice: number;
      }>
    ) => {
      // Tìm sản phẩm trong giỏ hàng
      const { userId, productId, oldAttributes, newAttributes, newPrice } = action.payload;
      const product = state[userId].items.find(
        (item) => item._id === productId && 
            areAttributesEqual(item.cart_attributes, oldAttributes)
      );

      if (product) {
        // Cập nhật thuộc tính của sản phẩm
        product.cart_attributes = newAttributes;
        product.price = newPrice;
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
