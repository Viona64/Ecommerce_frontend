import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api';

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Backend data state
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [callLogs, setCallLogs] = useState([]);

  // Loadings
  const [loading, setLoading] = useState(true);

  // Product Form state (Add/Edit)
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productFormId, setProductFormId] = useState(null); // original numeric ID for edit
  const [productFormName, setProductFormName] = useState('');
  const [productFormCategory, setProductFormCategory] = useState('Gaming');
  const [productFormPrice, setProductFormPrice] = useState('');
  const [productFormStock, setProductFormStock] = useState('');
  const [productFormDescription, setProductFormDescription] = useState('');
  const [productFormImage, setProductFormImage] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);

  // Load user details
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        const decodedUser = JSON.parse(savedUser);
        if (decodedUser.role !== 'admin') {
          setLoading(false);
          return; // Not an admin
        }
        setUser(decodedUser);
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch all admin data
  useEffect(() => {
    if (token) {
      fetchAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Products
      const prodRes = await fetch(`${API_BASE_URL}/api/products`);
      const prodData = await prodRes.json();
      setProducts(prodData);

      // Fetch Orders
      const ordRes = await fetch(`${API_BASE_URL}/api/orders/all`, { headers });
      const ordData = await ordRes.json();
      setOrders(ordData);

      // Fetch Users
      const userRes = await fetch(`${API_BASE_URL}/api/users/all`, { headers });
      const userData = await userRes.json();
      setUsersList(userData);

      // Fetch Calls
      const callRes = await fetch(`${API_BASE_URL}/api/calls/all`, { headers });
      const callData = await callRes.json();
      setCallLogs(callData);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setLoading(false);
    }
  };

  // Check if admin access is valid
  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md fade-in-section">
        <div className="glass-panel p-8 rounded-3xl border border-red-200 dark:border-red-900/30 shadow-2xl bg-white dark:bg-slate-900/20">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            <i className="bi bi-shield-slash-fill"></i>
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
            You do not have administrative privileges to access this page. Please log in with an administrator account.
          </p>
          <Link
            to="/login"
            className="btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all text-decoration-none shadow-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalSales = orders.reduce((acc, order) => {
    if (order.status !== 'Cancelled') {
      return acc + order.total;
    }
    return acc;
  }, 0);

  const totalOrders = orders.length;
  const totalProductsCount = products.length;
  const totalUsersCount = usersList.length;

  // Product CRUD Handlers
  const openAddProductModal = () => {
    setIsEditingProduct(false);
    setProductFormId(null);
    setProductFormName('');
    setProductFormCategory('Gaming');
    setProductFormPrice('');
    setProductFormStock('');
    setProductFormDescription('');
    setProductFormImage('');
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setIsEditingProduct(true);
    setProductFormId(product.id);
    setProductFormName(product.name);
    setProductFormCategory(product.category);
    setProductFormPrice(product.price);
    setProductFormStock(product.stock);
    setProductFormDescription(product.description);
    setProductFormImage(product.image);
    setShowProductModal(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: productFormName,
      category: productFormCategory,
      price: parseFloat(productFormPrice),
      stock: parseInt(productFormStock),
      description: productFormDescription,
      image: productFormImage || 'images/default-product.png',
    };

    const url = isEditingProduct
      ? `${API_BASE_URL}/api/products/${productFormId}`
      : `${API_BASE_URL}/api/products`;

    const method = isEditingProduct ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Product operation failed');
        alert(isEditingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        setShowProductModal(false);
        fetchAllData();
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  };

  const handleDeleteProduct = (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Product delete failed');
        alert('Product deleted successfully.');
        fetchAllData();
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  };

  // Order Status update handler
  const handleOrderStatusChange = (orderId, newStatus) => {
    fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update order status');
        alert(`Order status updated to ${newStatus}`);
        fetchAllData();
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  };

  // User role toggle handler
  const toggleUserRole = (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update user role');
        alert(`User role updated to ${newRole}`);

        // If updating current logged in user's role, update local storage
        if (userId === user.id) {
          const updatedUser = { ...user, role: newRole };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }

        fetchAllData();
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  };

  const formatDuration = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4 mb-8">
        <div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider">
            Vi Administrator Console
          </span>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mt-1">Vi Control Hub</h1>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Logged in: <strong className="text-slate-800 dark:text-slate-200">{user.email}</strong>
          </span>
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-455 text-[9px] font-extrabold uppercase rounded-md border border-indigo-100/50 dark:border-indigo-900/30">
            Admin
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="spinner-border text-indigo-650 dark:text-indigo-400 mb-2" role="status"></div>
          <p className="text-slate-500 dark:text-slate-450 text-sm font-medium">Loading console metrics...</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Tabs */}
          <div className="w-full lg:w-60 flex flex-col gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
              { id: 'products', label: 'Products Manager', icon: 'bi-box-seam' },
              { id: 'orders', label: 'Orders Manager', icon: 'bi-receipt' },
              { id: 'calls', label: 'Delivery Call Logs', icon: 'bi-telephone-record' },
              { id: 'users', label: 'Users & Roles', icon: 'bi-people' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 border transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 border-indigo-650 dark:bg-indigo-500 dark:border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:border-slate-350 dark:hover:border-slate-750'
                }`}
              >
                <i className={`bi ${tab.icon} text-sm`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Tab Panels */}
          <div className="flex-1 bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 rounded-[28px] p-6 md:p-8 shadow-sm min-h-[500px]">
            {/* PANEL: Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-0">
                  Performance Dashboard
                </h3>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl text-center shadow-sm">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <i className="bi bi-wallet2 text-lg"></i>
                    </div>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider block">
                      Total Sales
                    </span>
                    <span className="text-xl md:text-2xl font-black text-slate-850 dark:text-white mt-1.5 block">
                      ₹{totalSales.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl text-center shadow-sm">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <i className="bi bi-cart-check text-lg"></i>
                    </div>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider block">
                      Total Orders
                    </span>
                    <span className="text-xl md:text-2xl font-black text-slate-850 dark:text-white mt-1.5 block">
                      {totalOrders}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl text-center shadow-sm">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <i className="bi bi-cpu text-lg"></i>
                    </div>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider block">
                      Total Products
                    </span>
                    <span className="text-xl md:text-2xl font-black text-slate-850 dark:text-white mt-1.5 block">
                      {totalProductsCount}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl text-center shadow-sm">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <i className="bi bi-people text-lg"></i>
                    </div>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider block">
                      Active Users
                    </span>
                    <span className="text-xl md:text-2xl font-black text-slate-850 dark:text-white mt-1.5 block">
                      {totalUsersCount}
                    </span>
                  </div>
                </div>

                {/* Information Panel */}
                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-6">
                  <h4 className="font-extrabold text-indigo-900 dark:text-indigo-300 text-sm mb-2 flex items-center gap-2">
                    <i className="bi bi-info-circle-fill"></i> Admin Console Notes
                  </h4>
                  <p className="text-indigo-950/70 dark:text-indigo-300/70 text-xs leading-relaxed mb-0 font-medium">
                    Use the tabs on the left to add, edit, or delete items in the product directory, update order statuses, listen to voice logs recorded between users and delivery partners, or grant admin privileges to users.
                  </p>
                </div>
              </div>
            )}

            {/* PANEL: Products Manager */}
            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-0">
                    Products Catalog
                  </h3>
                  <button
                    onClick={openAddProductModal}
                    className="btn bg-indigo-650 hover:bg-indigo-650 text-white py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    <i className="bi bi-plus-lg"></i> Add Product
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle border-slate-100">
                    <thead>
                      <tr className="text-slate-550 text-[10px] font-extrabold uppercase tracking-wider">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod.id} className="text-slate-700 dark:text-slate-300 text-xs">
                          <td className="font-bold text-slate-400 dark:text-slate-600">{prod.id}</td>
                          <td>
                            <div className="flex items-center gap-3 py-1">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-0.5"
                              />
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {prod.name}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-350 font-bold uppercase text-[9px] tracking-wide border border-slate-200/40 dark:border-slate-700/40">
                              {prod.category}
                            </span>
                          </td>
                          <td className="font-extrabold text-orange-655 dark:text-orange-500">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </td>
                          <td>
                            <span
                              className={`font-extrabold ${
                                prod.stock <= 3
                                  ? 'text-red-655 dark:text-red-400'
                                  : 'text-slate-705 dark:text-slate-350'
                              }`}
                            >
                              {prod.stock} units
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditProductModal(prod)}
                                className="p-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
                                title="Edit Product"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/20 border border-rose-100 dark:border-rose-900/35 text-rose-600 dark:text-rose-400 hover:text-rose-800 rounded-lg cursor-pointer"
                                title="Delete Product"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PANEL: Orders Manager */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-6 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  Customer Orders
                </h3>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr className="text-slate-550 text-[10px] font-extrabold uppercase tracking-wider">
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items Count</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th className="text-end">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="text-slate-705 dark:text-slate-300 text-xs">
                          <td className="font-bold text-slate-800 dark:text-slate-200">
                            {order.orderId}
                          </td>
                          <td>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {order.userId?.name || 'Customer'}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                {order.userId?.email || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="font-medium">
                            {order.items.reduce((acc, it) => acc + it.quantity, 0)} items
                          </td>
                          <td className="font-extrabold text-orange-655 dark:text-orange-500">
                            ₹{order.total.toLocaleString('en-IN')}
                          </td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                              className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-350 font-bold cursor-pointer shadow-sm w-36"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="text-end text-slate-400 dark:text-slate-550 font-medium">
                            {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PANEL: Call Logs */}
            {activeTab === 'calls' && (
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-6 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  Courier Phone Voice Recordings
                </h3>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr className="text-slate-550 text-[10px] font-extrabold uppercase tracking-wider">
                        <th>Date</th>
                        <th>Order ID</th>
                        <th>User Account</th>
                        <th>Delivery Courier</th>
                        <th>Duration</th>
                        <th className="text-end" style={{ width: '280px' }}>
                          Recorded Audio
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {callLogs.map((call) => (
                        <tr key={call._id} className="text-slate-705 dark:text-slate-300 text-xs">
                          <td className="text-slate-450 dark:text-slate-500">
                            {new Date(call.timestamp).toLocaleString()}
                          </td>
                          <td className="font-bold text-slate-800 dark:text-slate-200">
                            {call.orderId}
                          </td>
                          <td>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {call.userId?.name || 'User'}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                {call.userId?.email || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="font-bold text-slate-700 dark:text-slate-300">
                            {call.deliveryPartnerName}
                          </td>
                          <td className="font-extrabold">{formatDuration(call.duration)}</td>
                          <td className="text-end">
                            <audio
                              src={`${API_BASE_URL}${call.audioUrl}`}
                              controls
                              className="w-full h-8 rounded-lg filter dark:invert dark:hue-rotate-180"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PANEL: Users and Roles */}
            {activeTab === 'users' && (
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-6 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  Users & Authentication Roles
                </h3>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr className="text-slate-550 text-[10px] font-extrabold uppercase tracking-wider">
                        <th>Full Name</th>
                        <th>Email Address</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((userItem) => (
                        <tr key={userItem._id} className="text-slate-705 dark:text-slate-300 text-xs">
                          <td className="font-bold text-slate-800 dark:text-slate-200">
                            {userItem.name || 'N/A'}
                          </td>
                          <td className="font-semibold">{userItem.email}</td>
                          <td>{userItem.phone || 'N/A'}</td>
                          <td className="max-w-[200px] truncate font-medium" title={userItem.address}>
                            {userItem.address || 'N/A'}
                          </td>
                          <td>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide border ${
                                userItem.role === 'admin'
                                  ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/35'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-400 border-slate-200 dark:border-slate-750'
                              }`}
                            >
                              {userItem.role}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              onClick={() => toggleUserRole(userItem._id, userItem.role)}
                              className="btn bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:border-slate-350 dark:hover:border-slate-750 font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer"
                            >
                              Make {userItem.role === 'admin' ? 'Customer' : 'Admin'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Product */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-[28px] w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 bg-transparent border-0 p-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 cursor-pointer"
            >
              <i className="bi bi-x-lg text-sm"></i>
            </button>

            <h3 className="font-extrabold text-slate-800 dark:text-white text-base mb-6 border-b dark:border-slate-800 pb-3">
              {isEditingProduct ? 'Modify Product Specifications' : 'Add New Premium Product'}
            </h3>

            <form onSubmit={handleProductSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={productFormName}
                    onChange={(e) => setProductFormName(e.target.value)}
                    required
                    placeholder="e.g. Mechanical Switch Premium Board"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Category Department
                    </label>
                    <select
                      value={productFormCategory}
                      onChange={(e) => setProductFormCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                    >
                      <option value="Gaming">Gaming</option>
                      <option value="Audio">Audio</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Video">Video</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={productFormPrice}
                        onChange={(e) => setProductFormPrice(e.target.value)}
                        required
                        placeholder="24999"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={productFormStock}
                        onChange={(e) => setProductFormStock(e.target.value)}
                        required
                        placeholder="10"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Image Filename / URL
                  </label>
                  <input
                    type="text"
                    value={productFormImage}
                    onChange={(e) => setProductFormImage(e.target.value)}
                    placeholder="images/keyboard.png or https://example.com/image.jpg"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Description Summary
                  </label>
                  <textarea
                    rows={3}
                    value={productFormDescription}
                    onChange={(e) => setProductFormDescription(e.target.value)}
                    required
                    placeholder="Provide detailed hardware specifications..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="btn bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-2 px-4 rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  {isEditingProduct ? 'Apply Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
