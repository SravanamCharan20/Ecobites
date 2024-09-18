import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        // Navigate to the sign-in page on successful sign-up
        navigate('/signin');
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className='p-4 max-w-lg mx-auto'>
      <h1 className='text-3xl text-gray-200 text-center font-semibold mb-6'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Username'
          id='username'
          className='bg-slate-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dff35d] transition-all duration-300 ease-in-out'
          onChange={handleChange}
          required
          aria-label='Username'
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dff35d] transition-all duration-300 ease-in-out'
          onChange={handleChange}
          required
          aria-label='Email'
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dff35d] transition-all duration-300 ease-in-out'
          onChange={handleChange}
          required
          aria-label='Password'
        />
        <button
          disabled={loading}
          className='bg-[#dff35d] text-black p-3 rounded-lg uppercase hover:bg-[#c0e050] disabled:opacity-80 transition-all duration-300 ease-in-out'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p className='text-gray-200'>Already have an account?</p>
        <Link to='/signin'>
          <span className='text-[#dff35d] hover:underline'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-700 mt-5' aria-live='assertive'>{error}</p>}
    </div>
  );
}