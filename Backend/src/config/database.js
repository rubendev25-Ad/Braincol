// Conexión a base de datos
// Por ahora usamos almacenamiento en memoria
// Cuando tengas credenciales de Supabase, se integrará aquí

const connectDB = async () => {
  console.log(`
    ========================================
    💾 BASE DE DATOS
    ========================================
    Modo: Almacenamiento en memoria (temporal)
    
    ⚠️  Los datos se perderán al reiniciar el servidor
    
    ✅ Cuando tengas credenciales de Supabase:
       - Actualiza SUPABASE_URL y SUPABASE_KEY en .env
       - Los datos se persistirán en la nube
    ========================================
  `);
};

module.exports = connectDB;