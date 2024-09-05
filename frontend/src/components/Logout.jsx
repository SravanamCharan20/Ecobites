// src/components/Logout.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/userSlice';
import Cookies from 'js-cookie'; // Assuming you're using js-cookie for managing cookies

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    Cookies.remove('token'); // Remove token from cookies
    dispatch(logout()); // Dispatch logout action to clear user from Redux store
  };

  return (
    <button
      onClick={handleLogout}
      className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
    >
      Logout
    </button>
  );
};

export default Logout;