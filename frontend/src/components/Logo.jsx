// Logo.js
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <div className="fixed top-4 p-5 h-16 mb-44 left-6 z-50">
    <Link to="/" className="text-5xl font-black text-[#dff35d]">
      Ecobites
    </Link>
  </div>
);

export default Logo;