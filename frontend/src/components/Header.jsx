import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout'; // Import the Logout component

const Header = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown state

  // Extract userId from currentUser
  const userId = currentUser?.id;

  // Handle mouse enter to show dropdown
  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  // Handle mouse leave to hide dropdown after 1 second delay
  const handleMouseLeave = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 1250); 
  };

  return (
    <header className={`fixed top-8 left-1/2 transform -translate-x-1/2 w-10/12 md:w-1/3 bg-opacity-10 bg-[#131313] text-neutral-100 rounded-full shadow-lg backdrop-blur-2xl z-50 p-3 h-16 mb-44 transition-all duration-300 ease-in-out hover:scale-105 border-2 border-gray-800 ${showDropdown ? 'backdrop-blur-md' : ''}`}>
      <div className="flex items-center justify-center space-x-4 relative">
        <Link
          to="/avl"
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md ${
            location.pathname === '/avl'
              ? 'text-teal-50'
              : 'text-gray-400 hover:text-teal-50'
          }`}
        >
          Avl
        </Link>

        {/* Dropdown Wrapper */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to="/donate"
            className={`px-3 md:px-4 py-1 md:py-2 rounded-md ${
              location.pathname === '/donate'
                ? 'text-teal-50'
                : 'text-gray-400 hover:text-teal-50'
            }`}
          >
            Donate
          </Link>

          {/* Dropdown Menu */}
          <div
            className={`absolute left-0 top-12 w-40 bg-[#131313] bg-opacity-90 backdrop-blur-2xl text-white rounded-full shadow-lg z-40 p-3 transition-all duration-300 ease-in-out transform ${
              showDropdown
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
            onMouseEnter={handleMouseEnter} // Keep dropdown open when hovering on it
            onMouseLeave={handleMouseLeave} // Hide when mouse leaves dropdown area
          >
            <Link
              to="/addfood"
              className="block px-4 py-2 rounded-full text-gray-400 hover:text-teal-50 transition duration-200 ease-in-out"
            >
              Add Food
            </Link>
            <Link
              to="/managefood"
              className="block px-4 py-2 rounded-full text-gray-400 hover:text-teal-50 transition duration-200 ease-in-out"
            >
              Manage Food
            </Link>
          </div>
        </div>

        {currentUser && (
          <Link
            to={`/donor/requests/${userId}`}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-md ${
              location.pathname === `/donor/requests/${userId}`
                ? 'text-teal-50'
                : 'text-gray-400 hover:text-teal-50'
            }`}
          >
            My Requests
          </Link>
        )}

        <Link
          to="/about"
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md ${
            location.pathname === '/about'
              ? 'text-teal-50'
              : 'text-gray-400 hover:text-teal-50'
          }`}
        >
          About
        </Link>
      </div>

      {/* Background Blur when Dropdown is Active */}
      {showDropdown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-30"></div>
      )}
    </header>
  );
};

export default Header;