const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const candidateRoutes = require('./routes/candidateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/candidates', candidateRoutes);

// MongoDB connection
console.log('--- DEBUG INFO ---');
console.log('Attempting to connect to MongoDB...');
// Print the first 20 characters of the URI to verify it's not localhost or undefined (while hiding the password)
const maskedUri = process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'UNDEFINED!';
console.log('Using MONGO_URI starting with:', maskedUri);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB Successfully Connected!'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
