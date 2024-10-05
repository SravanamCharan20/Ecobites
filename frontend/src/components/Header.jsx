import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCaretDown } from 'react-icons/fa'; // Icon for dropdown
import SignupButton from './SIgnupbutton';

const Header = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [showFoodDropdown, setShowFoodDropdown] = useState(false); // Dropdown state for food
  const [showNonFoodDropdown, setShowNonFoodDropdown] = useState(false); // Dropdown state for non-food
  const foodDropdownRef = useRef(null); // Reference for food dropdown
  const nonFoodDropdownRef = useRef(null); // Reference for non-food dropdown

  const userId = currentUser?.id;
  
  const [scrollY, setScrollY] = useState(0); // To track scroll position
  const [isVisible, setIsVisible] = useState(true); // To control navbar visibility
  
  // Effect for handling clicks outside the dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (foodDropdownRef.current && !foodDropdownRef.current.contains(event.target)) {
        setShowFoodDropdown(false);
      }
      if (nonFoodDropdownRef.current && !nonFoodDropdownRef.current.contains(event.target)) {
        setShowNonFoodDropdown(false);
      }
    };

    // Add event listener for mouse down events
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleFoodDropdown = () => {
    setShowFoodDropdown((prev) => !prev);
  };

  const toggleNonFoodDropdown = () => {
    setShowNonFoodDropdown((prev) => !prev);
  };

  // Effect to track scroll direction
  useEffect(() => {
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        // User is scrolling down and passed 100px, hide the navbar
        setIsVisible(false);
      } else if (currentScrollY < prevScrollY || currentScrollY <= 100) {
        // User is scrolling up or near the top of the page, show the navbar
        setIsVisible(true);
      }

      prevScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-teal-800 text-white h-12 flex items-center px-6 z-50 border-b transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-12'
      }`}
    >
      <div><Link
                to="/"
                className="text-1xl"
              >
                EcoBites
              </Link></div>
      <div className='justify-around ml-60'>
      <div className="flex items-center space-x-8">
        <Link
          to="/avl"
          className={`text-sm ${location.pathname === '/avl' ? 'font-semibold' : 'hover:underline'}`}
        >
          Available Food Items
        </Link>
        <Link
          to="/avlnf"
          className={`text-sm ${location.pathname === '/avl' ? 'font-semibold' : 'hover:underline'}`}
        >
          Available Non-Food Items
        </Link>

        {/* Food Dropdown Wrapper */}
        <div className="relative" ref={foodDropdownRef}>
          <button
            onClick={toggleFoodDropdown}
            className={`text-sm flex items-center ${location.pathname === '/donate' ? 'font-semibold' : 'hover:underline'}`}
          >
            Donate <FaCaretDown className={`ml-2 ${showFoodDropdown ? 'rotate-180' : 'rotate-0'}`} />
          </button>

          {/* Food Dropdown Menu */}
          {showFoodDropdown && (
            <div className="absolute left-0 mt-4 bg-teal-600 text-white rounded-lg w-48 p-2">
              <Link
                to="/addfood"
                className="block px-2 py-1 text-sm hover:underline"
                onClick={() => setShowFoodDropdown(false)} // Close dropdown on link click
              >
                Add Food Item
              </Link>
              <Link
                to="/managefood"
                className="block px-2 py-1 text-sm text-white hover:underline"
                onClick={() => setShowFoodDropdown(false)} 
              >
                Manage Food Item
              </Link>
              <Link
                to="/addnonfood"
                className="block px-2 py-1 text-sm text-white hover:underline"
                onClick={() => setShowFoodDropdown(false)} 
              >
                Add Non-Food Item
              </Link>
              <Link
                to="/managefood"
                className="block px-2 py-1 text-sm text-white hover:underline"
                onClick={() => setShowFoodDropdown(false)} 
              >
                Manage Non-Food Item
              </Link>
            </div>
          )}
        </div>

        {/* Non-Food Dropdown Wrapper */}
        <div className="relative" ref={nonFoodDropdownRef}>
          <button
            onClick={toggleNonFoodDropdown}
            className={`text-sm flex items-center hover:underline`}
          >
            Non-Food Items <FaCaretDown className={`ml-2 ${showNonFoodDropdown ? 'rotate-180' : 'rotate-0'}`} />
          </button>

          {/* Non-Food Dropdown Menu */}
          {showNonFoodDropdown && (
            <div className="absolute left-0 mt-2 border text-black border-black rounded-lg w-40 p-2">
              <Link
                to="/nonfood/free"
                className="block px-2 py-1 text-sm hover:underline"
                onClick={() => setShowNonFoodDropdown(false)} // Close dropdown on link click
              >
                Free
              </Link>
              <Link
                to="/nonfood/buy"
                className="block px-2 py-1 text-sm hover:underline"
                onClick={() => setShowNonFoodDropdown(false)}
              >
                Buy
              </Link>
              <Link
                to="/nonfood/borrow"
                className="block px-2 py-1 text-sm hover:underline"
                onClick={() => setShowNonFoodDropdown(false)}
              >
                Borrow
              </Link>
            </div>
          )}
        </div>

        <Link
          to={`/myrequests/${userId}`}
          className={`text-sm ${location.pathname === `/myrequests/${userId}` ? 'font-semibold' : 'hover:underline'}`}
        >
          MyRequests
        </Link>
        <Link
          to="/about"
          className={`text-sm ${location.pathname === '/about' ? 'font-semibold' : 'hover:underline'}`}
        >
          About
        </Link>
      </div>
      </div>
      <SignupButton />
    </header>
  );
};

export default Header;