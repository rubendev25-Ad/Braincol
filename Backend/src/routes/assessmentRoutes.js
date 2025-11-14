const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de evaluación inicial
router.post('/initial', assessmentController.saveInitialAssessment);
router.get('/initial', assessmentController.getInitialAssessment);
router.put('/initial', assessmentController.updateInitialAssessment);

module.exports = router;
