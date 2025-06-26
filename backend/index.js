const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS config
app.use(cors({
  origin: 'https://3.110.221.225',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.options('*', cors()); // <--- IMPORTANT for preflight

app.use(express.json());

// Routes
const authRoutes = require('./routes/routes');
app.use('/api', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
