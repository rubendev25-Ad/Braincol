const { supabase } = require('../config/database');

// Actualizar perfil de usuario autenticado
exports.updateProfile = async (req, res) => {
  try {
    console.log('PUT /api/user/profile llamado');
    console.log('Body recibido:', req.body);
    console.log('Usuario autenticado:', req.user);

    const userId = req.user.id;
    const { nombre, apellido, telefono, direccion } = req.body;

    // Validación básica
    if (!nombre || !apellido) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y apellido son obligatorios'
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({
        nombre,
        apellido,
        telefono: telefono || null,
        direccion: direccion || null,
        actualizado_en: new Date().toISOString()
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (error || !user) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo actualizar el perfil',
        error: error?.message
      });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          correo: user.correo,
          rol: user.rol,
          telefono: user.telefono,
          direccion: user.direccion,
          foto_perfil: user.foto_perfil || null,
          activo: user.activo
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: err.message
    });
  }
};
