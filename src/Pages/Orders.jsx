import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api';

const defaultOrders = [
  {
    orderId: 'VI-718293',
    date: '2026-07-16',
    total: 161.99,
    status: 'Shipped',
    items: [
      {
        name: 'ApexTrack Active Smartwatch',
        quantity: 1,
        price: 149.99,
        image: 'images/smartwatch.jpg',
      },
    ],
  },
  {
    orderId: 'VI-839201',
    date: '2026-07-10',
    total: 529.18,
    status: 'Delivered',
    items: [
      {
        name: 'AeroGlow Pro Mechanical Keyboard',
        quantity: 1,
        price: 189.99,
        image: 'images/keyboard.png',
      },
      {
        name: 'NovaSound H1 Hybrid ANC Headphones',
        quantity: 1,
        price: 299.99,
        image: 'images/headphones.jpg',
      },
    ],
  },
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('API failure');
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setOrders(data);
        } else {
          setOrders(defaultOrders);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch orders from server, using local storage fallback:', err);
        let savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          try {
            setOrders(JSON.parse(savedOrders));
          } catch (e) {
            setOrders(defaultOrders);
          }
        } else {
          setOrders(defaultOrders);
        }
      });
  }, []);

  const toggleDetails = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mb-8">
        <Link to="/" className="hover:text-indigo-650 dark:hover:text-indigo-400 text-decoration-none">
          Home
        </Link>
        <i className="bi bi-chevron-right text-[9px]"></i>
        <span className="text-slate-800 dark:text-slate-350 font-bold">Orders</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-slate-855 dark:text-white mb-8">Order History</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {orders.map((order, idx) => {
          let statusColor = 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/30';
          if (order.status === 'Shipped') {
            statusColor = 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
          } else if (order.status === 'Delivered') {
            statusColor = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
          }

          let step1Class = 'text-indigo-600 dark:text-indigo-400 font-bold';
          let step2Class = 'text-slate-400 dark:text-slate-655';
          let step3Class = 'text-slate-400 dark:text-slate-655';
          let line1Class = 'bg-slate-200 dark:bg-slate-800';
          let line2Class = 'bg-slate-200 dark:bg-slate-800';

          if (order.status === 'Shipped') {
            step2Class = 'text-indigo-600 dark:text-indigo-400 font-bold';
            line1Class = 'bg-indigo-600 dark:bg-indigo-500';
          } else if (order.status === 'Delivered') {
            step2Class = 'text-indigo-600 dark:text-indigo-400 font-bold';
            step3Class = 'text-indigo-600 dark:text-indigo-400 font-bold';
            line1Class = 'bg-indigo-600 dark:bg-indigo-500';
            line2Class = 'bg-indigo-600 dark:bg-indigo-500';
          }

          return (
            <div
              key={order.orderId}
              className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-sm bg-white dark:bg-slate-900/20 transition-all duration-300"
            >
              {/* Card Header details */}
              <div className="p-6 flex flex-wrap items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/80">
                <div className="min-w-[120px]">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                    Order ID
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 m-0">
                    {order.orderId}
                  </h3>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                    Date Placed
                  </span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 m-0">{order.date}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                    Total Amount
                  </span>
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-500 m-0">
                    ₹{order.total.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className={`border text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md ${statusColor}`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => toggleDetails(idx)}
                    className="btn bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:border-slate-350 dark:hover:border-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    Details{' '}
                    <i
                      className={`bi text-[10px] transition-transform duration-300 ${
                        openIndex === idx ? 'bi-chevron-up' : 'bi-chevron-down'
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              {/* Collapsed Order Item details */}
              {openIndex === idx && (
                <div className="p-6 space-y-6 border-t border-slate-150 dark:border-slate-800/80 bg-white dark:bg-slate-900/10">
                  {/* Items list */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                      Order Items
                    </h4>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-4 divide-y divide-slate-100 dark:divide-slate-800/80">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                          <div className="w-12 h-12 rounded-xl bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center flex-shrink-0 p-1">
                            <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate m-0">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-slate-450 dark:text-slate-500 m-0 font-medium">
                              ₹{item.price.toLocaleString('en-IN')} x {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-250">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Status tracker */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
                      Delivery Tracker
                    </h4>
                    <div className="relative py-4 flex items-center justify-between max-w-lg mx-auto">
                      {/* Bar Background */}
                      <div className="absolute top-[20px] left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 z-0 rounded">
                        <div
                          className={`h-full rounded transition-all duration-500 ${line1Class}`}
                          style={{ width: '50%' }}
                        ></div>
                        <div
                          className={`h-full rounded transition-all duration-500 ${line2Class}`}
                          style={{ width: '100%', marginTop: '-4px' }}
                        ></div>
                      </div>

                      {/* Step checkpoints */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-650/20">
                          <i className="bi bi-card-checklist text-xs"></i>
                        </div>
                        <span className={`text-[10px] mt-2.5 uppercase tracking-wider ${step1Class}`}>
                          Processing
                        </span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                            order.status !== 'Processing'
                              ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-indigo-650/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-slate-700/50'
                          }`}
                        >
                          <i className="bi bi-truck text-xs"></i>
                        </div>
                        <span className={`text-[10px] mt-2.5 uppercase tracking-wider ${step2Class}`}>
                          Shipped
                        </span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                            order.status === 'Delivered'
                              ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-indigo-650/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-slate-700/50'
                          }`}
                        >
                          <i className="bi bi-house-check text-xs"></i>
                        </div>
                        <span className={`text-[10px] mt-2.5 uppercase tracking-wider ${step3Class}`}>
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
