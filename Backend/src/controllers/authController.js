const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const { validateEmail, validatePassword, validateFullName } = require('../utils/validators');

// Generar JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Registro
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validaciones
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (!validateFullName(fullName)) {
      return res.status(400).json({
        success: false,
        message: 'El nombre debe tener al menos 3 caracteres'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está registrado'
      });
    }

    // Crear usuario
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password
    });

    // Generar código de verificación
    const verificationCode = await user.generateVerificationCode();

    // Enviar email de verificación
    await sendVerificationEmail(user.email, verificationCode);

    // Generar token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
      data: {
        user: user.toJSON(),
        token,
        needsVerification: true
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está verificado
    if (!user.isVerified) {
      // Generar nuevo código y enviarlo
      const verificationCode = await user.generateVerificationCode();
      await sendVerificationEmail(user.email, verificationCode);

      return res.status(403).json({
        success: false,
        message: 'Por favor verifica tu cuenta. Te hemos enviado un nuevo código.',
        needsVerification: true,
        email: user.email
      });
    }

    // Generar token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// Verificar código
const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email y código son requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar código
    const verification = await User.verifyCode(email, code);
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    // Actualizar usuario como verificado
    await user.update({ isVerified: true });

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Cuenta verificada exitosamente',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Error en verifyCode:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar código',
      error: error.message
    });
  }
};

// Reenviar código de verificación
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido'
      });
    }

    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Esta cuenta ya está verificada'
      });
    }

    const verificationCode = await user.generateVerificationCode();
    await sendVerificationEmail(user.email, verificationCode);

    res.status(200).json({
      success: true,
      message: 'Código de verificación reenviado'
    });

  } catch (error) {
    console.error('Error en resendVerificationCode:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reenviar código',
      error: error.message
    });
  }
};

// Recuperar contraseña (solicitar código)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido'
      });
    }

    const user = await User.findByEmail(email);
    
    if (!user) {
      // Por seguridad, no revelar si el email existe
      return res.status(200).json({
        success: true,
        message: 'Si el email existe, recibirás un código de recuperación'
      });
    }

    // Generar código de recuperación
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    await User.saveResetCode(user.email, resetCode);

    await sendPasswordResetEmail(user.email, resetCode);

    res.status(200).json({
      success: true,
      message: 'Si el email existe, recibirás un código de recuperación'
    });

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar solicitud',
      error: error.message
    });
  }
};

// Resetear contraseña con código
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;

    if (!email || !code || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden'
      });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Código de recuperación inválido'
      });
    }

    // Verificar código
    const verification = await User.verifyResetCode(email, code);
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    // Actualizar contraseña
    await user.update({ password: newPassword });

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al resetear contraseña',
      error: error.message
    });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  verifyCode,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  getProfile
};