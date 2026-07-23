import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header({ cartCount, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    onLogout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Catalog' },
    { path: '/customer-care', label: 'Customer Care' },
    { path: '/contact', label: 'Contact' },
    { path: '/orders', label: 'Orders' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800/80 transition-all duration-300">
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center text-decoration-none group">
          <img 
            src="/images/vi-logo.png" 
            alt="Vi Exclusive Gadgets" 
            className="h-10 md:h-12 w-auto object-contain bg-white dark:bg-white/90 p-0.5 rounded-lg transition-transform duration-300 group-hover:scale-105" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-semibold text-sm text-decoration-none transition-colors duration-200 relative group py-1 ${
                isActive(link.path)
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
          ))}
          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              className={`font-semibold text-sm text-decoration-none transition-colors duration-200 relative group py-1 ${
                isActive('/admin')
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300'
              }`}
            >
              Admin Hub
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all duration-300 ${
                  isActive('/admin') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3.5">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-850 transition-all duration-200 flex items-center justify-center cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'} text-md`}></i>
          </button>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-850 flex items-center justify-center cursor-pointer text-decoration-none transition-all duration-200"
            title="Shopping Cart"
          >
            <i className="bi bi-cart3 text-lg"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth State */}
          {user ? (
            <button
              onClick={handleLogoutClick}
              className="hidden md:inline-flex btn bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-850 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs text-decoration-none shadow-md shadow-indigo-600/10 transition-all duration-200"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-300 hover:text-indigo-600 focus:outline-none cursor-pointer transition-all"
            title="Toggle Menu"
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[71px] bottom-0 bg-slate-950/40 backdrop-blur-sm z-40 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-250 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Navigation</span>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-bold text-sm text-decoration-none transition-colors py-1 ${
                      isActive(link.path)
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user && user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold text-sm text-decoration-none text-purple-600 dark:text-purple-400 hover:text-purple-700 py-1"
                  >
                    Admin Hub
                  </Link>
                )}
              </nav>
            </div>

            {/* Mobile Auth actions */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                      {user.email[0].toUpperCase()}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full btn bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs text-decoration-none flex items-center justify-center shadow-md shadow-indigo-600/10 transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
