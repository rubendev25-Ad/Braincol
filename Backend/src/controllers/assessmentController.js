const { supabase } = require('../config/database');

// Guardar evaluación inicial del usuario
const saveInitialAssessment = async (req, res) => {
  try {
    const { answers, completedAt } = req.body;
    const userId = req.user.id; // Viene del middleware de autenticación

    console.log('📝 Guardando evaluación inicial para usuario:', userId);
    console.log('📊 Respuestas recibidas:', answers);

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Las respuestas son requeridas'
      });
    }

    // Intentar guardar en tabla initial_assessments (si existe)
    const { data: assessment, error: insertError } = await supabase
      .from('initial_assessments')
      .upsert({
        user_id: userId,
        answers: answers,
        completed_at: completedAt || new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (insertError) {
      console.log('⚠️  Tabla initial_assessments no existe, usando solución alternativa');
      console.log('   Error:', insertError.message);
      
      // Solución alternativa: guardar en un campo de la tabla users
      const { error: updateError } = await supabase
        .from('users')
        .update({
          // Nota: Necesitarás agregar estas columnas a la tabla users si no existen
          initial_assessment_answers: answers,
          initial_assessment_completed_at: completedAt || new Date().toISOString(),
          actualizado_en: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Error al guardar evaluación:', updateError);
        throw new Error('No se pudo guardar la evaluación. Por favor contacta al administrador.');
      }

      return res.status(201).json({
        success: true,
        message: 'Evaluación inicial guardada exitosamente',
        data: {
          assessment: {
            userId,
            answers,
            completedAt: completedAt || new Date().toISOString()
          }
        }
      });
    }

    console.log('✅ Evaluación guardada exitosamente');

    res.status(201).json({
      success: true,
      message: 'Evaluación inicial guardada exitosamente',
      data: {
        assessment
      }
    });
  } catch (error) {
    console.error('Error al guardar evaluación inicial:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar la evaluación inicial',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener la evaluación inicial de un usuario
const getInitialAssessment = async (req, res) => {
  try {
    const userId = req.user.id;

    // Intentar obtener de tabla initial_assessments
    const { data: assessment, error } = await supabase
      .from('initial_assessments')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Solución alternativa: obtener de tabla users
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('initial_assessment_answers, initial_assessment_completed_at')
        .eq('id', userId)
        .single();

      if (userError || !user?.initial_assessment_answers) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró evaluación inicial para este usuario'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          assessment: {
            userId,
            answers: user.initial_assessment_answers,
            completedAt: user.initial_assessment_completed_at
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        assessment
      }
    });
  } catch (error) {
    console.error('Error al obtener evaluación inicial:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la evaluación inicial',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Actualizar evaluación inicial
const updateInitialAssessment = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Las respuestas son requeridas'
      });
    }

    // Intentar actualizar en tabla initial_assessments
    const { data: updatedAssessment, error } = await supabase
      .from('initial_assessments')
      .update({
        answers,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      // Solución alternativa: actualizar en tabla users
      const { error: updateError } = await supabase
        .from('users')
        .update({
          initial_assessment_answers: answers,
          actualizado_en: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró evaluación inicial para actualizar'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Evaluación actualizada exitosamente',
        data: {
          assessment: {
            userId,
            answers,
            updatedAt: new Date().toISOString()
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Evaluación actualizada exitosamente',
      data: {
        assessment: updatedAssessment
      }
    });
  } catch (error) {
    console.error('Error al actualizar evaluación inicial:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la evaluación inicial',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  saveInitialAssessment,
  getInitialAssessment,
  updateInitialAssessment
};
