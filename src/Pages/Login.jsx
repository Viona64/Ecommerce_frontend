import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

function Login({ onLoginSuccess }) {
  const [usernameEmail, setUsernameEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    const emailValue = usernameEmail.trim();
    const passwordValue = password;

    if (!emailValue.includes('@')) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (passwordValue.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailValue, password: passwordValue }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Login failed');
          onLoginSuccess({ ...data.user, token: data.token });
          alert('Logged in successfully!');
          navigate('/profile');
        })
        .catch((err) => {
          console.error('Error logging in:', err);
          alert(err.message || 'Unable to log in.');
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center fade-in-section">
      <div className="glass-panel p-8 rounded-[32px] border border-slate-205 dark:border-slate-800 shadow-2xl w-full max-w-md bg-white dark:bg-slate-900/20">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1.5 text-center">
          Welcome Back
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 text-center font-medium">
          Log in to manage your premium devices & orders
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="login-email"
              className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
            >
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              placeholder="name@example.com"
              value={usernameEmail}
              onChange={(e) => setUsernameEmail(e.target.value)}
              className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all ${
                emailError ? 'border-red-500' : 'border-slate-200 dark:border-slate-850'
              }`}
            />
            {emailError && <div className="text-red-500 text-[10px] font-bold mt-1.5">{emailError}</div>}
          </div>

          <div className="mb-6">
            <label
              htmlFor="login-password"
              className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
            >
              Password
            </label>
            <input
              type="password"
              id="login-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all ${
                passwordError ? 'border-red-500' : 'border-slate-200 dark:border-slate-850'
              }`}
            />
            {passwordError && (
              <div className="text-red-500 text-[10px] font-bold mt-1.5">{passwordError}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 glow-button flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
          >
            Log In
          </button>
        </form>

        <div className="mt-5 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Don't have an account?{' '}
          </span>
          <Link
            to="/register"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-705 dark:hover:text-indigo-300 font-bold text-decoration-none"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
