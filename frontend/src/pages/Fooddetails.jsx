import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FoodDetails = () => {
  const { id } = useParams();
  const [foodDetails, setFoodDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    latitude: '',
    longitude: '',
    description: '',
  });
  const [locationMethod, setLocationMethod] = useState('manual');
  const [locationStatus, setLocationStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await fetch(`/api/donor/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch food details.');
        }
        const data = await response.json();
        setFoodDetails(data);

        if (data.location) {
          const { latitude, longitude } = data.location;

          // Generate the Gomaps.pro URL
          setGoogleMapsUrl(`https://www.google.com/maps/embed/v1/view?center=${latitude},${longitude}&zoom=14`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'postalCode', 'country'].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/donor/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorId: foodDetails._id,
          name: formData.name,
          contactNumber: formData.contactNumber,
          address: {
            street: formData.address.street,
            city: formData.address.city,
            state: formData.address.state,
            postalCode: formData.address.postalCode,
            country: formData.address.country,
          },
          latitude: formData.latitude || null,
          longitude: formData.longitude || null,
          description: formData.description,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage(result.message);
        setFormData({
          name: '',
          contactNumber: '',
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
          },
          latitude: '',
          longitude: '',
          description: '',
        });
      } else {
        setErrorMessage(result.message || 'Failed to submit request.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while submitting the request.');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!foodDetails) return <p className="text-center text-gray-500">No details available for this item.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Food Item: {foodDetails.foodItems[0]?.name}</h1>
        <p className="text-xl text-gray-600 mb-12">Explore the details and request this item if you need it!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center bg-gray-100 rounded-lg shadow-lg p-8">
          <img
            src="https://via.placeholder.com/400x300" // Replace this with an actual image URL
            alt="Food Item"
            className="rounded-lg"
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Food Details</h2>
          <p className="text-gray-600 mb-2"><strong>Donor Name:</strong> {foodDetails.name}</p>
          <p className="text-gray-600 mb-2"><strong>Contact Number:</strong> {foodDetails.contactNumber}</p>
          <p className="text-gray-600 mb-2"><strong>Address:</strong> {foodDetails.address.street}, {foodDetails.address.city}, {foodDetails.address.state}, {foodDetails.address.postalCode}, {foodDetails.address.country}</p>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">Food Items</h3>
          {foodDetails.foodItems.map((item) => (
            <div key={item._id} className="mb-4">
              <p className="text-gray-600 mb-2"><strong>Name:</strong> {item.name}</p>
              <p className="text-gray-600 mb-2"><strong>Quantity:</strong> {item.quantity}</p>
              <p className="text-gray-600 mb-2"><strong>Unit:</strong> {item.unit}</p>
              <p className="text-gray-600 mb-2"><strong>Expiry Date:</strong> {new Date(item.expiryDate).toLocaleDateString()}</p>
            </div>
          ))}

          <p className="text-gray-600 mb-2"><strong>Available Until:</strong> {new Date(foodDetails.availableUntil).toLocaleDateString()}</p>

          {/* Gomaps.pro Integration */}
          {googleMapsUrl && (
            <div className="mt-4">
              <iframe
                src={googleMapsUrl}
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          )}
        </div>
      </div>

      {/* Request Button */}
      <div className="text-center mt-12">
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg"
          onClick={() => setShowRequestForm(!showRequestForm)}
        >
          {showRequestForm ? 'Cancel Request' : 'Request This Food'}
        </button>
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <form onSubmit={handleRequestSubmit} className="mt-6 bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Request Form</h3>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="border rounded w-full p-2 mb-4"
          />

          <input
            type="tel"
            name="contactNumber"
            placeholder="Your Contact Number"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            className="border rounded w-full p-2 mb-4"
          />

          <div className="mb-4">
            <label className="block mb-2">Location Method:</label>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="manual"
                  checked={locationMethod === 'manual'}
                  onChange={() => setLocationMethod('manual')}
                />
                <span className="ml-2">Manual Entry</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  value="auto"
                  checked={locationMethod === 'auto'}
                  onChange={() => setLocationMethod('auto')}
                />
                <span className="ml-2">Use My Location</span>
              </label>
            </div>
            <p className="text-gray-600">{locationStatus}</p>
          </div>

          {locationMethod === 'manual' && (
            <>
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={formData.address.street}
                onChange={handleInputChange}
                required
                className="border rounded w-full p-2 mb-4"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.address.city}
                onChange={handleInputChange}
                required
                className="border rounded w-full p-2 mb-4"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.address.state}
                onChange={handleInputChange}
                required
                className="border rounded w-full p-2 mb-4"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.address.postalCode}
                onChange={handleInputChange}
                required
                className="border rounded w-full p-2 mb-4"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.address.country}
                onChange={handleInputChange}
                required
                className="border rounded w-full p-2 mb-4"
              />
            </>
          )}

          <textarea
            name="description"
            placeholder="Additional Description (optional)"
            value={formData.description}
            onChange={handleInputChange}
            className="border rounded w-full p-2 mb-4"
          ></textarea>

          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg">
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};

export default FoodDetails;