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
    <div className="p-8 max-w-7xl mx-auto rounded-lg text-gray-800">
      <h1 className="text-4xl text-gray-800 font-bold mb-2 text-center">Available Food List</h1>
      {locationError ? (
        <p className="text-center text-red-500">{locationError}</p>
      ) : userLocation ? (
        <p className="text-center text-gray-800 opacity-50">Location acquired successfully.</p>
      ) : (
        <p className="text-center text-gray-800">Fetching your location...</p>
      )}
      {loading && <p className="text-center text-gray-800 opacity-50">Loading food items...</p>}
      {loadingDistances && !loading && <p className="text-center text-gray-800 opacity-50">Calculating distances...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {sortedFoodItems.length === 0 && !loading && !loadingDistances && (
        <p className="text-center text-gray-800">No donated food items available.</p>
      )}

      {/* Professional Table format for food items */}
      {sortedFoodItems.length > 0 && (
       <table id="target-section" className="min-w-full border-collapse rounded-lg overflow-hidden">
       <thead>
         <tr className="bg-teal-800 text-white text-left rounded-t-lg">
           <th className="px-4 py-3 border-b-2 border-gray-300">Donor</th>
           <th className="px-4 py-3 border-b-2 border-gray-300">Food Items</th>
           <th className="px-4 py-3 border-b-2 border-gray-300">Expiry Date</th>
           <th className="px-4 py-3 border-b-2 border-gray-300">Distance (km)</th>
           <th className="px-4 py-3 border-b-2 border-gray-300">Address</th>
           <th className="px-4 py-3 border-b-2 border-gray-300 rounded-tr-lg">Actions</th>
         </tr>
       </thead>
       <tbody>
         {sortedFoodItems.map((item, index) => (
           <tr
             key={item._id}
             className={`border-t border-gray-300 ${index === sortedFoodItems.length - 1 ? 'rounded-b-lg' : ''}`}
           >
             <td className="px-4 py-4">{item.name}</td>
             <td className="px-4 py-4">
               <ul>
                 {item.foodItems.map((food, i) => (
                   <li key={i}>{food.name}</li>
                 ))}
               </ul>
             </td>
             <td className="px-4 py-4">{formatDate(item.foodItems[0].expiryDate)}</td>
             <td className="px-4 py-4">{item.distance ? item.distance.toFixed(2) : 'N/A'}</td>
             <td className="px-4 py-4">{formatFullAddress(item.address)}</td>
             <td className="px-4 py-4">
               <button
                 onClick={() => handleViewDetails(item._id)}
                 className="bg-gray-800 text-white p-3 rounded-full hover:bg-teal-600 transition duration-300"
               >
                 View Details
               </button>
             </td>
           </tr>
         ))}
       </tbody>
     </table>
      )}
    </div>
  );
};

export default AvailableFoodList;