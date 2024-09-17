import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AvailableFoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch('/api/donor/donorform');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFoodItems(data);
      } catch (error) {
        setError('Failed to load food items.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/food-details/${id}`); 
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString(undefined, options);
  };

  const formatFullAddress = (address) => {
    const { street, city, state, postalCode, country } = address || {};
    return `${street}, ${city}, ${state} - ${postalCode}, ${country}`;
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Food List</h1>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {foodItems.length === 0 && !loading && (
        <p className="text-center text-gray-500">No donated food items available.</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left border-b-2 border-gray-200 bg-gray-100">S. No</th>
              <th className="py-3 px-6 text-left border-b-2 border-gray-200 bg-gray-100">Donor</th>
              <th className="py-3 px-6 text-left border-b-2 border-gray-200 bg-gray-100">Food Items</th>
              <th className="py-3 px-6 text-left border-b-2 border-gray-200 bg-gray-100">Full Address</th>
              <th className="py-3 px-6 text-left border-b-2 border-gray-200 bg-gray-100">Creation Date</th>
              <th className="py-3 px-6 text-left border-b-2 border-gray-200 bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="py-3 px-6 border-b text-left">{index + 1}</td>
                <td className="py-3 px-6 border-b text-left">{item.name}</td>
                <td className="py-3 px-6 border-b text-left">
                  {item.foodItems.map((food, i) => (
                    <span key={i}>{food.name}{i < item.foodItems.length - 1 ? ', ' : ''}</span>
                  ))}
                </td>
                <td className="py-3 px-6 border-b text-left">{formatFullAddress(item.address)}</td>
                <td className="py-3 px-6 border-b text-left">{formatDate(item.createdAt)}</td>
                <td className="py-3 px-6 border-b text-left">
                  <button
                    onClick={() => handleViewDetails(item._id)}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableFoodList;