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

  // Function to calculate distances and filter/sort by expiry date
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
        // Sort by the nearest expiry date
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
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Food List</h1>
      {locationError ? (
        <p className="text-center text-red-500">{locationError}</p>
      ) : userLocation ? (
        <p className="text-center">Location acquired successfully.</p>
      ) : (
        <p className="text-center">Fetching your location...</p>
      )}
      {loading && <p className="text-center text-gray-500">Loading food items...</p>}
      {loadingDistances && !loading && <p className="text-center text-gray-500">Calculating distances...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {sortedFoodItems.length === 0 && !loading && !loadingDistances && (
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
              <th className="py-3 px-6 text-left border-b-2 border-gray-200 bg-gray-100">Distance (km)</th>
              <th className="py-3 px-6 text-left border-b-2 border-gray-200 bg-gray-100">Expiry Date</th>
              <th className="py-3 px-6 text-left border-b-2 border-gray-200 bg-gray-100">Creation Date</th>
              <th className="py-3 px-6 text-left border-b-2 border-gray-200 bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFoodItems.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="py-3 px-6 border-b text-left">{index + 1}</td>
                <td className="py-3 px-6 border-b text-left">{item.name}</td>
                <td className="py-3 px-6 border-b text-left">
                  {item.foodItems.map((food, i) => (
                    <div key={i}>
                      {food.name} (Expiry: {formatDate(food.expiryDate)})
                    </div>
                  ))}
                </td>
                <td className="py-3 px-6 border-b text-left">{formatFullAddress(item.address)}</td>
                <td className="py-3 px-6 border-b text-left">{item.distance ? item.distance.toFixed(2) : 'N/A'}</td>
                <td className="py-3 px-6 border-b text-left">
                  {formatDate(item.foodItems[0].expiryDate)}
                </td>
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