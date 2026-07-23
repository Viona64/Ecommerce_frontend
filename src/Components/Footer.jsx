import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 py-12 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-3.5">
            <Link to="/" className="flex items-center text-decoration-none group">
              <img 
                src="/images/vi-logo.png" 
                alt="Vi Exclusive Gadgets" 
                className="h-8 w-auto object-contain bg-white dark:bg-white/90 p-0.5 rounded-md transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Elevate your hardware ecosystem with our curated collections of premium mechanical keycaps, hybrid acoustics, and active tech wearables.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3.5 text-xs uppercase tracking-wider">Departments</h4>
            <ul className="list-unstyled space-y-2.5 text-xs">
              <li>
                <Link to="/catalog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-decoration-none text-slate-500 dark:text-slate-400">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Gaming" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-decoration-none text-slate-500 dark:text-slate-400">
                  Gaming Gear
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Audio" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-decoration-none text-slate-500 dark:text-slate-400">
                  Premium Audio
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3.5 text-xs uppercase tracking-wider">Resources</h4>
            <ul className="list-unstyled space-y-2.5 text-xs">
              <li>
                <Link to="/customer-care" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-decoration-none text-slate-500 dark:text-slate-400">
                  Customer Care
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-decoration-none text-slate-500 dark:text-slate-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-decoration-none text-slate-500 dark:text-slate-400">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Connect Column */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3.5 text-xs uppercase tracking-wider">Social Connect</h4>
            <div className="flex space-x-3 text-lg">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-200"
                title="Follow us on X"
              >
                <i className="bi bi-twitter-x text-sm"></i>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-200"
                title="Check our Github"
              >
                <i className="bi bi-github text-sm"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-200"
                title="Follow us on Instagram"
              >
                <i className="bi bi-instagram text-sm"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="mb-0 text-slate-450 dark:text-slate-500">© 2026 Vi. All rights reserved.</p>
          <div className="flex space-x-4">
            <span className="text-slate-350 dark:text-slate-800">|</span>
            <span className="text-slate-450 dark:text-slate-500">Crafted for Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
