require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect to MongoDB
connectDB();

// ── Middleware ────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── API Routes (versioned) ────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);

// ── Swagger Docs ──────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'TaskFlow API Docs',
}));

// ── Health Check ──────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'Server is running',
    version: 'v1',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ───────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📄 API Docs:    http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health:      http://localhost:${PORT}/health`);
});

module.exports = app;