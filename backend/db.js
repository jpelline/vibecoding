const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'inventory.db'));

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    sku TEXT UNIQUE NOT NULL,
    description TEXT
  )
`);

// Seed with 20 products if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, category, price, quantity, sku, description) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const products = [
    ['Apple iPhone 15', 'Electronics', 999.99, 25, 'SKU-001', 'Latest Apple smartphone with A16 chip'],
    ['Samsung 4K TV 55"', 'Electronics', 649.99, 12, 'SKU-002', '55-inch 4K UHD Smart TV'],
    ['Nike Air Max 270', 'Footwear', 149.99, 40, 'SKU-003', 'Comfortable running shoes with Air cushioning'],
    ['Levi\'s 501 Jeans', 'Clothing', 59.99, 60, 'SKU-004', 'Classic straight-fit denim jeans'],
    ['KitchenAid Stand Mixer', 'Appliances', 379.99, 8, 'SKU-005', 'Professional 5-quart stand mixer'],
    ['The Great Gatsby', 'Books', 12.99, 100, 'SKU-006', 'Classic novel by F. Scott Fitzgerald'],
    ['Yoga Mat Premium', 'Sports', 34.99, 55, 'SKU-007', 'Non-slip 6mm thick yoga mat'],
    ['Nespresso Vertuo Coffee Machine', 'Appliances', 199.99, 18, 'SKU-008', 'Single-serve coffee machine with 5 cup sizes'],
    ['Sony WH-1000XM5 Headphones', 'Electronics', 349.99, 20, 'SKU-009', 'Industry-leading noise canceling headphones'],
    ['Adidas Ultraboost 22', 'Footwear', 189.99, 35, 'SKU-010', 'High-performance running shoes with Boost midsole'],
    ['Instant Pot Duo 7-in-1', 'Appliances', 89.99, 30, 'SKU-011', 'Multi-use pressure cooker, slow cooker, rice cooker'],
    ['Patagonia Fleece Jacket', 'Clothing', 119.99, 22, 'SKU-012', 'Sustainable fleece jacket for outdoor activities'],
    ['LEGO Technic Set', 'Toys', 79.99, 45, 'SKU-013', 'Advanced LEGO building set for ages 10+'],
    ['Dyson V15 Vacuum', 'Appliances', 699.99, 7, 'SKU-014', 'Cordless vacuum with laser dust detection'],
    ['Canon EOS R50 Camera', 'Electronics', 679.99, 10, 'SKU-015', 'Mirrorless camera with 24.2 MP sensor'],
    ['Protein Powder Whey', 'Health', 49.99, 80, 'SKU-016', 'Chocolate flavored whey protein, 2.27kg'],
    ['Kindle Paperwhite', 'Electronics', 139.99, 28, 'SKU-017', 'E-reader with 6.8" display and adjustable warm light'],
    ['Cast Iron Skillet 12"', 'Kitchen', 39.99, 50, 'SKU-018', 'Pre-seasoned cast iron skillet for even heat distribution'],
    ['Resistance Bands Set', 'Sports', 24.99, 90, 'SKU-019', 'Set of 5 resistance bands for home workouts'],
    ['Scented Candle Collection', 'Home Decor', 29.99, 70, 'SKU-020', 'Set of 3 soy wax scented candles, 40-hour burn time'],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(...item);
  });
  insertMany(products);
}

module.exports = db;
