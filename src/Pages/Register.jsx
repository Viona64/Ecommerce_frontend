import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        alert('Account created successfully! Please log in.');
        navigate('/login');
      })
      .catch((err) => {
        console.error('Error registering user:', err);
        alert(err.message || 'Unable to create account.');
      });
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center fade-in-section">
      <div className="glass-panel p-8 rounded-[32px] border border-slate-205 dark:border-slate-800 shadow-2xl w-full max-w-md bg-white dark:bg-slate-900/20">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1.5 text-center">
          Create Account
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 text-center font-medium">
          Register to start ordering elite tech products
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="reg-name"
              className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
            >
              Full Name
            </label>
            <input
              type="text"
              id="reg-name"
              placeholder="John Doe"
              required
              minLength={3}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="reg-email"
              className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
            >
              Email Address
            </label>
            <input
              type="email"
              id="reg-email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="reg-password"
              className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
            >
              Password
            </label>
            <input
              type="password"
              id="reg-password"
              placeholder="••••••••"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full btn bg-indigo-655 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 glow-button flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-5 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Already have an account?{' '}
          </span>
          <Link
            to="/login"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-705 dark:hover:text-indigo-305 font-bold text-decoration-none"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
