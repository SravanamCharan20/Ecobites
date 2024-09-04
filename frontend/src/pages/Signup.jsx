// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationUsed, setLocationUsed] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [locationMethod, setLocationMethod] = useState('auto');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus('Acquiring location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({ ...formData, latitude, longitude });
          setLocationUsed(true); 
          setLocationStatus('Location acquired successfully!');
          setLocationMethod('auto');
        },
        (error) => {
          console.error("Error obtaining location:", error);
          setError(true);
          setLocationStatus('Failed to acquire location.');
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError(true);
      setLocationStatus('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate('/signin');
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Username'
          id='username'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <div className='flex gap-4 mb-4'>
          <button
            type='button'
            onClick={() => setLocationMethod('auto')}
            className={`p-2 rounded-lg ${locationMethod === 'auto' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Use Current Location
          </button>
          <button
            type='button'
            onClick={() => setLocationMethod('manual')}
            className={`p-2 rounded-lg ${locationMethod === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Enter Manually
          </button>
        </div>

        {/* Conditionally render City and State Inputs */}
        {locationMethod === 'manual' && !locationUsed && (
          <>
            <input
              type='text'
              placeholder='City'
              id='city'
              className='bg-slate-100 p-3 rounded-lg'
              onChange={handleChange}
            />
            <input
              type='text'
              placeholder='State'
              id='state'
              className='bg-slate-100 p-3 rounded-lg'
              onChange={handleChange}
            />
          </>
        )}

        {/* Conditionally render Use Location Button */}
        {locationMethod === 'auto' && !locationUsed && (
          <button
            type='button'
            onClick={handleUseLocation}
            className='bg-blue-500 text-white p-2 rounded-lg mt-2'
          >
            Use Location
          </button>
        )}

        {/* Location Status Message */}
        {locationStatus && (
          <p className='text-blue-500 mt-2'>{locationStatus}</p>
        )}

        {/* Submit Button */}
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/signin'>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-700 mt-5'>Something went wrong!</p>}
    </div>
  );
}