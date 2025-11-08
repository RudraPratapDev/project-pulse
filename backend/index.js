require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const globalErrorHandler = require('./middleware/globalErrorHandler');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Project Pulse API'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/summary', summaryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler (must be last)
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Project Pulse Backend running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`🔐 JWT_SECRET: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Missing'}`);
  console.log(`🔑 INTERNAL_API_KEY: ${process.env.INTERNAL_API_KEY ? '✓ Set' : '✗ Missing'}`);
});
