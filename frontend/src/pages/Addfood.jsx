import React, { useState } from 'react';

const AddFood = () => {
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
    location: {
      latitude: '',
      longitude: '',
    },
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
  const [locationMethod, setLocationMethod] = useState('manual');
  const [locationStatus, setLocationStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuccessMessage('');  // Clear success message
    setErrorMessage('');    // Clear error message
    setLocationStatus('');  // Clear location status

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

  const handleLocationMethodChange = (method) => {
    setLocationMethod(method);
    if (method === 'auto') {
      handleUseLocation();
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

  const removeFoodItem = (index) => {
    setFormData((prevData) => {
      const updatedFoodItems = [...prevData.foodItems];
      updatedFoodItems.splice(index, 1);
      return {
        ...prevData,
        foodItems: updatedFoodItems,
      };
    });
  };

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
    if (locationMethod === 'auto' && (!formData.location.latitude || !formData.location.longitude)) {
      return 'Please wait until the location is acquired.';
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-6 max-w-4xl w-full text-gray-800 rounded-lg grid grid-cols-2 gap-4">
        <h1 className="col-span-2 text-3xl text-gray-800 font-semibold mb-6 text-center">Donor Form</h1>
        
        {/* Personal Information */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2"
        />
        <input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className="col-span-2 border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2"
        />

        {/* Location Method Selection */}
        <div className="col-span-2 flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => handleLocationMethodChange('auto')}
            className={`p-3 rounded-full ${locationMethod === 'auto' ? 'bg-teal-600 text-white border-2' : 'border-2 text-black'}`}
          >
            Use Current Location
          </button>
          <button
            type="button"
            onClick={() => handleLocationMethodChange('manual')}
            className={`p-3 rounded-full ${locationMethod === 'manual' ? 'bg-teal-600 text-white border-2' : 'border-2 text-black'}`}
          >
            Enter Address Manually
          </button>
        </div>

        {/* Address Fields */}
        {locationMethod === 'manual' && (
          <>
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={formData.address.street}
              onChange={handleInputChange}
              className="col-span-2 border-2 border-teal-600 p-3 rounded text-gray-800 focus:outline-none focus:ring-2"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.address.city}
              onChange={handleInputChange}
              className="border-2 border-teal-600 p-3 rounded text-gray-800 focus:outline-none focus:ring-2"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.address.state}
              onChange={handleInputChange}
              className="border-2 border-teal-600 p-3 rounded text-gray-800 focus:outline-none focus:ring-2"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.address.postalCode}
              onChange={handleInputChange}
              className="border-2 border-teal-600 p-3 rounded text-gray-800 focus:outline-none focus:ring-2"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.address.country}
              onChange={handleInputChange}
              className="border-2 border-teal-600 p-3 rounded text-gray-800 focus:outline-none focus:ring-2"
            />
          </>
        )}

        {locationMethod === 'auto' && (
          <>
            <p className="text-sm col-span-2">{locationStatus}</p>
          </>
        )}

        {/* Food Items Section */}
        <div className="col-span-2">
          {formData.foodItems.map((item, index) => (
            <div key={index} className="p-4 mb-4 rounded-lg border-2 border-teal-600">
              <h3 className="mb-2 text-lg font-semibold">Food Item {index + 1}</h3>
              <input
                type="text"
                name="name"
                placeholder="Food Name"
                value={item.name}
                onChange={(e) => handleFoodItemChange(index, e)}
                className="p-3 border-2 border-teal-600 rounded w-full mb-2 text-gray-800 focus:outline-none focus:ring-2"
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleFoodItemChange(index, e)}
                  className="p-3 border-2 border-teal-600 rounded w-full mb-2 text-gray-800 focus:outline-none focus:ring-2"
                />
                <select
                  name="unit"
                  value={item.unit}
                  onChange={(e) => handleFoodItemChange(index, e)}
                  className="p-3 border-2 border-teal-600 rounded w-full mb-2 text-gray-800 focus:outline-none focus:ring-2"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="liters">liters</option>
                  <option value="ml">ml</option>
                  <option value="pieces">pieces</option>
                </select>
              </div>
              <input
                type="date"
                name="expiryDate"
                placeholder="Expiry Date"
                value={item.expiryDate}
                onChange={(e) => handleFoodItemChange(index, e)}
                className="p-3 border-2 border-teal-600 rounded w-full mb-2 text-gray-800 focus:outline-none focus:ring-2"
              />
              <button
                type="button"
                onClick={() => removeFoodItem(index)}
                className="mt-4 bg-red-600 border-2 text-white py-2 px-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="col-span-2 flex justify-center">
          <button
            type="button"
            onClick={addFoodItem}
            className="bg-teal-600 align-middle text-white py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2"
          >
            Add Another Food Item
          </button>
        </div>

        {/* Availability Date */}
        <input
          type="date"
          name="availableUntil"
          placeholder="Available Until"
          value={formData.availableUntil}
          onChange={handleInputChange}
          className="col-span-2 border-2 border-teal-600 p-3 rounded text-black focus:outline-none focus:ring-2"
        />
        
        {/* Messages */}
        {successMessage && <p className="col-span-2 text-teal-800 mt-4">{successMessage}</p>}
        {errorMessage && <p className="col-span-2 text-red-500 mt-4">{errorMessage}</p>}
        
        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="col-span-2 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default AddFood;