// src/profile.jsx
import { useState } from 'react';
import { useAuth } from './AuthContext'; // Assuming your Auth context provides user data

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file)); // Show selected image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !address || !bio) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, bio, profilePicture }),
      });

      const result = await response.json();

      if (response.ok) {
        updateUser({ name, address, bio, profilePicture });
        setSuccessMessage('Your profile has been updated successfully');
        setError('');
      } else {
        setError(result.message || 'Failed to update profile');
        setSuccessMessage('');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="profile-container flex justify-center items-center min-h-screen bg-blue-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {profilePicture && <img src={profilePicture} alt="Profile" width="100" />}
          </div>

          <div className="form-group mb-4">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="form-group mb-4">
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="form-group mb-6">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short bio"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
