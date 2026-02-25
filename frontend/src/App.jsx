import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories } from './api';
import { ProductCard } from './components/ProductCard';
import { AddProductModal } from './components/AddProductModal';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      const data = await getProducts(search, activeCategory);
      setProducts(data);
    } catch (e) {
      setError('Could not connect to the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const totalItems = products.reduce((s, p) => s + p.quantity, 0);
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity < 10).length;
  const outOfStock = products.filter((p) => p.quantity === 0).length;

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-2xl">🐱</span>
            <div>
              <span className="text-xl font-extrabold text-orange-500 tracking-tight">PurrStock</span>
              <span className="hidden sm:inline text-sm text-gray-400 ml-2">Cat Food Inventory</span>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors"
          >
            <span className="text-base">+</span> Add Product
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard emoji="📦" label="Products" value={products.length} color="bg-white" />
          <StatCard emoji="🔢" label="Total Units" value={totalItems.toLocaleString()} color="bg-white" />
          <StatCard
            emoji={outOfStock > 0 ? '🚨' : lowStock > 0 ? '⚠️' : '✅'}
            label={outOfStock > 0 ? 'Out of Stock' : lowStock > 0 ? 'Low Stock' : 'All Stocked'}
            value={outOfStock > 0 ? outOfStock : lowStock > 0 ? lowStock : '—'}
            color={outOfStock > 0 ? 'bg-red-50' : lowStock > 0 ? 'bg-amber-50' : 'bg-emerald-50'}
          />
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name or SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <FilterButton active={activeCategory === ''} onClick={() => setActiveCategory('')}>All</FilterButton>
            {categories.map((c) => (
              <FilterButton key={c} active={activeCategory === c} onClick={() => setActiveCategory(c)}>{c}</FilterButton>
            ))}
          </div>
        </div>

        {/* Content */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <span className="text-4xl animate-bounce inline-block">🐾</span>
            <p className="mt-3 text-sm">Loading inventory…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <span className="text-4xl">😿</span>
            <p className="mt-3 text-sm">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onUpdated={load} onDeleted={load} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <AddProductModal onClose={() => setShowModal(false)} onAdded={() => { load(); getCategories().then(setCategories); }} />
      )}
    </div>
  );
}

function StatCard({ emoji, label, value, color }) {
  return (
    <div className={`${color} rounded-2xl border border-gray-100 p-4 flex flex-col items-center text-center shadow-sm`}>
      <span className="text-2xl">{emoji}</span>
      <span className="text-xl font-bold text-gray-800 mt-1">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
        active
          ? 'bg-orange-500 text-white shadow-sm'
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
      }`}
    >{children}</button>
  );
}
