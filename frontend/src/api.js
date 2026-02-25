const BASE = '/api';

export async function getProducts(search = '', category = '') {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  const res = await fetch(`${BASE}/products?${params}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function addProduct(data) {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add product');
  }
  return res.json();
}

export async function updateQuantity(id, quantity) {
  const res = await fetch(`${BASE}/products/${id}/quantity`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Failed to update quantity');
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
}
