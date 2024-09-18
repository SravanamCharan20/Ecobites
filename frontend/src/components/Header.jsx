import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout'; // Import the Logout component

const Header = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  // Extract userId from currentUser
  const userId = currentUser?.id;

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-10/12 md:w-1/3 bg-opacity-55 bg-[rgba(57,57,57,0.55)] text-white rounded-full shadow-lg backdrop-blur-lg z-50 p-3 h-16 mb-44 transition-all duration-300 ease-in-out hover:scale-105">
      <div className="flex items-center justify-center space-x-4">
        <Link
          to="/avl"
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md ${
            location.pathname === '/avl'
              ? 'text-teal-50 '
              : 'text-gray-300 hover:text-teal-50'
          }`}
        >
          Avl
        </Link>
        <Link
          to="/donate"
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md ${
            location.pathname === '/donate'
              ? 'text-teal-50 '
              : 'text-gray-300 hover:text-teal-50'
          }`}
        >
          Donate
        </Link>
        {currentUser && (
          <Link
            to={`/donor/requests/${userId}`}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-md ${
              location.pathname === `/donor/requests/${userId}`
                ? 'text-teal-50 '
                : 'text-gray-300 hover:text-teal-50 '
            }`}
          >
            My Requests
          </Link>
        )}
        <Link
          to="/about"
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md ${
            location.pathname === '/about'
              ? 'text-teal-50 '
              : 'text-gray-300 hover:text-teal-50 '
          }`}
        >
          About
        </Link>
      </div>
    </header>
  );
};

export default Header;