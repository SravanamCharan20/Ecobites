import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff] to-[#fff] flex flex-col items-center font-sans">
      {/* Hero Section */}
      <section className="w-full flex flex-col-reverse md:flex-row items-center justify-between py-20 mt-16 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <h1 className="text-5xl font-bold text-gray-800 leading-tight">
            Give Back to Your <span className="text-green-600">Community</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Ecobites empowers communities to share essential food and non-food items. Donate what you don’t need or request what you do, today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-green-600 text-white px-8 py-4 mt-8 rounded-full shadow-lg hover:bg-green-700 transition"
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          src="https://images.unsplash.com/photo-1517685352821-92cf88aee5a5"
          alt="Helping Hands"
          className="w-full md:w-1/2 rounded-lg"
        />
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 bg-gray-100 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">How Ecobites Works</h2>
        <div className="flex flex-col md:flex-row justify-around items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg rounded-lg p-8 m-4 max-w-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1598511727034-809cbddf9b2b"
              alt="Donate"
              className="w-full h-40 object-cover rounded-md mb-6"
            />
            <h3 className="text-2xl font-semibold text-gray-700">Donate Items</h3>
            <p className="text-gray-600 mt-4">Provide food and essential goods to those in need in your community.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg rounded-lg p-8 m-4 max-w-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1574126154648-81fd34d9d2d9"
              alt="Request"
              className="w-full h-40 object-cover rounded-md mb-6"
            />
            <h3 className="text-2xl font-semibold text-gray-700">Request Items</h3>
            <p className="text-gray-600 mt-4">Need assistance? Make a request for essential food or non-food items.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg rounded-lg p-8 m-4 max-w-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1600156896267-88b6d3a8cf3e"
              alt="Browse Items"
              className="w-full h-40 object-cover rounded-md mb-6"
            />
            <h3 className="text-2xl font-semibold text-gray-700">Browse Available Items</h3>
            <p className="text-gray-600 mt-4">View all available food and non-food items in your area.</p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-20 bg-white text-center px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Make a Difference?</h2>
        <p className="text-lg text-gray-600 mb-12">
          Join Ecobites today to donate, request, or browse items. Let’s work together to build a stronger, more supportive community.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="bg-green-600 text-white px-12 py-4 rounded-full shadow-lg hover:bg-green-700 transition"
        >
          Join Us
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-300 py-10 text-center">
        <p className="text-xl">&copy; 2024 Ecobites. Empowering Communities Together.</p>
      </footer>
    </div>
  );
};

export default Home;