import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@src/types/Product';

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
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
            const { product, quantity } = action.payload;
            const existingProduct = state.items.find(item => item._id === product._id);

            if (existingProduct) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng
                existingProduct.quantity += quantity;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng với số lượng
                state.items.push({ ...product, quantity });
            }
        },
    },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
