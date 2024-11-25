import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "@redux/reducers/index";
import cartReducer from "@redux/reducers/cartReducer";

// store into local storage to use persistently
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
};

// Kết hợp các reducer và áp dụng persistReducer
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  // các reducer khác
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: {
    // user: userReducer,
    persist: persistedReducer,
    // cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;
