import { configureStore } from "@reduxjs/toolkit";
// import { Provider } from "react-redux";
import { exampleReducer, userReducer } from "./reducers/index";
import cartReducer from './reducers/cartReducer';

const store = configureStore({
  reducer: {
    example: exampleReducer,
    user: userReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
