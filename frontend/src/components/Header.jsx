import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCaretDown } from 'react-icons/fa'; // Icon for dropdown

const Header = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown state

  const userId = currentUser?.id;

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <header className={`fixed top-8 left-1/2 transform -translate-x-1/2 w-10/12 md:w-auto bg-opacity-10 bg-gray-400 text-neutral-100 rounded-3xl shadow-lg backdrop-blur-2xl z-50 h-14 py-1 px-4 mb-44 transition-all duration-300 ease-in-out hover:scale-105 border-2 border-gray-200 ${showDropdown ? 'backdrop-blur-md' : ''}`}>
      <div className="flex text-lg items-center justify-center space-x-4 relative">
        <Link
          to="/avl"
          className={`px-3 md:px-4 md:py-2 rounded-md ${location.pathname === '/avl' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
        >
          Available FoodList
        </Link>

        {/* Dropdown Wrapper */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className={`flex items-center px-3 md:px-4 py-1 md:py-2 rounded-md ${location.pathname === '/donate' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
          >
            Donate <FaCaretDown className={`ml-2 transition-transform duration-200 ${showDropdown ? 'rotate-180' : 'rotate-0'}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className={`absolute left-0 mt-3 top-12 w-52 bg-opacity-100 bg-gray-100 backdrop-blur-2xl rounded-l-2xl rounded-r-2xl rounded-b-2xl z-40 p-3 transition-transform duration-300 ease-in-out`}>
              <Link
                to="/addfood"
                className="block px-4 py-2 text-base rounded-full text-gray-600 hover:text-black transition duration-200 ease-in-out"
                onClick={closeDropdown}
              >
                Add Food
              </Link>
              <Link
                to="/managefood"
                className="block px-4 py-2 text-base rounded-full text-gray-600 hover:text-black transition duration-200 ease-in-out"
                onClick={closeDropdown}
              >
                Manage Food
              </Link>
            </div>
          )}
        </div>

        {currentUser && (
          <Link
            to={`/donor/requests/${userId}`}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-md ${location.pathname === `/donor/requests/${userId}` ? 'text-black' : 'text-gray-500 hover:text-black'}`}
          >
            My Requests
          </Link>
        )}

        <Link
          to="/about"
          className={`px-3 md:px-4 py-1 md:py-2 rounded-md ${location.pathname === '/about' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
        >
          About
        </Link>
      </div>

      {showDropdown && <div className="fixed inset-0 z-30" onClick={closeDropdown}></div>}
    </header>
  );
};

export default Header;