// SignupButton.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout';

const SignupButton = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="fixed top-5 p-6 h-16 mb-44 right-10 z-50">
      {currentUser ? (
        <Logout />
      ) : (
        <Link
          to="/signup"
          className={`px-5 py-4 rounded-full ${
            location.pathname === '/signup'
              ? 'bg-gray-500 text-white'
              : 'bg-gray-500 text-white hover:bg-black hover:translate-x-1 hover:translate-y-1'
          }`}
        >
          Signup
        </Link>
      )}
    </div>
  );
};

export default SignupButton;