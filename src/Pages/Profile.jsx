import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

function Profile({ user, onLogout, onUpdateUser }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!user) {
      alert('Access denied. Please log in first.');
      navigate('/login');
      return;
    }

    fetch(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Profile fetch failed');
        setName(data.name || '');
        setAddress(data.address || '');
        setPhone(data.phone || '');
      })
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
        alert(err.message || 'Unable to load profile.');
      });
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ name, address, phone }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Profile update failed');
        onUpdateUser({ name, address, phone });
        alert('Profile saved successfully!');
      })
      .catch((err) => {
        console.error('Error saving profile:', err);
        alert(err.message || 'Unable to save profile.');
      });
  };

  const handleLogoutClick = () => {
    onLogout();
    alert('Logged out successfully.');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mb-8">
        <Link to="/" className="hover:text-indigo-650 dark:hover:text-indigo-400 text-decoration-none">
          Home
        </Link>
        <i className="bi bi-chevron-right text-[9px]"></i>
        <span className="text-slate-800 dark:text-slate-350 font-bold">Profile</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info card */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm text-center bg-white dark:bg-slate-900/20">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-orange-500 mx-auto flex items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-4">
                <i className="bi bi-person"></i>
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-1">
                {name || 'Guest User'}
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-5 truncate max-w-[200px] mx-auto">
                {user.email}
              </p>

              <button
                onClick={handleLogoutClick}
                className="w-full btn bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-650 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/10 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-colors duration-200"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Settings Profile details Form */}
          <div className="md:col-span-2">
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm bg-white dark:bg-slate-900/20">
              <h2 className="text-base font-extrabold text-slate-855 dark:text-white mb-6 uppercase tracking-wider">
                Profile Settings
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="profile-name"
                    className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="profile-name"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="profile-address"
                    className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                  >
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    id="profile-address"
                    required
                    placeholder="123 Premium Lane"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="profile-phone"
                    className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="profile-phone"
                    required
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 glow-button cursor-pointer"
                >
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
