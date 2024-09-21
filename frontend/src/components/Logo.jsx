import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  const [logoColor, setLogoColor] = useState('text-black');

  useEffect(() => {
    const handleScroll = () => {
      const targetElement = document.getElementById('target-section'); // Element over which color should change

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        
        // If the logo is over the target section, change the color
        if (rect.top <= 100 && rect.bottom >= 100) {
          setLogoColor('text-white bg-teal-800 rounded-full p-3'); // Change to white when over a dark section
        } else {
          setLogoColor('text-teal-800'); // Default to black
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-5 p-4 h-16 mb-44 left-6 z-50">
      <Link to="/" className={`text-5xl font-sans transition-colors duration-300 ease-in-out ${logoColor}`}>
        Ecobites
      </Link>
    </div>
  );
};

export default Logo;