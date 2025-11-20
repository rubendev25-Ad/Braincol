const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');
const { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/emailService');
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
    const { nombre, apellido, correo, telefono, fecha_nacimiento, genero, contraseña, rol } = req.body;

    // Validaciones básicas
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, correo y contraseña son obligatorios'
      });
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('correo', correo.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El correo ya está registrado'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Generar código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Crear usuario en Supabase
    console.log('💾 Intentando guardar usuario en Supabase...');
    console.log('📝 Datos a guardar:', {
      nombre,
      apellido,
      correo: correo.toLowerCase(),
      telefono,
      fecha_nacimiento,
      genero,
      rol: rol || 'familia',
      activo: false
    });

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          nombre,
          apellido,
          correo: correo.toLowerCase(),
          telefono,
          fecha_nacimiento,
          genero,
          contraseña: hashedPassword,
          rol: rol || 'familia',
          activo: false,
          ID_de_autenticación: verificationCode,
          codigo_expira: codeExpiry.toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error al crear usuario en Supabase:', error);
      console.error('📋 Detalles del error:', JSON.stringify(error, null, 2));
      return res.status(500).json({
        success: false,
        message: 'Error al crear usuario',
        error: error.message
      });
    }

    console.log('✅ Usuario guardado en Supabase:', newUser);

    // Enviar email de verificación
    await sendVerificationEmail(correo, verificationCode);

    // Enviar email de bienvenida
    console.log('📧 Intentando enviar correo a:', correo);
    await sendWelcomeEmail(correo, nombre);
    console.log('✅ Correo enviado exitosamente');

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Por favor verifica tu correo.',
      data: {
        identificación: newUser.identificación,
        nombre: newUser.nombre,
        correo: newUser.correo,
        rol: newUser.rol
      }
    });
  } catch (error) {
    console.error('❌ Error en register:', error);
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
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son obligatorios'
      });
    }

    // Buscar usuario
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('correo', correo.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si la cuenta está activa
    if (!user.activo) {
      return res.status(403).json({
        success: false,
        message: 'Por favor verifica tu correo antes de iniciar sesión'
      });
    }

    // Generar token
    const token = generateToken(user.identificación);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          identificación: user.identificación,
          nombre: user.nombre,
          apellido: user.apellido,
          correo: user.correo,
          rol: user.rol
        }
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

// Verificar correo
const verifyEmail = async (req, res) => {
  try {
    const { correo, codigo } = req.body;

    if (!correo || !codigo) {
      return res.status(400).json({
        success: false,
        message: 'Correo y código son obligatorios'
      });
    }

    // Buscar usuario
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('correo', correo.toLowerCase())
      .eq('ID_de_autenticación', codigo)
      .single();

    if (error || !user) {
      return res.status(400).json({
        success: false,
        message: 'Código de verificación inválido'
      });
    }

    // Verificar si el código ha expirado
    if (new Date() > new Date(user.codigo_expira)) {
      return res.status(400).json({
        success: false,
        message: 'El código de verificación ha expirado'
      });
    }

    // Activar usuario
    const { error: updateError } = await supabase
      .from('users')
      .update({
        activo: true,
        ID_de_autenticación: null,
        codigo_expira: null
      })
      .eq('identificación', user.identificación);

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar correo',
        error: updateError.message
      });
    }

    // Generar token
    const token = generateToken(user.identificación);

    res.json({
      success: true,
      message: 'Correo verificado exitosamente',
      data: {
        token,
        user: {
          identificación: user.identificación,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol
        }
      }
    });
  } catch (error) {
    console.error('Error en verifyEmail:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar correo',
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
  getProfile,
  verifyEmail
};