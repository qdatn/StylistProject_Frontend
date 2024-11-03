// redux/reducer/cartReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartProduct {
    id: string;
    name: string;
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
    attributes: { key: string; value: string[] }[];
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
        addToCart: (state, action: PayloadAction<CartProduct>) => {
            const existingProduct = state.items.find(item => item.id === action.payload.id);
            if (existingProduct) {
                existingProduct.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
    },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
