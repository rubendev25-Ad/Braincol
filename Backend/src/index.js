const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Brainsure Cuidadores API',
    version: '1.0.0',
    status: 'running'
  });
});

// Rutas de autenticación
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // TODO: Implementar lógica de autenticación
  res.json({ 
    message: 'Login endpoint',
    email: email
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // TODO: Implementar lógica de registro
  res.json({ 
    message: 'Register endpoint',
    email: email
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  
  // TODO: Implementar lógica de recuperación de contraseña
  res.json({ 
    message: 'Forgot password endpoint',
    email: email
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
