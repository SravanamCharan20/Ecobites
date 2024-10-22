import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 rounded-3xl m-5 p-10 text-gray-300 py-16 relative">
      {/* Large Background Icon */}
      <div className="absolute inset-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 1440 320"
          className="w-full h-full opacity-5"
        >
          <path
            fill="currentColor"
            d="M0,192L48,192C96,192,192,192,288,202.7C384,213,480,235,576,240C672,245,768,235,864,208C960,181,1056,139,1152,138.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 container mx-auto grid grid-cols-3 gap-8">
        {/* Left Section */}
        <div>
          <ul className="space-y-2">
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            <li><a href="/changelog" className="hover:underline">Change Log</a></li>
            <li><a href="/affiliate" className="hover:underline">Become Affiliate</a></li>
          </ul>
        </div>

        {/* Center Section */}
        <div>
          <ul className="space-y-2">
            <li><a href="/solo-pack" className="hover:underline">Buy Solo Pack</a></li>
            <li><a href="/team-pack" className="hover:underline">Buy Team Pack</a></li>
            <li><a href="/download" className="hover:underline">Download Free</a></li>
            <li><a href="/license" className="hover:underline">License Agreement</a></li>
          </ul>
        </div>

        {/* Right Section: Social Links */}
        <div className="flex space-x-4">
          <a href="https://linkedin.com" className="hover:underline">LinkedIn</a>
          <a href="https://twitter.com" className="hover:underline">Twitter</a>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-sm flex justify-between">
        <span>© Ecobites 2024</span>
        <span>Made by [Your Name]</span>
      </div>
    </footer>
  );
};

export default Footer;