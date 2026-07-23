import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../api';
import { fallbackProducts } from '../utils/products';
import StarRating from '../Components/StarRating';

function Catalog({ onAddToCart, addToast }) {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState(fallbackProducts);
  const [currentFilter, setCurrentFilter] = useState('All');
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Advanced filters and sorting state
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('API failure');
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      })
      .finally(() => {
        // Delay slightly for premium animation effect
        setTimeout(() => setLoading(false), 400);
      });
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCurrentFilter(categoryParam);
    } else {
      setCurrentFilter('All');
    }
  }, [searchParams]);

  // Combine filtering and sorting
  const getProcessedProducts = () => {
    let result = products.filter((p) => {
      const matchesCategory =
        currentFilter === 'All' || p.category.toLowerCase() === currentFilter.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(currentSearchQuery.toLowerCase());
      const matchesMinPrice = minPrice === '' || p.price >= parseFloat(minPrice);
      const matchesMaxPrice = maxPrice === '' || p.price <= parseFloat(maxPrice);

      return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'popularity-desc') {
      result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  };

  const processedProducts = getProcessedProducts();

  const getStockBadge = (stock) => {
    if (stock <= 3) {
      return (
        <span className="border text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30">
          Only {stock} left
        </span>
      );
    }
    return (
      <span className="border text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-750 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30">
        In Stock
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      <section id="catalog" className="scroll-mt-24">
        {/* Header Search and Category filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800/80">
          <div>
            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
              Vi Directory
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
              Signature Hardware
            </h2>
            <div className="relative mt-3 max-w-xs">
              <input
                type="text"
                placeholder="Search gear..."
                value={currentSearchQuery}
                onChange={(e) => setCurrentSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 pl-9 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all shadow-sm"
              />
              <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:self-end">
            {['All', 'Gaming', 'Audio', 'Wearables', 'Video', 'Accessories'].map((category) => (
              <button
                key={category}
                onClick={() => setCurrentFilter(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  currentFilter.toLowerCase() === category.toLowerCase()
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-600/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-bar for Price filters & Sorting Options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/80 p-4 rounded-2xl mb-8 transition-colors duration-300">
          {/* Price range inputs */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Price Range
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 shadow-sm"
              />
              <span className="text-slate-400 dark:text-slate-600 text-xs">—</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 shadow-sm"
              />
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg border-0 bg-transparent text-xs cursor-pointer flex items-center justify-center transition-colors"
                  title="Clear Price Filter"
                >
                  <i className="bi bi-x-circle-fill text-sm text-slate-400"></i>
                </button>
              )}
            </div>
          </div>

          {/* Sort Option Dropdown */}
          <div className="flex items-center gap-3 sm:ms-auto">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Sort By
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer shadow-sm"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
              <option value="popularity-desc">Popularity</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          /* Skeleton Loader Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden flex flex-col relative bg-white dark:bg-slate-900/30"
              >
                <div className="h-56 skeleton"></div>
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 skeleton rounded"></div>
                    <div className="h-4 w-16 skeleton rounded"></div>
                  </div>
                  <div className="h-6 w-3/4 skeleton rounded"></div>
                  <div className="h-10 w-full skeleton rounded"></div>
                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <div className="h-6 w-20 skeleton rounded"></div>
                    <div className="h-8 w-16 skeleton rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : processedProducts.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800/80 max-w-md mx-auto mt-6">
            <i className="bi bi-inbox text-5xl text-slate-400 dark:text-slate-500 mb-4 block"></i>
            <h4 className="text-slate-800 dark:text-slate-200 font-bold mb-2">No Devices Found</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-0">
              We couldn't find matches for your search query or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedProducts.map((product) => (
              <div
                key={product.id}
                className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden flex flex-col relative bg-white dark:bg-slate-900/30"
              >
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-indigo-100/50 dark:border-indigo-900/30">
                    {product.category}
                  </span>
                  {getStockBadge(product.stock)}
                </div>

                {/* Image Container with black backdrop */}
                <div className="h-56 overflow-hidden relative group bg-slate-950 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={product.rating} />
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
                      <Link
                        to={`/product-details?id=${product.id}`}
                        className="text-slate-800 dark:text-slate-100 text-decoration-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-slate-550 dark:text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Cart add CTA */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-auto">
                    <span className="text-xl font-extrabold text-orange-600 dark:text-orange-500">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        to={`/product-details?id=${product.id}`}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all text-decoration-none flex items-center justify-center"
                        title="Quick View"
                      >
                        <i className="bi bi-eye"></i>
                      </Link>
                      <button
                        onClick={() => onAddToCart(product)}
                        className="btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-300 shadow-md shadow-indigo-600/10 glow-button flex items-center gap-1.5 cursor-pointer"
                      >
                        <i className="bi bi-cart-plus"></i> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Catalog;
