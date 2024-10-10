import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';  // Import leaflet CSS

const NonFoodDetails = () => {
  const { id } = useParams();
  const [nonFoodDetails, setNonFoodDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    location: {
      latitude: '',
      longitude: '',
    },
    description: '',
  });
  const [locationStatus, setLocationStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchNonFoodDetails = async () => {
      try {
        const response = await fetch(`/api/donor/get-nondonor/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch non-food details.');
        }
        const data = await response.json();
        setNonFoodDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNonFoodDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/nonfood-requests/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nonFoodId: nonFoodDetails._id,
          name: formData.name,
          contactNumber: formData.contactNumber,
          location: formData.location,
          description: formData.description,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage(result.message);
        setFormData({
          name: '',
          contactNumber: '',
          location: {
            latitude: '',
            longitude: '',
          },
          description: '',
        });
      } else {
        setErrorMessage(result.message || 'Failed to submit request.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while submitting the request.');
    }
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus('Acquiring location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            location: {
              latitude,
              longitude,
            },
          }));
          setLocationStatus('Location acquired successfully!');
        },
        (error) => {
          console.error('Error obtaining location:', error);
          setLocationStatus('Failed to acquire location.');
        }
      );
    } else {
      setLocationStatus('Geolocation is not supported by this browser.');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!nonFoodDetails) return <p className="text-center text-gray-500">No details available for this item.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Non-Food Items:</h1>
        <ul className="text-xl text-gray-600">
          {nonFoodDetails.nonFoodItems.map((item) => (
            <li key={item._id} className="mb-2">{item.name}</li>
          ))}
        </ul>
        <p className="text-xl text-gray-600 mb-12">Explore the details and request any item if you need it!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex bg-cover bg-origin-content p-2 items-center rounded-lg shadow-sm border border-slate-200 transition-transform duration-300 hover:scale-105">
          <MapContainer
            center={[nonFoodDetails.location.latitude || 51.505, nonFoodDetails.location.longitude || -0.09]}
            zoom={13}
            style={{ height: '400px', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {nonFoodDetails.location.latitude && nonFoodDetails.location.longitude && (
              <Marker position={[nonFoodDetails.location.latitude, nonFoodDetails.location.longitude]}>
                <Popup>
                  Donor Location: {nonFoodDetails.location.city}, {nonFoodDetails.location.state}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        <div className="rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Non-Food Details</h2>
          <p className="text-gray-600 mb-2"><strong>Donor Name:</strong> {nonFoodDetails.name}</p>
          <p className="text-gray-600 mb-2"><strong>Contact Number:</strong> {nonFoodDetails.contactNumber}</p>
          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">Non-Food Items</h3>
          {nonFoodDetails.nonFoodItems.map((item) => (
            <div key={item._id} className="mb-4">
              <p className="text-gray-600 mb-2"><strong>Name:</strong> {item.name}</p>
              <p className="text-gray-600 mb-2"><strong>Condition:</strong> {item.condition}</p>
              <p className="text-gray-600 mb-2"><strong>Donation Type:</strong> {item.donationType}</p>
              <p className="text-gray-600 mb-2"><strong>Price:</strong> {item.donationType === 'free' || item.price === null ? 'Free' : item.price.toFixed(2)}</p>
            </div>
          ))}
          <p className="text-gray-600 mb-2"><strong>Available Until:</strong> {new Date(nonFoodDetails.availableUntil).toLocaleDateString()}</p>
          <div className="mt-6">
            <button
              className="border-2 border-teal-600 hover:bg-teal-600 text-gray-800 hover:text-white font-bold py-3 px-6 rounded-lg"
              onClick={() => setShowRequestForm(!showRequestForm)}
            >
              {showRequestForm ? 'Cancel Request' : 'Request Non-Food Item'}
            </button>
          </div>

          {showRequestForm && (
            <form onSubmit={handleRequestSubmit} className="mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Request Form</h3>
              {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
              {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">Your Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 p-2 w-full rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="contactNumber">Contact Number:</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 p-2 w-full rounded-lg"
                />
              </div>

              <h4 className="font-bold text-gray-800 mb-2">Location:</h4>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  placeholder="Latitude"
                  name="latitude"
                  value={formData.location.latitude}
                  onChange={(e) => setFormData(prevData => ({
                    ...prevData,
                    location: {
                      ...prevData.location,
                      latitude: e.target.value,
                    }
                  }))}
                  className="border border-gray-300 p-2 rounded-lg mr-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  name="longitude"
                  value={formData.location.longitude}
                  onChange={(e) => setFormData(prevData => ({
                    ...prevData,
                    location: {
                      ...prevData.location,
                      longitude: e.target.value,
                    }
                  }))}
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>

              <button
                type="button"
                className="border-2 border-blue-600 hover:bg-blue-600 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-lg"
                onClick={handleUseLocation}
              >
                Use My Current Location
              </button>
              <p className="text-gray-500 mt-2">{locationStatus}</p>

              <div className="mb-4 mt-4">
                <label className="block text-gray-700 mb-2" htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="border border-gray-300 p-2 w-full rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-teal-600 text-white font-bold py-3 px-6 rounded-lg"
              >
                Submit Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NonFoodDetails;