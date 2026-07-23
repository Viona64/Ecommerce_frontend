import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../api';
import { fallbackProducts } from '../utils/products';
import StarRating from '../Components/StarRating';

function ProductDetails({ onAddToCart }) {
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(fallbackProducts[0]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const idVal = searchParams.get('id');
    const id = idVal ? parseInt(idVal) : null;

    if (id && !isNaN(id)) {
      fetch(`${API_BASE_URL}/api/products/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('API failure');
          return res.json();
        })
        .then((data) => {
          if (data) {
            setProduct(data);
            setQty(1);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch product details from server, trying fallback:', err);
          const matched = fallbackProducts.find((p) => p.id === id);
          if (matched) {
            setProduct(matched);
            setQty(1);
          }
        });
    } else {
      setProduct(fallbackProducts[0]);
      setQty(1);
    }
  }, [searchParams]);

  const incrementQty = () => {
    if (qty >= product.stock) {
      alert(`Cannot add more. Only ${product.stock} units are in stock.`);
      return;
    }
    setQty((prev) => prev + 1);
  };

  const decrementQty = () => {
    if (qty <= 1) return;
    setQty((prev) => prev - 1);
  };

  const getStockBadge = () => {
    if (product.stock <= 3) {
      return (
        <span className="border text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30">
          Only {product.stock} left
        </span>
      );
    }
    return (
      <span className="border text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-emerald-750 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30">
        In Stock
      </span>
    );
  };

  const relatedProducts = fallbackProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mb-8">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 text-decoration-none">
          Home
        </Link>
        <i className="bi bi-chevron-right text-[9px]"></i>
        <Link to="/catalog" className="hover:text-indigo-600 dark:hover:text-indigo-400 text-decoration-none">
          Catalog
        </Link>
        <i className="bi bi-chevron-right text-[9px]"></i>
        <span className="text-slate-800 dark:text-slate-350 font-bold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main product view split */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left Side: Product Image Display Container */}
        <div className="glass-panel p-4 rounded-3xl border border-slate-200 dark:border-slate-850 overflow-hidden flex items-center justify-center bg-slate-950 min-h-[350px] md:min-h-[450px]">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[400px] w-auto object-contain transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Right Side: Information Panel */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="inline-block bg-indigo-50 dark:bg-indigo-950 text-indigo-750 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-855 dark:text-white mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.rating} size="text-sm" />
              <span className="text-xs text-slate-400 dark:text-slate-500">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="text-3xl font-black text-orange-600 dark:text-orange-500 mb-6">
              ₹{product.price.toLocaleString('en-IN')}
            </div>

            <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Availability:
              </span>
              {getStockBadge()}
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Qty Selector */}
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                <button
                  onClick={decrementQty}
                  className="px-3 py-2.5 text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <i className="bi bi-dash-lg"></i>
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-800 dark:text-slate-200 select-none">
                  {qty}
                </span>
                <button
                  onClick={incrementQty}
                  className="px-3 py-2.5 text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={() => onAddToCart(product, qty)}
                className="btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 glow-button flex items-center justify-center gap-2 cursor-pointer flex-1 md:flex-none"
              >
                <i className="bi bi-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Specifications */}
      <section className="mb-16">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6">
          Technical Specifications
        </h2>
        <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800/85 overflow-hidden">
          <table className="table table-borderless m-0 text-sm">
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-900">
                <td className="px-6 py-3.5 font-bold text-slate-500 dark:text-slate-400 w-1/3 bg-slate-50/50 dark:bg-slate-900/30">
                  Model Type
                </td>
                <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/10">
                  Premium High-Fidelity Hardware
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-900">
                <td className="px-6 py-3.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                  Interface / Wireless
                </td>
                <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/10">
                  Dual-mode Bluetooth 5.2 / USB-C Wired
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-900">
                <td className="px-6 py-3.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                  Compatibility
                </td>
                <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/10">
                  Windows, macOS, iOS, Android, Linux
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                  Warranty Term
                </td>
                <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/10">
                  2-Year Limited Manufacturer Warranty
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Related Products */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((p) => {
            return (
              <div
                key={p.id}
                className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden flex flex-col relative bg-white dark:bg-slate-900/30"
              >
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-indigo-100/50 dark:border-indigo-900/30">
                    {p.category}
                  </span>
                </div>

                <div className="h-44 overflow-hidden relative bg-slate-950 flex items-center justify-center p-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
                      <Link
                        to={`/product-details?id=${p.id}`}
                        className="text-slate-800 dark:text-slate-100 text-decoration-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {p.name}
                      </Link>
                    </h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-3">
                    <span className="text-sm font-extrabold text-orange-600 dark:text-orange-500">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <Link
                      to={`/product-details?id=${p.id}`}
                      className="btn bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition-all duration-300 shadow-md shadow-orange-600/10 glow-button text-decoration-none"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
