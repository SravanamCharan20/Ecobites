import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../reducers/userSlice';
import axios from 'axios';
import { SyncLoader } from 'react-spinners'; 

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [username, setUsername] = useState(currentUser?.username || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setProfilePicture(null); 
    }
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('oldPassword', oldPassword);
    formData.append('newPassword', newPassword);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await axios.put('/api/auth/update', formData, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        dispatch(setUser({
          ...currentUser,
          profilePicture: response.data.user.profilePicture,
          username: response.data.user.username,
        }));
        setMessage('Profile updated successfully');
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-gray-800 text-center font-semibold my-11'>Update Profile</h1>
      <form onSubmit={handleUpdate} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Enter new username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='text-gray-900 p-4 rounded-md border-2 border-gray-300 focus:outline-none transition-all duration-300 ease-out'
          aria-label='Username'
          required
        />
        <input
          type='password'
          placeholder='Enter old password'
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className='text-gray-900 p-4 rounded-md border-2 border-gray-300 focus:outline-none transition-all duration-300 ease-out'
          aria-label='Old password'
          required
        />
        <input
          type='password'
          placeholder='Enter new password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className='text-gray-900 p-4 rounded-md border-2 border-gray-300 focus:outline-none transition-all duration-300 ease-out'
          aria-label='New password'
          required
        />
        <input
          type='file'
          accept='image/*'
          onChange={(e) => setProfilePicture(e.target.files[0])}
          className='text-gray-900 p-4 rounded-md border-2 border-gray-300 focus:outline-none transition-all duration-300 ease-out'
          aria-label='Profile Picture'
        />
        <button
          type='submit'
          disabled={loading}
          className='bg-gray-800 text-white p-4 mt-1 rounded-md uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? <SyncLoader size={6} color="#fff" /> : 'Update Profile'}
        </button>
      </form>
      {message && <p className='text-red-700 mt-5' aria-live='assertive'>{message}</p>}
    </div>
  );
};

export default UpdateProfile;