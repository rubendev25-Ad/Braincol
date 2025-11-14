// Simulación de base de datos en memoria
// Esto será reemplazado por Supabase cuando tengas las credenciales

const users = new Map(); // Almacén temporal de usuarios
const verificationCodes = new Map(); // Códigos de verificación temporales
const resetCodes = new Map(); // Códigos de recuperación temporales
const initialAssessments = new Map(); // Evaluaciones iniciales

// Simulación de auto-incremento de IDs
let userIdCounter = 1;
let assessmentIdCounter = 1;

const inMemoryDB = {
  // Crear usuario
  createUser: async (userData) => {
    const userId = `user_${userIdCounter++}`;
    const user = {
      id: userId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.set(userId, user);
    return user;
  },

  // Buscar usuario por email
  findUserByEmail: async (email) => {
    for (const [id, user] of users.entries()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return { ...user, id };
      }
    }
    return null;
  },

  // Buscar usuario por ID
  findUserById: async (userId) => {
    return users.get(userId) || null;
  },

  // Actualizar usuario
  updateUser: async (userId, updates) => {
    const user = users.get(userId);
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    users.set(userId, updatedUser);
    return updatedUser;
  },

  // Guardar código de verificación
  saveVerificationCode: async (email, code, expiresAt) => {
    verificationCodes.set(email.toLowerCase(), {
      code,
      expiresAt
    });
  },

  // Obtener código de verificación
  getVerificationCode: async (email) => {
    return verificationCodes.get(email.toLowerCase()) || null;
  },

  // Eliminar código de verificación
  deleteVerificationCode: async (email) => {
    verificationCodes.delete(email.toLowerCase());
  },

  // Guardar código de recuperación
  saveResetCode: async (email, code, expiresAt) => {
    resetCodes.set(email.toLowerCase(), {
      code,
      expiresAt
    });
  },

  // Obtener código de recuperación
  getResetCode: async (email) => {
    return resetCodes.get(email.toLowerCase()) || null;
  },

  // Eliminar código de recuperación
  deleteResetCode: async (email) => {
    resetCodes.delete(email.toLowerCase());
  },

  // Guardar evaluación inicial
  saveInitialAssessment: async (assessmentData) => {
    const assessmentId = `assessment_${assessmentIdCounter++}`;
    const assessment = {
      id: assessmentId,
      ...assessmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    initialAssessments.set(assessmentData.userId, assessment);
    return assessment;
  },

  // Obtener evaluación inicial por userId
  getInitialAssessment: async (userId) => {
    return initialAssessments.get(userId) || null;
  },

  // Actualizar evaluación inicial
  updateInitialAssessment: async (userId, updates) => {
    const assessment = initialAssessments.get(userId);
    if (!assessment) return null;
    
    const updatedAssessment = {
      ...assessment,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    initialAssessments.set(userId, updatedAssessment);
    return updatedAssessment;
  },

  // Utilidad: Listar todos los usuarios (solo para debug)
  getAllUsers: () => {
    return Array.from(users.values());
  },

  // Utilidad: Limpiar base de datos (solo para testing)
  clearAll: () => {
    users.clear();
    verificationCodes.clear();
    resetCodes.clear();
    initialAssessments.clear();
    userIdCounter = 1;
    assessmentIdCounter = 1;
  }
};

module.exports = inMemoryDB;