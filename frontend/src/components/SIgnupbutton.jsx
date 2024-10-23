import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout';

const SignupButton = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="fixed  right-10 z-50">
      {currentUser ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="focus:outline-none flex items-center space-x-2"
          >
            <img
              src={currentUser.profilePicture ? `${import.meta.env.VITE_API_URL}/uploads/${currentUser.profilePicture}` : '/default profile.jpg'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 border bg-[#fff] border-black shadow-lg rounded-lg overflow-hidden z-50"
            >
              <Link
                to="/update-profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                Update Profile
              </Link>
              <Logout />
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/signup"
          className={`px-3 py-2 rounded-full ${
            location.pathname === '/signup'
              ? 'bg-green-500 text-white'
              : 'bg-green-500 text-white hover:bg-black hover:translate-x-1 hover:translate-y-1'
          }`}
        >
          Signup
        </Link>
      )}
    </div>
  );
};

export default SignupButton;