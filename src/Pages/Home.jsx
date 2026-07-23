import React from 'react';
import { Link } from 'react-router-dom';
import { fallbackProducts } from '../utils/products';
import StarRating from '../Components/StarRating';

const featuredProducts = fallbackProducts.slice(0, 3);

function Home({ onAddToCart, addToast }) {
  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden mb-12 bg-white dark:bg-slate-900/40 p-8 md:p-12 lg:p-16 border border-slate-200 dark:border-slate-800/80 shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none"></div>
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sky-500/10 dark:bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-purple-500/10 blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <i className="bi bi-fire animate-pulse text-orange-500"></i> New Season Launch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-slate-900 dark:text-white">
              Discover Premium <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Tech & Hardware
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-350 text-base md:text-lg max-w-lg leading-relaxed">
              Welcome to Vi. Elevate your workspace ecosystem with our elite selection of mechanical components, audio systems, smart wearables, and high-fidelity gear.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/catalog"
                className="btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 glow-button text-decoration-none flex items-center gap-2"
              >
                Explore Catalog <i className="bi bi-arrow-right text-sm"></i>
              </Link>
            </div>
          </div>

          {/* Interactive Feature Visualizer */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="w-80 h-80 rounded-full border border-dashed border-indigo-500/20 dark:border-indigo-400/10 flex items-center justify-center animate-[spin_50s_linear_infinite]">
              <div className="w-64 h-64 rounded-full border border-dashed border-indigo-500/10 flex items-center justify-center"></div>
            </div>
            <div className="absolute w-72 h-72 rounded-3xl overflow-hidden backdrop-blur-md bg-white/5 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/60 flex flex-col items-center justify-center shadow-2xl transition-transform duration-550 hover:scale-[1.03] group">
              <img
                src="images/hero_headset.png"
                alt="NovaSound H1 Pro"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 text-center">
                <h4 className="text-white font-bold tracking-wide m-0 text-sm">NovaSound H1 Pro</h4>
                <p className="text-indigo-400 dark:text-indigo-350 text-xs font-extrabold mt-1 m-0">₹24,999</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copy Code Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-16 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 p-6 text-white shadow-lg shadow-teal-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 dark:bg-slate-900/20 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
            <i className="bi bi-tag-fill text-white"></i>
          </div>
          <div>
            <h3 className="font-extrabold text-base md:text-lg mb-1">Exclusive Launch Offer! Save 20% Today</h3>
            <p className="text-white/80 text-xs mb-0">
              Use our premium promo code at checkout for 20% off all gaming gear, accessories, and audio devices.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText('VI20');
            if (addToast) addToast("Promo code 'VI20' copied to clipboard!", 'success');
          }}
          className="btn bg-white hover:bg-slate-50 text-teal-700 hover:text-teal-800 dark:text-indigo-600 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
        >
          <i className="bi bi-copy"></i> Code: VI20
        </button>
      </div>

      {/* Categories Department */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
            Departments
          </span>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
            Browse By Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/catalog?category=Gaming"
            className="glass-card p-6 rounded-2xl text-center text-decoration-none block hover:-translate-y-1 hover:border-indigo-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 text-2xl">
              <i className="bi bi-controller"></i>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Gaming Gear</span>
          </Link>
          <Link
            to="/catalog?category=Audio"
            className="glass-card p-6 rounded-2xl text-center text-decoration-none block hover:-translate-y-1 hover:border-indigo-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 text-2xl">
              <i className="bi bi-headset"></i>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Premium Audio</span>
          </Link>
          <Link
            to="/catalog?category=Wearables"
            className="glass-card p-6 rounded-2xl text-center text-decoration-none block hover:-translate-y-1 hover:border-indigo-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 text-2xl">
              <i className="bi bi-watch"></i>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Wearables</span>
          </Link>
          <Link
            to="/catalog?category=Video"
            className="glass-card p-6 rounded-2xl text-center text-decoration-none block hover:-translate-y-1 hover:border-indigo-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 text-2xl">
              <i className="bi bi-projector"></i>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Visual Tech</span>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
              Curated Collection
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
              Featured Devices
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-bold text-sm text-decoration-none flex items-center gap-1 transition-colors duration-200"
          >
            See All <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden flex flex-col relative bg-white dark:bg-slate-900/30"
            >
              {/* Category tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-indigo-100/50 dark:border-indigo-900/30">
                  {product.category}
                </span>
              </div>

              {/* Image Bezel container */}
              <div className="h-56 overflow-hidden relative group bg-slate-950 flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content Description */}
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
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Pricing & Checkout interaction */}
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
      </section>
    </div>
  );
}

export default Home;