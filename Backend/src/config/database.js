const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Cliente de Supabase con service_role_key para bypass RLS
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_KEY deben estar configurados en .env');
  process.exit(1);
}

// Usar service_role_key para operaciones del backend (bypass RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const connectDB = async () => {
  try {
    console.log('🔄 Conectando a Supabase...');
    console.log('📊 URL:', supabaseUrl);
    console.log('🔑 Usando service_role_key (bypass RLS)');
    
    // Verificar que el cliente de Supabase esté inicializado
    if (!supabase) {
      throw new Error('Cliente de Supabase no inicializado');
    }
    
    console.log('✅ Supabase conectado exitosamente');
    console.log('🔓 Cliente de Supabase listo para usar');
  } catch (error) {
    console.error('❌ Error al conectar con Supabase:', error.message);
    console.log('⚠️  Revisa tu configuración en .env');
  }
};

module.exports = connectDB;
module.exports.supabase = supabase;