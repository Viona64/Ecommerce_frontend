import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

function Checkout({ cart, onClearCart }) {
  const navigate = useNavigate();
  const [shippingName, setShippingName] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const promoCode = localStorage.getItem('promoCode') || '';

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = promoCode === 'VI20' ? subtotal * 0.2 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  useEffect(() => {
    if (cart.length === 0) {
      alert('Your cart is empty. Redirecting to catalog.');
      navigate('/catalog');
    }
  }, [cart, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      promoCode: promoCode,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newOrder),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Order creation failed');
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.unshift(data);
        localStorage.setItem('orders', JSON.stringify(orders));
        localStorage.removeItem('promoCode');

        onClearCart();
        alert(`Order ${data.orderId} placed successfully!`);
        navigate('/orders');
      })
      .catch((err) => {
        console.error('Error posting order:', err);
        alert(err.message || 'Unable to place order.');
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mb-8">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 text-decoration-none">
          Home
        </Link>
        <i className="bi bi-chevron-right text-[9px]"></i>
        <Link to="/cart" className="hover:text-indigo-600 dark:hover:text-indigo-400 text-decoration-none">
          Cart
        </Link>
        <i className="bi bi-chevron-right text-[9px]"></i>
        <span className="text-slate-800 dark:text-slate-350 font-bold">Checkout</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-slate-855 dark:text-white mb-8">Secure Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping details */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm bg-white dark:bg-slate-900/20">
            <h2 className="text-base font-extrabold text-slate-855 dark:text-white mb-5 flex items-center gap-2 uppercase tracking-wider">
              <i className="bi bi-geo-alt text-orange-600 dark:text-orange-500"></i> Shipping Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-3">
                <label
                  htmlFor="ship-name"
                  className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="ship-name"
                  required
                  minLength={3}
                  placeholder="John Doe"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="ship-email"
                  className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="ship-email"
                  required
                  placeholder="john@example.com"
                  value={shippingEmail}
                  onChange={(e) => setShippingEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="ship-address"
                className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
              >
                Street Address
              </label>
              <input
                type="text"
                id="ship-address"
                required
                placeholder="123 Premium Lane"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-3">
                <label
                  htmlFor="ship-city"
                  className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  City
                </label>
                <input
                  type="text"
                  id="ship-city"
                  required
                  placeholder="Silicon Valley"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="ship-state"
                  className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  State
                </label>
                <input
                  type="text"
                  id="ship-state"
                  required
                  placeholder="California"
                  value={shippingState}
                  onChange={(e) => setShippingState(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="ship-zip"
                  className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="ship-zip"
                  required
                  pattern="[0-9]{5,6}"
                  placeholder="94025"
                  value={shippingZip}
                  onChange={(e) => setShippingZip(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Payment Card Section */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm bg-white dark:bg-slate-900/20">
            <h2 className="text-base font-extrabold text-slate-855 dark:text-white mb-5 flex items-center gap-2 uppercase tracking-wider">
              <i className="bi bi-credit-card text-indigo-650 dark:text-indigo-400"></i> Payment Details
            </h2>

            <div className="mb-3">
              <label
                htmlFor="card-name"
                className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
              >
                Name on Card
              </label>
              <input
                type="text"
                id="card-name"
                required
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="card-number"
                className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
              >
                Card Number
              </label>
              <input
                type="text"
                id="card-number"
                required
                pattern="[0-9]{16}"
                maxLength={16}
                placeholder="1111222233334444"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="mb-3">
                <label
                  htmlFor="card-expiry"
                  className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  Expiration Date
                </label>
                <input
                  type="text"
                  id="card-expiry"
                  required
                  pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="card-cvv"
                  className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  CVV
                </label>
                <input
                  type="password"
                  id="card-cvv"
                  required
                  pattern="[0-9]{3,4}"
                  maxLength={4}
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order details panel card */}
        <div>
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xl bg-white dark:bg-slate-900/20">
            <h3 className="text-base font-extrabold text-slate-855 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3 uppercase tracking-wider">
              Order Items
            </h3>

            {/* Cart Items list */}
            <div className="space-y-3.5 mb-4 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="truncate max-w-[180px]">
                    {item.product.name} <span className="text-slate-400">x {item.quantity}</span>
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-xs font-medium text-slate-655 dark:text-slate-400 border-t border-b border-slate-100 dark:border-slate-800/80 py-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-slate-250">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span>
                    Discount <span className="text-xs text-emerald-600">(20% off)</span>
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-450">
                    -₹{discount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-450">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-bold text-slate-800 dark:text-slate-250">
                  ₹{tax.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 mb-6">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Total</span>
              <span className="text-xl font-black text-orange-600 dark:text-orange-500">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              className="w-full btn bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-orange-600/20 glow-button flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="bi bi-shield-lock"></i> Place Secure Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
