import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FoodDetails = () => {
  const { id } = useParams(); // Get the item ID from URL
  const [foodDetails, setFoodDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await fetch(`/api/donor/${id}`); // Adjust API endpoint to match your route
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFoodDetails(data);
      } catch (error) {
        setError('Failed to load food details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!foodDetails) return <p className="text-center text-gray-500">No details available for this item.</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Food Details</h2>
      <div className="bg-white shadow-md rounded px-8 py-6">
        <strong>Food Item Name:</strong> {foodDetails.foodItems?.map(item => (
          <div key={item._id} className="mb-4">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Unit:</strong> {item.unit}</p>
            <p><strong>Expiry Date:</strong> {formatDate(item.expiryDate)}</p>
          </div>
        )) || 'N/A'}
        <p><strong>Available Until:</strong> {formatDate(foodDetails.availableUntil)}</p>
        <p><strong>Donor Name:</strong> {foodDetails.name || 'N/A'}</p>
        <p><strong>Contact Number:</strong> {foodDetails.contactNumber || 'N/A'}</p>
        <p><strong>Address:</strong> {foodDetails.address?.street || 'N/A'}, {foodDetails.address?.city || 'N/A'}, {foodDetails.address?.state || 'N/A'}, {foodDetails.address?.postalCode || 'N/A'}, {foodDetails.address?.country || 'N/A'}</p>
        {/* Add more fields if necessary */}
      </div>
    </div>
  );
};

export default FoodDetails;