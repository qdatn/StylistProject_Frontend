import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserLogin } from "@src/types/auth/AuthType";
import { stat } from "fs";

interface AuthState {
  isLogin: boolean;
  user: UserLogin | null;
}

const initialState: AuthState = {
  isLogin: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserLogin>) => {
      state.isLogin = true;
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.isLogin = false;
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
