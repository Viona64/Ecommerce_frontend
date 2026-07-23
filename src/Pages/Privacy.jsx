import React from 'react';
import { Link } from 'react-router-dom';

function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mb-8">
        <Link to="/" className="hover:text-indigo-650 dark:hover:text-indigo-400 text-decoration-none">
          Home
        </Link>
        <i className="bi bi-chevron-right text-[9px]"></i>
        <span className="text-slate-800 dark:text-slate-350 font-bold">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-slate-855 dark:text-white mb-8">
        Privacy Policy & Terms
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sticky Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm sticky top-24 space-y-1.5 text-xs bg-white dark:bg-slate-900/20">
            <a
              href="#collect"
              className="block font-bold text-slate-655 dark:text-slate-400 hover:text-indigo-655 dark:hover:text-indigo-400 py-1.5 text-decoration-none transition-colors"
            >
              1. Information We Collect
            </a>
            <a
              href="#use"
              className="block font-bold text-slate-655 dark:text-slate-400 hover:text-indigo-655 dark:hover:text-indigo-400 py-1.5 text-decoration-none transition-colors"
            >
              2. Use of Information
            </a>
            <a
              href="#security"
              className="block font-bold text-slate-655 dark:text-slate-400 hover:text-indigo-655 dark:hover:text-indigo-400 py-1.5 text-decoration-none transition-colors"
            >
              3. Data Security
            </a>
            <a
              href="#thirdparty"
              className="block font-bold text-slate-655 dark:text-slate-400 hover:text-indigo-655 dark:hover:text-indigo-400 py-1.5 text-decoration-none transition-colors"
            >
              4. Third-Party Services
            </a>
            <a
              href="#cookies"
              className="block font-bold text-slate-655 dark:text-slate-400 hover:text-indigo-655 dark:hover:text-indigo-400 py-1.5 text-decoration-none transition-colors"
            >
              5. Cookie Policy
            </a>
            <a
              href="#contact"
              className="block font-bold text-slate-655 dark:text-slate-400 hover:text-indigo-655 dark:hover:text-indigo-400 py-1.5 text-decoration-none transition-colors"
            >
              6. Contact Info
            </a>
          </div>
        </div>

        {/* Content Details */}
        <div className="lg:col-span-3 space-y-8 text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm bg-white dark:bg-slate-900/20">
            <h2
              id="collect"
              className="text-base font-extrabold text-slate-855 dark:text-white mb-3 scroll-mt-24 uppercase tracking-wider"
            >
              1. Information We Collect
            </h2>
            <p className="mb-3">
              When you visit Vi, register an account, make purchases, or contact customer support, we collect details that allow us to customize your shopping experience.
            </p>
            <p className="mb-0">
              This information includes: personal identifiers (such as Full Name, Email Address, and Phone Number), shipping addresses, and transaction histories. We do not store sensitive payment details; all card entries are processed through isolated, secure merchant channels.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm bg-white dark:bg-slate-900/20">
            <h2
              id="use"
              className="text-base font-extrabold text-slate-855 dark:text-white mb-3 scroll-mt-24 uppercase tracking-wider"
            >
              2. How We Use Your Information
            </h2>
            <p className="mb-3">
              The information we collect is used primarily to fulfill your product orders, deliver shipping updates, verify billing addresses, and provide customer support.
            </p>
            <p className="mb-0">
              Additionally, we utilize analytics to refine site navigation, evaluate catalog interactions, and recommend accessories that match your setups. If you opt-in, we may send email circulars detailing brand updates, season campaigns, and new devices.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm bg-white dark:bg-slate-900/20">
            <h2
              id="security"
              className="text-base font-extrabold text-slate-855 dark:text-white mb-3 scroll-mt-24 uppercase tracking-wider"
            >
              3. Data Security Measures
            </h2>
            <p className="mb-3">
              Vi implements advanced security features (such as secure sockets layer encryption, firewalls, and server segmentation) to maintain data privacy.
            </p>
            <p className="mb-0">
              While we employ robust industry procedures to secure your profile information, no internet connection or electronic database is entirely immune to risk. We encourage you to use unique passwords, secure your session credentials, and log out after completing checkout.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm bg-white dark:bg-slate-900/20">
            <h2
              id="thirdparty"
              className="text-base font-extrabold text-slate-855 dark:text-white mb-3 scroll-mt-24 uppercase tracking-wider"
            >
              4. Third-Party Disclosures
            </h2>
            <p className="mb-0">
              We do not sell, trade, or transfer your personal metrics to third-party brokers. We may share essential details with reliable service partners (including delivery carriers and server infrastructure platforms) solely to execute standard website functionality and logistical tasks.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm bg-white dark:bg-slate-900/20">
            <h2
              id="cookies"
              className="text-base font-extrabold text-slate-855 dark:text-white mb-3 scroll-mt-24 uppercase tracking-wider"
            >
              5. Cookie Policy
            </h2>
            <p className="mb-3">
              Vi uses browser cookies and local storage tokens to store essential configurations, retain cart selections between loads, and manage user login sessions.
            </p>
            <p className="mb-0">
              You can configure your browser to decline cookies or alerts. However, doing so may disrupt crucial e-commerce functionalities, such as cart management, checkout paths, and dynamic profile customization.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm bg-white dark:bg-slate-900/20">
            <h2
              id="contact"
              className="text-base font-extrabold text-slate-855 dark:text-white mb-3 scroll-mt-24 uppercase tracking-wider"
            >
              6. Contact Information
            </h2>
            <p className="mb-0">
              If you have questions about our data security policies, terms of service, or user rights, please submit an inquiry form on our{' '}
              <Link
                to="/contact"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold text-decoration-none transition-colors"
              >
                Contact Page
              </Link>{' '}
              or email us at support@vi.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
