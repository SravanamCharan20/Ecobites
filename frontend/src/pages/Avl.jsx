import React, { useState, useEffect } from 'react';

const AvailableFoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleRequest = (itemId) => {
    console.log('Request button clicked for item:', itemId);
  };

  const formatLocation = (latitude, longitude) => {
    return `Lat: ${latitude}, Long: ${longitude}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
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
              <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100">Food Name</th>
              <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100">Food Details</th>
              <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100">Available Until</th>
              <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100">Donor</th>
              <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100">Location</th>
              <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">
                  {item.foodItems && item.foodItems.length > 0 ? (
                    item.foodItems.map((foodItem, foodIndex) => (
                      <div
                        key={foodIndex}
                        className={`mb-2 p-2 rounded ${foodIndex % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'} border border-blue-200`}
                      >
                        <p><strong>Type:</strong> {foodItem.type}</p>
                        <p><strong>Quantity:</strong> {foodItem.quantity} {foodItem.unit}</p>
                        <p><strong>Expiry Date:</strong> {formatDate(foodItem.expiryDate)}</p>
                      </div>
                    ))
                  ) : (
                    <p>No food items provided.</p>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{formatDate(item.availableUntil)}</td>
                <td className="py-2 px-4 border-b">{item.name || 'Anonymous'}</td>
                <td className="py-2 px-4 border-b">
                  {item.address ? (
                    <>
                      <p><strong>Street:</strong> {item.address.street}</p>
                      <p><strong>City:</strong> {item.address.city}</p>
                      <p><strong>State:</strong> {item.address.state}</p>
                      <p><strong>Postal Code:</strong> {item.address.postalCode}</p>
                      <p><strong>Country:</strong> {item.address.country}</p>
                    </>
                  ) : item.location ? (
                    <>
                      <p>{formatLocation(item.location.latitude, item.location.longitude)}</p>
                      <p><strong>City:</strong> {item.location.city || 'N/A'}</p>
                      <p><strong>State:</strong> {item.location.state || 'N/A'}</p>
                    </>
                  ) : (
                    <p>Location details not provided</p>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleRequest(item._id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Request
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