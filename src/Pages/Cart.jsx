import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Cart({ cart, onUpdateQty, onRemoveItem }) {
  const [promoCode, setPromoCode] = useState(() => localStorage.getItem('promoCode') || '');
  const [discountRate, setDiscountRate] = useState(() =>
    localStorage.getItem('promoCode') === 'VI20' ? 0.2 : 0
  );
  const [promoMsg, setPromoMsg] = useState(() =>
    localStorage.getItem('promoCode') === 'VI20' ? 'Promo code applied successfully (20% Off)!' : ''
  );
  const [promoClass, setPromoClass] = useState(() =>
    localStorage.getItem('promoCode') === 'VI20' ? 'text-xs mt-1.5 font-bold text-emerald-600' : ''
  );

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = subtotal * discountRate;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'VI20') {
      setDiscountRate(0.2);
      setPromoMsg('Promo code applied successfully (20% Off)!');
      setPromoClass('text-xs mt-1.5 font-bold text-emerald-600 dark:text-emerald-400');
      localStorage.setItem('promoCode', code);
    } else if (code === '') {
      setDiscountRate(0);
      setPromoMsg('');
      localStorage.removeItem('promoCode');
    } else {
      setDiscountRate(0);
      setPromoMsg('Invalid promo code.');
      setPromoClass('text-xs mt-1.5 font-bold text-red-650 dark:text-red-400');
      localStorage.removeItem('promoCode');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 fade-in-section">
        <nav className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mb-8">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 text-decoration-none">
            Home
          </Link>
          <i className="bi bi-chevron-right text-[9px]"></i>
          <span className="text-slate-800 dark:text-slate-350 font-bold">Shopping Cart</span>
        </nav>
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto shadow-lg">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl text-indigo-600 dark:text-indigo-400">
            <i className="bi bi-cart-x animate-[pulse_2s_infinite]"></i>
          </div>
          <h3 className="text-slate-800 dark:text-white font-extrabold mb-2 text-lg">Your Cart is Empty</h3>
          <p className="text-slate-550 dark:text-slate-400 text-sm mb-6 max-w-xs mx-auto">
            Looks like you haven't added any premium hardware to your selection yet.
          </p>
          <Link
            to="/catalog"
            className="btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 glow-button inline-flex items-center gap-2 text-decoration-none"
          >
            Browse Catalog <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      <nav className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mb-8">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 text-decoration-none">
          Home
        </Link>
        <i className="bi bi-chevron-right text-[9px]"></i>
        <span className="text-slate-800 dark:text-slate-350 font-bold">Shopping Cart</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-slate-855 dark:text-white mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const itemSubtotal = item.product.price * item.quantity;
            return (
              <div
                key={item.product.id}
                className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 bg-white dark:bg-slate-900/30"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 p-2 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="bg-indigo-55 dark:bg-indigo-950 text-indigo-750 dark:text-indigo-300 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded mb-1.5 inline-block">
                      {item.product.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-855 dark:text-white m-0 truncate max-w-[280px]">
                      <Link
                        to={`/product-details?id=${item.product.id}`}
                        className="text-slate-855 dark:text-white text-decoration-none hover:text-indigo-650 dark:hover:text-indigo-400"
                      >
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 mb-0 font-medium">
                      ₹{item.product.price.toLocaleString('en-IN')} each
                    </p>
                  </div>
                </div>

                {/* Controls and pricing */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-slate-100 dark:border-slate-800/60 md:border-0 pt-3 md:pt-0">
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                    <button
                      onClick={() => onUpdateQty(index, -1)}
                      className="px-2.5 py-1 text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-855 dark:text-slate-200 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQty(index, 1)}
                      className="px-2.5 py-1 text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>

                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-150 w-20 text-right">
                    ₹{itemSubtotal.toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-650 dark:hover:text-red-400 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30 cursor-pointer"
                    title="Remove Item"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary box */}
        <div>
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xl bg-white dark:bg-slate-900/20">
            <h3 className="text-base font-extrabold text-slate-855 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3 uppercase tracking-wider">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-xs font-medium text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  Discount{' '}
                  {discountRate > 0 && <span className="text-xs text-emerald-600">(20% off)</span>}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-450">
                  -₹{discount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-450">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ₹{tax.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 mb-4">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Total</span>
              <span className="text-xl font-black text-orange-600 dark:text-orange-500">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Promo application */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
                <button
                  onClick={handleApplyPromo}
                  className="btn bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoMsg && <div className={promoClass}>{promoMsg}</div>}
            </div>

            <Link
              to="/checkout"
              className="w-full btn bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 glow-button flex items-center justify-center gap-2 text-decoration-none"
            >
              Proceed to Checkout <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
