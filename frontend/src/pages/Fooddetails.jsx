import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';  // Import leaflet CSS

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
    location: {
      latitude: '',
      longitude: '',
    },
    description: '',
  });
  const [locationMethod, setLocationMethod] = useState('manual');
  const [locationStatus, setLocationStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await fetch(`/api/donor/get-donor/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch food details.');
        }
        const data = await response.json();
        setFoodDetails(data);
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
          address: formData.address,
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
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
          },
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
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            location: {
              latitude,
              longitude,
            },
          }));
          setLocationStatus('Location acquired successfully!');

          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data && data.address) {
              setFormData((prevData) => ({
                ...prevData,
                address: {
                  street: data.address.road || '',
                  city: data.address.city || data.address.town || data.address.village || '',
                  state: data.address.state || '',
                  postalCode: data.address.postcode || '',
                  country: data.address.country || '',
                },
              }));
            }
          } catch (error) {
            console.error('Error fetching address:', error);
          }
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
  if (!foodDetails) return <p className="text-center text-gray-500">No details available for this item.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Food Items:</h1>
        <ul className="text-xl text-gray-600">
          {foodDetails.foodItems.map((item, index) => (
            <li key={index} className="mb-2">{item.name}</li> 
          ))}
        </ul>
        <p className="text-xl text-gray-600 mb-12">Explore the details and request any item if you need it!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex bg-cover bg-origin-content p-2 items-center rounded-lg shadow-sm border border-slate-200 transition-transform duration-300 hover:scale-105">
          <MapContainer
            center={[foodDetails.location.latitude || 51.505, foodDetails.location.longitude || -0.09]}
            zoom={13}
            style={{ height: '400px', width: '100%', borderRadius: '8px' }} 
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {foodDetails.location.latitude && foodDetails.location.longitude && (
              <Marker position={[foodDetails.location.latitude, foodDetails.location.longitude]}>
                <Popup>
                  Donor Location: {foodDetails.location.city}, {foodDetails.location.state}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        <div className="rounded-lg shadow-sm border border-slate-200 p-6">
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
          <div className="mt-6">
            <button
              className="border-2 border-teal-600 hover:bg-teal-600 text-gray-800 hover:text-white font-bold py-3 px-6 rounded-lg"
              onClick={() => setShowRequestForm(!showRequestForm)}
            >
              {showRequestForm ? 'Cancel Request' : 'Request This Food'}
            </button>
          </div>

        </div>
      </div>

      {showRequestForm && (
        <div className="flex justify-center items-center min-h-screen">
        <form onSubmit={handleRequestSubmit} className="p-3 w-1/2 align-middle rounded-lg">
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
            className="border-2 rounded-full border-teal-600 w-full p-2 mb-4"
          />
      
          <input
            type="tel"
            name="contactNumber"
            placeholder="Your Contact Number"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            className="border-2 rounded-full border-teal-600 w-full p-2 mb-4"
          />
      
          <div className="mb-4">
            <label className="block mb-2">Location Method:</label>
            <div className="flex gap-4 mb-2">
              <button
                type="button"
                onClick={() => setLocationMethod('manual')}
                className={`p-3 rounded-full ${locationMethod === 'manual' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
              >
                Manual Entry
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocationMethod('auto');
                  handleUseLocation();
                }}
                className={`p-3 rounded-full ${locationMethod === 'auto' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
              >
                Use My Location
              </button>
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
                className="border-2 rounded-full border-teal-600 w-full p-2 mb-4"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.address.city}
                onChange={handleInputChange}
                required
                className="border-2 rounded-full border-teal-600 w-full p-2 mb-4"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.address.state}
                onChange={handleInputChange}
                required
                className="border-2 rounded-full border-teal-600 w-full p-2 mb-4"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.address.postalCode}
                onChange={handleInputChange}
                required
                className="border-2 rounded-full border-teal-600 w-full p-2 mb-4"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.address.country}
                onChange={handleInputChange}
                required
                className="border-2 rounded-full border-teal-600 w-full p-2 mb-4"
              />
            </>
          )}
      
          <textarea
            name="description"
            placeholder="Additional Description (optional)"
            value={formData.description}
            onChange={handleInputChange}
            className="border-2 rounded-lg border-teal-600 w-full p-2 mb-4"
          ></textarea>
      
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg">
            Submit Request
          </button>
        </form>
      </div>
      )}
    </div>
  );
};

export default FoodDetails;