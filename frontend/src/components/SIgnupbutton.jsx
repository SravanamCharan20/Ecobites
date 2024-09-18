// SignupButton.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout';

const SignupButton = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="fixed top-4 p-6 h-16 mb-44 right-4 z-50">
      {currentUser ? (
        <Logout />
      ) : (
        <Link
          to="/signup"
          className={`px-6 py-5 rounded-full ${
            location.pathname === '/signup'
              ? 'bg-[#dff35d] text-black'
              : 'bg-[#e6f391] text-black hover:bg-[#e3fe35] hover:translate-x-1 hover:translate-y-1'
          }`}
        >
          Signup
        </Link>
      )}
    </div>
  );
};

export default SignupButton;