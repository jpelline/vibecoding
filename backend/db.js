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
    ['Whiskas Adult Chicken Pouches', 'Wet Food', 12.99, 120, 'SKU-001', 'Tender chicken chunks in jelly, 12 x 100g pouches'],
    ['Felix As Good As It Looks Variety', 'Wet Food', 14.49, 95, 'SKU-002', 'Mixed variety pack with fish & meat, 24 x 85g'],
    ['Royal Canin Indoor Adult Dry', 'Dry Food', 24.99, 60, 'SKU-003', 'Complete dry food for indoor cats, 2kg bag'],
    ['Hills Science Diet Kitten', 'Dry Food', 29.99, 45, 'SKU-004', 'Optimal nutrition for kittens up to 12 months, 1.58kg'],
    ['Purina ONE Adult Salmon & Tuna', 'Dry Food', 19.99, 75, 'SKU-005', 'High protein dry food with real salmon, 1.5kg'],
    ['Sheba Perfect Portions Pâté', 'Wet Food', 9.99, 140, 'SKU-006', 'Twin-tray pâté in chicken & turkey flavours, 12 x 37.5g'],
    ['Iams Proactive Health Senior', 'Dry Food', 22.49, 38, 'SKU-007', 'Specially formulated for cats 7+ years, 1.5kg'],
    ['Lily\'s Kitchen Organic Chicken', 'Wet Food', 17.99, 50, 'SKU-008', 'Organic chicken recipe with superfoods, 6 x 85g'],
    ['Applaws Tuna & Mackerel Cans', 'Wet Food', 13.49, 80, 'SKU-009', 'Natural high-protein tuna with mackerel, 12 x 70g'],
    ['Orijen Cat & Kitten Dry', 'Dry Food', 39.99, 30, 'SKU-010', 'Biologically appropriate dry food, 85% animal ingredients, 1.8kg'],
    ['Dreamies Chicken Cat Treats', 'Treats', 3.49, 200, 'SKU-011', 'Crunchy treats with a soft centre, chicken flavour, 60g'],
    ['Temptations Tasty Chicken Mix', 'Treats', 4.99, 180, 'SKU-012', 'Low-calorie treats, chicken & dairy mix, 85g'],
    ['GimCat Malt Soft Paste', 'Health', 6.49, 90, 'SKU-013', 'Hairball prevention malt paste, 50g tube'],
    ['Beaphar Cat Milk', 'Health', 5.99, 70, 'SKU-014', 'Lactose-free milk specially formulated for cats, 200ml'],
    ['Zylkene Calming Supplement', 'Health', 18.99, 40, 'SKU-015', 'Natural calming capsules for stressed cats, 30 x 75mg'],
    ['Catit Drinking Fountain', 'Accessories', 34.99, 25, 'SKU-016', 'Triple-action filter fountain, 2L capacity'],
    ['Trixie Cat Puzzle Feeder', 'Accessories', 12.99, 55, 'SKU-017', 'Interactive slow-feed puzzle bowl for mental stimulation'],
    ['Royal Canin Digestive Care', 'Speciality', 32.99, 35, 'SKU-018', 'Veterinary formula for sensitive digestion, 2kg'],
    ['Purina Pro Plan Urinary Health', 'Speciality', 27.99, 42, 'SKU-019', 'Supports urinary tract health, chicken flavour, 1.5kg'],
    ['Hills Prescription Diet Renal', 'Speciality', 44.99, 20, 'SKU-020', 'Veterinary diet for cats with kidney disease, 1.5kg'],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(...item);
  });
  insertMany(products);
}

module.exports = db;
