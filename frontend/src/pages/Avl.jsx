import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AvailableFoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [sortedFoodItems, setSortedFoodItems] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDistances, setLoadingDistances] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const navigate = useNavigate();

  // Other unchanged functions...

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getCoordinatesFromAddress = async (address) => {
    if (!address || !address.city || !address.state || !address.country) {
      console.error('Incomplete address:', address);
      return null;
    }

    const query = `${address.street ? address.street + ' ' : ''}${address.city} ${address.state} ${address.country}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        console.warn('No coordinates found for query:', query);
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError('');
        },
        (error) => {
          console.error('Error getting user location:', error);
          setLocationError('Failed to get user location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

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

  const calculateAndSortFoodItems = async () => {
    if (!userLocation || foodItems.length === 0) return;

    setLoadingDistances(true);

    const currentDate = new Date();

    const sortedItems = await Promise.all(
      foodItems.map(async (item) => {
        let itemCoords;

        if (item.address.latitude && item.address.longitude) {
          itemCoords = { lat: item.address.latitude, lon: item.address.longitude };
        } else {
          itemCoords = await getCoordinatesFromAddress(item.address);
        }

        if (!itemCoords) return null;

        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          itemCoords.lat,
          itemCoords.lon
        );

        const validFoodItems = item.foodItems.filter(food => new Date(food.expiryDate) >= currentDate);

        if (validFoodItems.length === 0) return null;

        return { ...item, distance, foodItems: validFoodItems };
      })
    );

    const sorted = sortedItems
      .filter(item => item !== null)
      .sort((a, b) => {
        const expiryA = new Date(a.foodItems[0].expiryDate);
        const expiryB = new Date(b.foodItems[0].expiryDate);
        return expiryA - expiryB;
      });

    setSortedFoodItems(sorted);
    setLoadingDistances(false);
  };

  useEffect(() => {
    fetchFoodItems();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation && foodItems.length > 0) {
      calculateAndSortFoodItems();
    }
  }, [userLocation, foodItems]);

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
    <div className="p-8 max-w-7xl mx-auto rounded-lg text-white bg-[rgba(13,13,13)]">
      <h1 className="text-4xl text-[#dff35d] font-bold mb-6 text-center">Available Food List</h1>
      {locationError ? (
        <p className="text-center text-red-500">{locationError}</p>
      ) : userLocation ? (
        <p className="text-center text-[#effaa2] opacity-50 p-3">Location acquired successfully.</p>
      ) : (
        <p className="text-center text-[#effaa2]">Fetching your location...</p>
      )}
      {loading && <p className="text-center text-[#effaa2] opacity-50">Loading food items...</p>}
      {loadingDistances && !loading && <p className="text-center text-[#effaa2] opacity-50">Calculating distances...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {sortedFoodItems.length === 0 && !loading && !loadingDistances && (
        <p className="text-center text-[#effaa2]">No donated food items available.</p>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {sortedFoodItems.map((item, index) => (
          <div
            key={item._id}
            className="bg-black-400 text-white border-2 border-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <h2 className="text-xl font-bold mb-2">Donor: {item.name}</h2>
            <p className="mb-2">Food Items:</p>
            <ul className="list-disc ml-5 mb-2">
              {item.foodItems.map((food, i) => (
                <li key={i}>
                  {food.name} (Expiry: {formatDate(food.expiryDate)})
                </li>
              ))}
            </ul>
            <p className="mb-2">Full Address: {formatFullAddress(item.address)}</p>
            <p className="mb-2">Distance: {item.distance ? item.distance.toFixed(2) : 'N/A'} km</p>
            <p className="mb-2">Expiry Date: {formatDate(item.foodItems[0].expiryDate)}</p>
            <p className="mb-2">Creation Date: {formatDate(item.createdAt)}</p>
            <button
              onClick={() => handleViewDetails(item._id)}
              className="bg-[#dff35d] text-black py-2 px-4 rounded-full hover:bg-[#e4ff32] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableFoodList;