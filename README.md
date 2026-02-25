# PurrStock — Cat Food Inventory Manager

A modern inventory management web app built for a cat food retail company.

## Features

- 📦 Browse all cat food products with search and category filtering
- ➕ Add new products via a clean modal form
- 🗑 Delete products with a two-step confirmation
- 🔢 Adjust stock quantities with +/– controls
- 🚨 Visual low-stock and out-of-stock indicators
- 🐱 Cat food themed UI with orange accent branding

## Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend  | Node.js, Express            |
| Database | SQLite (via better-sqlite3) |

## Getting Started

### 1. Install & start the backend

```bash
cd backend
npm install
npm start
```

The API server runs on **http://localhost:3001**.  
On first start it seeds the database with **20 cat food products**.

### 2. Install & start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Product Categories

| Category    | Description                             |
|-------------|-----------------------------------------|
| Wet Food    | Pouches, cans and trays                 |
| Dry Food    | Kibble and complete dry diets           |
| Treats      | Snacks and reward treats                |
| Health      | Supplements, pastes, and special milks  |
| Accessories | Bowls, fountains, and feeders           |
| Speciality  | Veterinary and prescription diets       |

## API Endpoints

| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | `/api/products`                 | List products (+ search/filter) |
| GET    | `/api/products/:id`             | Get a single product    |
| POST   | `/api/products`                 | Create a product        |
| PATCH  | `/api/products/:id/quantity`    | Update stock quantity   |
| PUT    | `/api/products/:id`             | Full product update     |
| DELETE | `/api/products/:id`             | Delete a product        |
| GET    | `/api/categories`               | List all categories     |
