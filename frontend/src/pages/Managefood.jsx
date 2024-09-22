import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const ManageFood = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [currentDonor, setCurrentDonor] = useState({});
  const [locationMethod, setLocationMethod] = useState('manual');
  const [locationStatus, setLocationStatus] = useState('');
  const [dropdown, setDropdown] = useState(null);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No Donations found');
          setLoading(false);
          return;
        }

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        const { id: userId } = JSON.parse(jsonPayload);

        const response = await fetch(`/api/donor/userdonations/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Filter donations based on name search
  const filteredDonations = donations.filter(donation =>
    donation.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleDropdownToggle = (dropdownName) => {
    setDropdown(dropdown === dropdownName ? null : dropdownName);
  };

  const fetchLocation = async (latitude, longitude) => {
    setLocationStatus('Fetching address...');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      if (data && data.address) {
        const { road, county, state, postcode, country } = data.address;
        setCurrentDonor(prevDonor => ({
          ...prevDonor,
          address: {
            street: road || '',
            city: county || '',
            state: state || '',
            postalCode: postcode || '',
            country: country || '',
          },
        }));
        setLocationStatus('Location fetched successfully!');
      } else {
        setLocationStatus('Failed to retrieve address.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setLocationStatus('Failed to acquire address.');
    }
  };

  const handleEditClick = (donor) => {
    setEditMode(donor._id);
    setCurrentDonor(donor);
    if (donor.latitude && donor.longitude) {
      fetchLocation(donor.latitude, donor.longitude);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/donor/${currentDonor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentDonor),
      });
      if (response.ok) {
        const updatedDonor = await response.json();
        setDonations(donations.map(d => d._id === currentDonor._id ? updatedDonor : d));
        setEditMode(null);
      } else {
        throw new Error('Failed to update donation.');
      }
    } catch (error) {
      setError('Failed to update donation.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDonor(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLocationMethodChange = (method) => {
    setLocationMethod(method);
    if (method === 'auto' && navigator.geolocation) {
      setLocationStatus('Acquiring location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentDonor(prevDonor => ({
            ...prevDonor,
            latitude,
            longitude,
          }));
          fetchLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error obtaining location:', error);
          setLocationStatus('Failed to acquire location.');
        },
        {
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  const handleFoodItemChange = (index, e) => {
    const { name, value } = e.target;
    setCurrentDonor(prevDonor => {
      const updatedFoodItems = [...prevDonor.foodItems];
      updatedFoodItems[index] = {
        ...updatedFoodItems[index],
        [name]: value,
      };
      return {
        ...prevDonor,
        foodItems: updatedFoodItems,
      };
    });
  };

  const addFoodItem = () => {
    setCurrentDonor(prevDonor => ({
      ...prevDonor,
      foodItems: [
        ...prevDonor.foodItems,
        {
          type: 'Perishable',
          name: '',
          quantity: '',
          unit: 'kg',
          expiryDate: '',
        },
      ],
    }));
  };

  const removeFoodItem = (index) => {
    setCurrentDonor(prevDonor => {
      const updatedFoodItems = [...prevDonor.foodItems];
      updatedFoodItems.splice(index, 1);
      return {
        ...prevDonor,
        foodItems: updatedFoodItems,
      };
    });
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl text-gray-800 font-semibold mb-4">Manage Donations</h1>

        <div className="flex items-center border-2 mb-3 rounded-full w-auto p-2">
          <FiSearch className="mr-2" />
          <input
            type="text"
            placeholder="Search By Donor Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="outline-none w-full"
          />
        </div>

        {filteredDonations.length === 0 ? (
          <p className='text-red-500 ml-2'>No donations found.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4">
            {filteredDonations.map((donation) => (
              <li key={donation._id} className="border p-4 mb-4 rounded">
                {editMode === donation._id ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={currentDonor.name}
                      onChange={handleChange}
                      className="border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2 mb-2 w-full"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={currentDonor.email}
                      onChange={handleChange}
                      className="border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2 mb-2 w-full"
                    />
                    <input
                      type="tel"
                      name="contactNumber"
                      placeholder="Contact Number"
                      value={currentDonor.contactNumber}
                      onChange={handleChange}
                      className="border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2 mb-2 w-full"
                    />

                    <div className="flex gap-4 mb-2">
                      <button
                        type="button"
                        onClick={() => handleLocationMethodChange('manual')}
                        className={`border-2 rounded-md p-2 ${locationMethod === 'manual' ? 'bg-teal-500 text-white' : 'bg-white text-black'}`}
                      >
                        Manual Location
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLocationMethodChange('auto')}
                        className={`border-2 rounded-md p-2 ${locationMethod === 'auto' ? 'bg-teal-500 text-white' : 'bg-white text-black'}`}
                      >
                        Auto Location
                      </button>
                    </div>
                    {locationStatus && <p>{locationStatus}</p>}
                    <input
                      type="text"
                      name="address.street"
                      placeholder="Street Address"
                      value={currentDonor.address?.street || ''}
                      onChange={handleChange}
                      className="border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2 mb-2 w-full"
                    />
                    <input
                      type="text"
                      name="address.city"
                      placeholder="City"
                      value={currentDonor.address?.city || ''}
                      onChange={handleChange}
                      className="border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2 mb-2 w-full"
                    />
                    <input
                      type="text"
                      name="address.state"
                      placeholder="State"
                      value={currentDonor.address?.state || ''}
                      onChange={handleChange}
                      className="border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2 mb-2 w-full"
                    />
                    <input
                      type="text"
                      name="address.postalCode"
                      placeholder="Postal Code"
                      value={currentDonor.address?.postalCode || ''}
                      onChange={handleChange}
                      className="border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2 mb-2 w-full"
                    />
                    <input
                      type="text"
                      name="address.country"
                      placeholder="Country"
                      value={currentDonor.address?.country || ''}
                      onChange={handleChange}
                      className="border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2 mb-2 w-full"
                    />

                    <h2 className='text-lg mt-4'>Food Items:</h2>
                    {currentDonor.foodItems.map((item, index) => (
                      <div key={index} className="border-b border-gray-300 pb-2 mb-2">
                        <input
                          type="text"
                          name="name"
                          placeholder="Food Item Name"
                          value={item.name}
                          onChange={(e) => handleFoodItemChange(index, e)}
                          className="border-2 border-teal-600 p-3 rounded mb-2 w-full"
                        />
                        <input
                          type="number"
                          name="quantity"
                          placeholder="Quantity"
                          value={item.quantity}
                          onChange={(e) => handleFoodItemChange(index, e)}
                          className="border-2 border-teal-600 p-3 rounded mb-2 w-full"
                        />
                        <input
                          type="text"
                          name="unit"
                          placeholder="Unit"
                          value={item.unit}
                          onChange={(e) => handleFoodItemChange(index, e)}
                          className="border-2 border-teal-600 p-3 rounded mb-2 w-full"
                        />
                        <input
                          type="date"
                          name="expiryDate"
                          value={item.expiryDate}
                          onChange={(e) => handleFoodItemChange(index, e)}
                          className="border-2 border-teal-600 p-3 rounded mb-2 w-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeFoodItem(index)}
                          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2"
                        >
                          Remove Food Item
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFoodItem}
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2"
                    >
                      Add Food Item
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2"
                    >
                      Save
                    </button>
                  </form>
                ) : (
                  <>
                    <p className='text-black mt-1'><strong>Name:</strong> {donation.name}</p>
                    <p className='text-black mt-1'><strong>Email:</strong> {donation.email}</p>
                    <p className='text-black mt-1'><strong>Contact Number:</strong> {donation.contactNumber}</p>
                    <p className='text-black mt-1'><strong>Address:</strong> {donation.address?.street}, {donation.address?.city}, {donation.address?.state}, {donation.address?.postalCode}, {donation.address?.country}</p>
                    <p className='text-black mt-1'><strong>Available Until:</strong> {donation.availableUntil}</p>
                    
                    <h1 className='font-serif mt-4 border-t-2 text-lg text-black'>Food Items:</h1>
                    <div className="flex flex-col space-y-2">
                      {donation.foodItems.map((item, index) => (
                        <div key={index} className="border-b border-gray-300 pb-2 mb-2">
                          <p className='text-black mt-1'><strong>Food Item Name:</strong> {item.name}</p>
                          <p className='text-black mt-1'><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
                          <p className='text-black mt-1'><strong>Expiry Date:</strong> {item.expiryDate}</p>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleEditClick(donation)}
                      className="bg-yellow-500 text-black py-2 px-4 rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 mt-2"
                    >
                      Edit
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageFood;