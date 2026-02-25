import { useState } from 'react';
import { updateQuantity, deleteProduct } from '../api';
import { CategoryBadge } from './CategoryBadge';

export function ProductCard({ product, onUpdated, onDeleted }) {
  const [qty, setQty] = useState(product.quantity);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleQtyChange(delta) {
    const next = Math.max(0, qty + delta);
    setSaving(true);
    try {
      await updateQuantity(product.id, next);
      setQty(next);
      onUpdated?.();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return; }
    try {
      await deleteProduct(product.id);
      onDeleted?.();
    } catch (e) {
      alert(e.message);
    }
  }

  const stockColor =
    qty === 0 ? 'text-red-600' : qty < 10 ? 'text-amber-600' : 'text-emerald-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate" title={product.name}>
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{product.sku}</p>
        </div>
        <CategoryBadge category={product.category} />
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{product.description}</p>
      )}

      {/* Price & Stock */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-orange-500">£{Number(product.price).toFixed(2)}</span>
        <span className={`text-sm font-semibold ${stockColor}`}>
          {qty === 0 ? 'Out of stock' : `${qty} in stock`}
        </span>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQtyChange(-1)}
          disabled={saving || qty === 0}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors"
        >−</button>
        <span className="flex-1 text-center text-sm font-semibold text-gray-800">{qty}</span>
        <button
          onClick={() => handleQtyChange(1)}
          disabled={saving}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors"
        >+</button>
      </div>

      {/* Delete */}
      {confirming ? (
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="flex-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg py-1.5 font-semibold transition-colors"
          >Confirm delete</button>
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-1.5 font-semibold transition-colors"
          >Cancel</button>
        </div>
      ) : (
        <button
          onClick={handleDelete}
          className="w-full text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg py-1.5 transition-colors"
        >🗑 Remove product</button>
      )}
    </div>
  );
}
