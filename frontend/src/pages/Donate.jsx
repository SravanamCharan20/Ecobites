import React, { useState } from 'react';

const DonorForm = () => {
  const initialFormData = {
    name: '',
    email: '',
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
    foodItems: [
      {
        type: 'Perishable',
        name: '',
        quantity: '',
        unit: 'kg',
        expiryDate: '',
      },
    ],
    availableUntil: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [locationMethod, setLocationMethod] = useState('manual'); // 'manual' or 'auto'
  const [locationStatus, setLocationStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
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

  // Handle location method selection
  const handleLocationMethodChange = (method) => {
    setLocationMethod(method);
    if (method === 'auto') {
      handleUseLocation();
    }
  };

  // Use the browser's geolocation API
  const handleUseLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus('Acquiring location...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            latitude,
            longitude,
          }));

          // Fetch address from Nominatim API
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data && data.address) {
              const { road, county, state, postcode, country } = data.address;
              setFormData((prevData) => ({
                ...prevData,
                address: {
                  street: road || '',
                  city: county || '',
                  state: state || '',
                  postalCode: postcode || '',
                  country: country || '',
                },
              }));
              setLocationStatus('Location acquired successfully!');
            } else {
              setLocationStatus('Failed to retrieve address.');
            }
          } catch (error) {
            console.error('Error fetching address:', error);
            setLocationStatus('Failed to acquire address.');
          }
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
    } else {
      setLocationStatus('Geolocation is not supported by this browser.');
    }
  };

  // Add a new food item
  const addFoodItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      foodItems: [
        ...prevData.foodItems,
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

  // Handle removing a food item
  const removeFoodItem = (index) => {
    setFormData((prevData) => {
      const updatedFoodItems = [...prevData.foodItems];
      updatedFoodItems.splice(index, 1); // Remove the item at the given index
      return {
        ...prevData,
        foodItems: updatedFoodItems,
      };
    });
  };

  // Handle food item changes
  const handleFoodItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedFoodItems = [...prevData.foodItems];
      updatedFoodItems[index] = {
        ...updatedFoodItems[index],
        [name]: value,
      };
      return {
        ...prevData,
        foodItems: updatedFoodItems,
      };
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.contactNumber || !formData.availableUntil) {
      return 'Please fill out all required fields.';
    }
    for (const item of formData.foodItems) {
      if (!item.name || !item.quantity || !item.expiryDate) {
        return 'Please fill out all food item fields.';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const res = await fetch('/api/donor/donorform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('Form submitted successfully!');
        setFormData(initialFormData);
      } else {
        setErrorMessage(data.message || 'Form submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('An error occurred while submitting the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Donor Form</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Personal Information */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="bg-gray-100 p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="bg-gray-100 p-2 rounded"
        />
        <input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className="bg-gray-100 p-2 rounded"
        />

        {/* Location Method Selection */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => handleLocationMethodChange('auto')}
            className={`p-2 rounded-lg ${locationMethod === 'auto' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Use Current Location
          </button>
          <button
            type="button"
            onClick={() => handleLocationMethodChange('manual')}
            className={`p-2 rounded-lg ${locationMethod === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Enter Address Manually
          </button>
        </div>

        {/* Address Fields */}
        {locationMethod === 'manual' && (
          <>
            <h3 className="text-lg font-medium mt-4">Address</h3>
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={formData.address.street}
              onChange={handleInputChange}
              className="bg-gray-100 p-2 rounded"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.address.city}
              onChange={handleInputChange}
              className="bg-gray-100 p-2 rounded"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.address.state}
              onChange={handleInputChange}
              className="bg-gray-100 p-2 rounded"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.address.postalCode}
              onChange={handleInputChange}
              className="bg-gray-100 p-2 rounded"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.address.country}
              onChange={handleInputChange}
              className="bg-gray-100 p-2 rounded"
            />
          </>
        )}

        {/* Location Status */}
        {locationMethod === 'auto' && locationStatus && (
          <p className="text-blue-500 mt-2">{locationStatus}</p>
        )}

        {/* Food Items */}
        <h3 className="text-lg font-medium mt-4">Food Items</h3>
        {formData.foodItems.map((item, index) => (
          <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
            <input
              type="text"
              name="name"
              placeholder="Food Name"
              value={item.name}
              onChange={(e) => handleFoodItemChange(index, e)}
              className="bg-gray-100 p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleFoodItemChange(index, e)}
              className="bg-gray-100 p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              name="unit"
              placeholder="Unit (e.g., kg)"
              value={item.unit}
              onChange={(e) => handleFoodItemChange(index, e)}
              className="bg-gray-100 p-2 rounded w-full mb-2"
            />
            <input
              type="date"
              name="expiryDate"
              placeholder="Expiry Date"
              value={item.expiryDate}
              onChange={(e) => handleFoodItemChange(index, e)}
              className="bg-gray-100 p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => removeFoodItem(index)}
              className="bg-red-500 mt-2 text-white p-2 rounded-lg"
            >
              Remove Food Item
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFoodItem}
          className="bg-slate-600 text-white p-2 rounded-lg"
        >
          Add Food Item
        </button>

        {/* Available Until */}
        <input
          type="date"
          name="availableUntil"
          placeholder="Available Until"
          value={formData.availableUntil}
          onChange={handleInputChange}
          className="bg-gray-100 p-2 rounded mt-4"
        />

        {/* Error and Success Messages */}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className={`mt-4 p-2 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default DonorForm;