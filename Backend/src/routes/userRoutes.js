const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { supabase } = require('../config/database');
const bcrypt = require('bcryptjs');

// Actualizar perfil de usuario
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, apellido, telefono, direccion } = req.body;

    // Validaciones básicas
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es obligatorio'
      });
    }

    // Actualizar usuario en Supabase
    const { data, error } = await supabase
      .from('users')
      .update({
        nombre,
        apellido,
        telefono,
        direccion,
        actualizado_en: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar perfil:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar el perfil'
      });
    }

    // Eliminar campos sensibles antes de enviar
    const { contraseña, ...userWithoutPassword } = data;

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Error en actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil',
      error: error.message
    });
  }
});

// Cambiar contraseña
router.put('/change-password', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validaciones
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual y la nueva son obligatorias'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Obtener usuario actual
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('contraseña')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    const { error: updateError } = await supabase
      .from('users')
      .update({
        contraseña: hashedPassword,
        actualizado_en: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error al actualizar contraseña:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Error al cambiar la contraseña'
      });
    }

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('Error en cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar la contraseña',
      error: error.message
    });
  }
});

module.exports = router;
