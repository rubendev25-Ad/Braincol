const bcrypt = require('bcrypt');
const inMemoryDB = require('../config/inMemoryDB');

// Clase User para manejar operaciones de usuario
// Temporalmente usa almacenamiento en memoria
// Se migrará a Supabase cuando tengas las credenciales

class User {
  constructor(data) {
    this.id = data.id;
    this.fullName = data.fullName;
    this.email = data.email;
    this.password = data.password;
    this.isVerified = data.isVerified || false;
    this.profileImage = data.profileImage || null;
    this.role = data.role || 'cuidador';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Crear nuevo usuario
  static async create(userData) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = await inMemoryDB.createUser({
      fullName: userData.fullName,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      role: userData.role || 'cuidador'
    });

    return new User(user);
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const user = await inMemoryDB.findUserByEmail(email);
    return user ? new User(user) : null;
  }

  // Buscar usuario por ID
  static async findById(userId) {
    const user = await inMemoryDB.findUserById(userId);
    return user ? new User(user) : null;
  }

  // Comparar contraseña
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Generar código de verificación
  async generateVerificationCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos
    
    await inMemoryDB.saveVerificationCode(this.email, code, expiresAt);
    return code;
  }

  // Verificar código de verificación
  static async verifyCode(email, code) {
    const storedCode = await inMemoryDB.getVerificationCode(email);
    
    if (!storedCode) return { valid: false, message: 'Código no encontrado' };
    if (storedCode.code !== code) return { valid: false, message: 'Código inválido' };
    if (storedCode.expiresAt < Date.now()) return { valid: false, message: 'Código expirado' };
    
    await inMemoryDB.deleteVerificationCode(email);
    return { valid: true };
  }

  // Actualizar usuario
  async update(updates) {
    // Si se actualiza la contraseña, hashearla
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await inMemoryDB.updateUser(this.id, updates);
    if (updatedUser) {
      Object.assign(this, updatedUser);
    }
    return this;
  }

  // Guardar código de recuperación de contraseña
  static async saveResetCode(email, code) {
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutos
    await inMemoryDB.saveResetCode(email, code, expiresAt);
  }

  // Verificar código de recuperación
  static async verifyResetCode(email, code) {
    const storedCode = await inMemoryDB.getResetCode(email);
    
    if (!storedCode) return { valid: false, message: 'Código no encontrado' };
    if (storedCode.code !== code) return { valid: false, message: 'Código inválido' };
    if (storedCode.expiresAt < Date.now()) return { valid: false, message: 'Código expirado' };
    
    await inMemoryDB.deleteResetCode(email);
    return { valid: true };
  }

  // Limpiar datos sensibles para enviar al cliente
  toJSON() {
    const obj = { ...this };
    delete obj.password;
    return obj;
  }
}

module.exports = User;