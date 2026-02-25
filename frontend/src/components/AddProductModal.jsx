import { useState } from 'react';
import { addProduct } from '../api';

const CATEGORIES = ['Wet Food', 'Dry Food', 'Treats', 'Health', 'Accessories', 'Speciality'];

export function AddProductModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    name: '', category: CATEGORIES[0], price: '', quantity: '', sku: '', description: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const price = parseFloat(form.price);
    const quantity = parseInt(form.quantity, 10);

    if (!form.name.trim() || !form.sku.trim()) {
      return setError('Name and SKU are required.');
    }
    if (isNaN(price) || price < 0) return setError('Enter a valid price.');
    if (isNaN(quantity) || quantity < 0) return setError('Enter a valid quantity.');

    setSaving(true);
    try {
      await addProduct({ ...form, price, quantity });
      onAdded?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Product Name *">
            <input
              className={INPUT}
              placeholder="e.g. Whiskas Adult Salmon"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category *">
              <select className={INPUT} value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="SKU *">
              <input
                className={INPUT}
                placeholder="e.g. SKU-021"
                value={form.sku}
                onChange={(e) => set('sku', e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (£) *">
              <input
                className={INPUT}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
              />
            </Field>
            <Field label="Quantity *">
              <input
                className={INPUT}
                type="number"
                min="0"
                placeholder="0"
                value={form.quantity}
                onChange={(e) => set('quantity', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              className={`${INPUT} resize-none`}
              rows={2}
              placeholder="Short product description…"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </Field>

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >Cancel</button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
            >{saving ? 'Adding…' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const INPUT = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300';

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
