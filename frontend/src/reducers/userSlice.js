// src/reducers/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const decodeToken = (token) => {
  try {
    // Split the token into parts
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

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
        const user = decodeToken(token); // Decode the token to get user details
        if (user) {
          state.currentUser = user;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      } else {
        state.isAuthenticated = false;
      }
    },
  },
});

export const { setUser, logout, initializeUser } = userSlice.actions;
export default userSlice.reducer;