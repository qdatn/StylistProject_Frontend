// src/redux/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for user
interface UserState {
  userInfo: {
    email: string | null;
    token: string | null;
  };
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userInfo: {
    email: null,
    token: null,
  },
  isAuthenticated: false,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to log in the user
    login(state, action: PayloadAction<{ email: string; token: string }>) {
      state.userInfo = {
        email: action.payload.email,
        token: action.payload.token,
      };
      state.isAuthenticated = true;
    },
    // Action to log out the user
    logout(state) {
      state.userInfo = { email: null, token: null };
      state.isAuthenticated = false;
    },
  },
});

// Export the actions
export const { login, logout } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
