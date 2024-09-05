// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout'; // Import the Logout component

const Header = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-blue-500 text-white shadow-md p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/" className='text-4xl font-mono p-4'>
          Ecobites
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow flex justify-center space-x-4">
        <Link
          to="/donate"
          className={`px-4 py-2 rounded-md ${
            location.pathname === '/donate'
              ? 'bg-slate-700 text-white'
              : 'text-gray-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          Donate
        </Link>
        <Link
          to="/about"
          className={`px-4 py-2 rounded-md ${
            location.pathname === '/about'
              ? 'bg-slate-700 text-white'
              : 'text-gray-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          About
        </Link>

        {currentUser ? (
          <Logout />
        ) : (
          <Link
            to="/signup"
            className={`px-4 py-2 rounded-md ${
              location.pathname === '/signup'
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Signup
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;