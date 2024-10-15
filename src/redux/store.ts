import { configureStore } from "@reduxjs/toolkit";
// import { Provider } from "react-redux";
import { exampleReducer, userReducer } from "./reducers/index";

const store = configureStore({
  reducer: {
    example: exampleReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
