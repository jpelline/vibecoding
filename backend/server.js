const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET all products (with optional search/filter)
app.get('/api/products', (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];

  if (search || category) {
    query += ' WHERE';
    if (search) {
      query += ' (name LIKE ? OR sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (search && category) query += ' AND';
    if (category) {
      query += ' category = ?';
      params.push(category);
    }
  }
  query += ' ORDER BY name ASC';

  const products = db.prepare(query).all(...params);
  res.json(products);
});

// GET a single product
app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// GET categories list
app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT DISTINCT category FROM products ORDER BY category ASC').all();
  res.json(categories.map((c) => c.category));
});

// POST create a new product
app.post('/api/products', (req, res) => {
  const { name, category, price, quantity, sku, description } = req.body;

  if (!name || !category || price == null || quantity == null || !sku) {
    return res.status(400).json({ error: 'Missing required fields: name, category, price, quantity, sku' });
  }

  try {
    const result = db
      .prepare(
        'INSERT INTO products (name, category, price, quantity, sku, description) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(name, category, price, quantity, sku, description || '');

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newProduct);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'A product with this SKU already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PATCH update product quantity
app.patch('/api/products/:id/quantity', (req, res) => {
  const { quantity } = req.body;

  if (quantity == null || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be a non-negative number' });
  }

  const result = db
    .prepare('UPDATE products SET quantity = ? WHERE id = ?')
    .run(quantity, req.params.id);

  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// PUT update product (full update)
app.put('/api/products/:id', (req, res) => {
  const { name, category, price, quantity, sku, description } = req.body;

  if (!name || !category || price == null || quantity == null || !sku) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = db
      .prepare(
        'UPDATE products SET name=?, category=?, price=?, quantity=?, sku=?, description=? WHERE id=?'
      )
      .run(name, category, price, quantity, sku, description || '', req.params.id);

    if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'A product with this SKU already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Inventory API server running on http://localhost:${PORT}`);
});
