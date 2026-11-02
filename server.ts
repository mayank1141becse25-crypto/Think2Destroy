import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory fallback dataset for server-side REST API
let serverListings = [
  {
    id: 'lot-srv-01',
    title: 'Clean Compressed HDPE Flakes',
    category: 'Plastic',
    subType: 'HDPE Flakes',
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 0.85,
    totalPrice: 425.0,
    currency: 'USD',
    location: 'District 4 Recycling Depot',
    city: 'Seattle',
    pincode: '98101',
    sellerName: 'Pacific Eco Materials',
    sellerPhone: '+1 (555) 349-2094',
    sellerEmail: 'supply@pacificeco.org',
    description: 'Post-industrial high-density polyethylene washed and shredded into 5mm flakes.',
    condition: 'Sorted & Cleaned',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
    isUserCreated: false,
    status: 'Available',
  },
];

let serverPickups = [
  {
    id: 'pk-srv-01',
    trackingId: 'W2W-PK-SERVER',
    fullName: 'Aditya Gupta',
    phone: '+1 (555) 782-3901',
    email: 'adityagupta8725@gmail.com',
    address: '742 Evergreen Terrace',
    city: 'Seattle',
    pincode: '98101',
    wasteCategory: 'E-waste',
    estimatedQuantityKg: 45,
    pickupDate: '2026-11-05',
    timeSlot: '10:00 AM - 01:00 PM',
    specialInstructions: 'Ground floor package station',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
];

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: process.env.DB_HOST ? 'connected (MySQL)' : 'standalone (memory/client sync)',
    version: '2.0.0',
  });
});

// 2. GET /api/listings
app.get('/api/listings', (req, res) => {
  res.json({ success: true, count: serverListings.length, data: serverListings });
});

// 3. POST /api/listings
app.post('/api/listings', (req, res) => {
  const newListing = {
    ...req.body,
    id: req.body.id || `lot-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Available',
  };
  serverListings.unshift(newListing);
  res.status(201).json({ success: true, listing: newListing });
});

// 4. GET /api/pickups
app.get('/api/pickups', (req, res) => {
  res.json({ success: true, count: serverPickups.length, data: serverPickups });
});

// 5. POST /api/pickups
app.post('/api/pickups', (req, res) => {
  const newPickup = {
    ...req.body,
    id: req.body.id || `pk-${Date.now()}`,
    trackingId: req.body.trackingId || `W2W-PK-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    status: 'Scheduled',
  };
  serverPickups.unshift(newPickup);
  res.status(201).json({ success: true, pickup: newPickup });
});

// Serve static build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Waste2Wealth backend server running on port ${PORT}`);
});

export default app;
