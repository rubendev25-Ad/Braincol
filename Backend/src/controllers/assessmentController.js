const inMemoryDB = require('../config/inMemoryDB');

// Guardar evaluación inicial del usuario
const saveInitialAssessment = async (req, res) => {
  try {
    const { answers, completedAt } = req.body;
    const userId = req.user.id; // Viene del middleware de autenticación

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Las respuestas son requeridas'
      });
    }

    // Validar que se respondieron todas las preguntas requeridas
    const requiredQuestions = ['emotional_wellbeing', 'stress_level', 'support_resources'];
    const missingQuestions = requiredQuestions.filter(q => !answers[q]);

    if (missingQuestions.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Faltan respuestas requeridas',
        missingQuestions
      });
    }

    // Guardar la evaluación
    const assessment = await inMemoryDB.saveInitialAssessment({
      userId,
      answers,
      completedAt: completedAt || new Date().toISOString()
    });

    // Actualizar el usuario para marcar que completó la evaluación
    await inMemoryDB.updateUser(userId, {
      hasCompletedInitialAssessment: true,
      initialAssessmentDate: new Date().toISOString()
    });

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

    const assessment = await inMemoryDB.getInitialAssessment(userId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró evaluación inicial para este usuario'
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

    const updatedAssessment = await inMemoryDB.updateInitialAssessment(userId, {
      answers,
      updatedAt: new Date().toISOString()
    });

    if (!updatedAssessment) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró evaluación inicial para actualizar'
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
