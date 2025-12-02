const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No se proporcionó token de autenticación' 
      });
    }

    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario en Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    if (!user.activo) {
      return res.status(403).json({ 
        success: false,
        message: 'Por favor verifica tu cuenta' 
      });
    }

    // Agregar usuario al request (formato normalizado)
    req.user = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.rol,
      activo: user.activo
    };
    req.token = token;
    next();
  } catch (error) {
    console.error('Error en auth middleware:', error);
    res.status(401).json({ 
      success: false,
      message: 'Token inválido o expirado' 
    });
  }
};

module.exports = auth;