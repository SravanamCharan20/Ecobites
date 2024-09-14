// src/reducers/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isAuthenticated: false, // Add this flag to track authentication status
  },
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    initializeUser(state) {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Assuming you have a function to decode the token and fetch user details
        const user = decodeToken(token); // Implement decodeToken as needed
        state.currentUser = user;
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
  },
});

export const { setUser, logout, initializeUser } = userSlice.actions;
export default userSlice.reducer;