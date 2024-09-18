// SignupButton.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout';

const SignupButton = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="fixed top-3 p-4 h-16 mb-44 right-4 z-50">
      {currentUser ? (
        <Logout />
      ) : (
        <Link
          to="/signup"
          className={`px-3 py-2 rounded-md ${
            location.pathname === '/signup'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-800 text-white hover:bg-teal-500'
          }`}
        >
          Signup
        </Link>
      )}
    </div>
  );
};

export default SignupButton;