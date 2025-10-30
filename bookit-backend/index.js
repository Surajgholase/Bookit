const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Import Routes ---
const experienceRoutes = require('./routes/experienceRoutes');
const promoRoutes = require('./routes/promoRoutes');     // 1. ADD THIS IMPORT
const bookingRoutes = require('./routes/bookingRoutes');   // 2. ADD THIS IMPORT

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
// ... (your db connection code is here) ...
// Use the new password you just created
const dbURI = "mongodb+srv://surajgholase41:testing123@cluster0.6jfa66q.mongodb.net/?appName=Cluster0";
mongoose.connect(dbURI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Database connection error:', err));


// --- API ROUTES ---
app.use('/experiences', experienceRoutes);
app.use('/promo', promoRoutes);       // 3. ADD THIS LINE
app.use('/bookings', bookingRoutes);  // 4. ADD THIS LINE

// --- Basic Test Route ---
// ... (your app.get('/') code is here) ...
app.get('/', (req, res) => {
  res.send('BookIt API is running!');
});

// --- Start the Server ---
// ... (your app.listen code is here) ...
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});