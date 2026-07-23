import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Catalog from './Pages/Catalog';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Profile from './Pages/Profile';
import Orders from './Pages/Orders';
import CustomerCare from './Pages/CustomerCare';
import Contact from './Pages/Contact';
import Privacy from './Pages/Privacy';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminPanel from './Pages/AdminPanel';
import { ToastContainer } from './Components/Toast';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    const sessionUser = { ...userData };
    localStorage.setItem('user', JSON.stringify(sessionUser));
    localStorage.setItem('token', sessionUser.token);
    setUser(sessionUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleUpdateUser = (updatedDetails) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedDetails };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAddToCart = (product, quantity = 1) => {
    let currentCart = [...cart];
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        addToast(`Cannot add more. Only ${product.stock} units are in stock.`, 'error');
        return false;
      }
      existingItem.quantity += quantity;
    } else {
      if (quantity > product.stock) {
        addToast(`Cannot add more. Only ${product.stock} units are in stock.`, 'error');
        return false;
      }
      currentCart.push({ product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    setCart(currentCart);
    addToast(`${quantity} x ${product.name} added to cart!`);
    return true;
  };

  const handleUpdateCartQty = (index, dir) => {
    let currentCart = [...cart];
    const item = currentCart[index];
    if (!item) return;

    const newQty = item.quantity + dir;
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }

    if (newQty > item.product.stock) {
      addToast(`Cannot add more. Only ${item.product.stock} units are in stock.`, 'error');
      return;
    }

    item.quantity = newQty;
    localStorage.setItem('cart', JSON.stringify(currentCart));
    setCart(currentCart);
  };

  const handleRemoveCartItem = (index) => {
    let currentCart = [...cart];
    currentCart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(currentCart));
    setCart(currentCart);
  };

  const handleClearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

  const getCartCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header cartCount={getCartCount()} user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onAddToCart={handleAddToCart} addToast={addToast} />} />
            <Route path="/catalog" element={<Catalog onAddToCart={handleAddToCart} addToast={addToast} />} />
            <Route path="/product-details" element={<ProductDetails onAddToCart={handleAddToCart} addToast={addToast} />} />
            <Route path="/cart" element={<Cart cart={cart} onUpdateQty={handleUpdateCartQty} onRemoveItem={handleRemoveCartItem} />} />
            <Route path="/checkout" element={<Checkout cart={cart} onClearCart={handleClearCart} />} />
            <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customer-care" element={<CustomerCare />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </Router>
  );
}

export default App;
