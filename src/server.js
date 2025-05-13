const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Ajout de la gestion CORS
const enhanceRoutes = require('./routes/enhanceRoutes');
const suggestionsRoutes = require('./routes/suggestionsRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

dotenv.config();

const app = express();

// Enable CORS for all routes and origins 
app.use(cors());  

// Global Middlewares
app.use(express.json());

// API Routes
app.use('/api/enhance', enhanceRoutes);
app.use('/api/suggestions', suggestionsRoutes);

// Error Handling Middleware (always after routes)
app.use(errorHandler);

console.log('IA_API_URL:', process.env.IA_API_URL);
console.log('IA_API_KEY:', process.env.IA_API_KEY);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
