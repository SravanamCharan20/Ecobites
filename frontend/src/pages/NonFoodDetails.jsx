import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const NonFoodDetails = () => {
  const { id } = useParams();
  const [nonFoodDetails, setNonFoodDetails] = useState(null);
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
      const response = await fetch('/api/donor/request-nonfood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorId: nonFoodDetails._id,
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
  if (!nonFoodDetails) return <p className="text-center text-gray-500">No details available for this item.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-96">
        <MapContainer center={[nonFoodDetails.location.latitude, nonFoodDetails.location.longitude]} zoom={13} scrollWheelZoom={false} className="h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[nonFoodDetails.location.latitude, nonFoodDetails.location.longitude]}>
            <Popup>{nonFoodDetails.name}</Popup>
          </Marker>
        </MapContainer>
      </div>
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Non-Food Donation Details</h1>
        <p className="text-xl text-gray-600 mb-2"><strong>Donor Name:</strong> {nonFoodDetails.name}</p>
        <p className="text-xl text-gray-600 mb-2"><strong>Contact Number:</strong> {nonFoodDetails.contactNumber}</p>
        <p className="text-xl text-gray-600 mb-2">
          <strong>Location:</strong> {nonFoodDetails.location ? `${nonFoodDetails.location.latitude}, ${nonFoodDetails.location.longitude}` : 'N/A'}
        </p>
        <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">Non-Food Items</h3>
        {nonFoodDetails.nonFoodItems && nonFoodDetails.nonFoodItems.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="text-gray-600 mb-2"><strong>Name:</strong> {item.name}</p>
            <p className="text-gray-600 mb-2"><strong>Type:</strong> {item.type}</p>
            <p className="text-gray-600 mb-2"><strong>Condition:</strong> {item.condition}</p>
            <p className="text-gray-600 mb-2"><strong>Quantity:</strong> {item.quantity}</p>
            <p className="text-gray-600 mb-2"><strong>Price:</strong> {item.price}</p>
          </div>
        ))}
        <p className="text-gray-600 mb-2"><strong>Available Until:</strong> {new Date(nonFoodDetails.availableUntil).toLocaleDateString()}</p>
        <div className="mt-6">
          <button
            className="border-2 border-teal-600 hover:bg-teal-600 text-gray-800 hover:text-white font-bold py-3 px-6 rounded-lg"
            onClick={() => setShowRequestForm(!showRequestForm)}
          >
            {showRequestForm ? 'Cancel Request' : 'Request This Item'}
          </button>
        </div>
        
        {showRequestForm && (
          <form onSubmit={handleRequestSubmit} className="mt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Request Form</h3>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />
            <input
              type="text"
              name="contactNumber"
              placeholder="Your Contact Number"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />
            <div className="flex mb-4">
              <div className="flex-grow mr-2">
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
              <div className="flex-grow mr-2">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
            </div>
            <div className="flex mb-4">
              <div className="flex-grow mr-2">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
              <div className="flex-grow mr-2">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.address.postalCode}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
            </div>
            <div className="flex mb-4">
              <div className="flex-grow mr-2">
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="border-2 border-teal-600 hover:bg-teal-600 text-gray-800 hover:text-white font-bold py-2 px-4 rounded-lg"
                >
                  Use My Location
                </button>
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  name="description"
                  placeholder="Additional Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Submit Request
            </button>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default NonFoodDetails;