import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsSuccess(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mb-8">
        <Link to="/" className="hover:text-indigo-650 dark:hover:text-indigo-400 text-decoration-none">
          Home
        </Link>
        <i className="bi bi-chevron-right text-[9px]"></i>
        <span className="text-slate-800 dark:text-slate-350 font-bold">Contact Us</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-slate-855 dark:text-white mb-8 text-center md:text-left">
        Contact Us
      </h1>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-6 bg-white dark:bg-slate-900/20">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                Email Support
              </h3>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <i className="bi bi-envelope text-indigo-600 dark:text-indigo-400 text-base"></i>{' '}
                support@vi.com
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                Phone Line
              </h3>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <i className="bi bi-telephone text-indigo-600 dark:text-indigo-400 text-base"></i> +1
                800-555-VI-GEAR
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                HQ Address
              </h3>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 leading-relaxed">
                <i className="bi bi-geo-alt text-indigo-600 dark:text-indigo-400 text-base flex-shrink-0"></i>{' '}
                Vi Headquarters, Chennai, Tamil Nadu, India
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                Support Hours
              </h3>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <i className="bi bi-clock text-indigo-600 dark:text-indigo-400 text-base"></i> Mon -
                Fri: 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm relative overflow-hidden bg-white dark:bg-slate-900/20">
            <h2 className="text-base font-extrabold text-slate-855 dark:text-white mb-4 uppercase tracking-wider">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    required
                    minLength={3}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  required
                  minLength={4}
                  placeholder="Order Issue, Support Request..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  minLength={10}
                  rows={5}
                  placeholder="Type your message details here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 glow-button cursor-pointer"
              >
                Send Message
              </button>
            </form>

            {isSuccess && (
              <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 transition-all duration-500">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mb-4 shadow animate-bounce">
                  <i className="bi bi-check2-all"></i>
                </div>
                <h3 className="text-slate-800 dark:text-white font-extrabold mb-2">Message Sent!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
                  Thank you for reaching out. A support representative will reply within 24 business hours.
                </p>
                <button
                  onClick={handleReset}
                  className="btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
