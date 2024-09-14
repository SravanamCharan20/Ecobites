// src/reducers/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('access_token', action.payload.token); // Save token to localStorage
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token'); // Clear token on logout
    },
    initializeUser(state) {
      const token = localStorage.getItem('access_token');
      if (token) {
        state.currentUser = { token };
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
  },
});

export const { setUser, logout, initializeUser } = userSlice.actions;
export default userSlice.reducer;