require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Brainsure Cuidadores API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      assessment: '/api/assessment',
      docs: '/api/docs'
    }
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de evaluación
app.use('/api/assessment', assessmentRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
    ========================================
    🚀 Servidor Brainsure Cuidadores
    ========================================
    🌐 URL: http://localhost:${PORT}
    📊 Entorno: ${process.env.NODE_ENV || 'development'}
    ⏰ Iniciado: ${new Date().toLocaleString()}
    ========================================
  `);
});

module.exports = app;
