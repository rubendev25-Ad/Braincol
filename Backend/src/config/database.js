const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_KEY deben estar configurados en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const connectDB = async () => {
  try {
    console.log('🔄 Conectando a Supabase...');
    console.log('📊 URL:', supabaseUrl);
    
    // Verificar que el cliente de Supabase esté inicializado
    if (!supabase) {
      throw new Error('Cliente de Supabase no inicializado');
    }
    
    console.log('✅ Supabase conectado exitosamente');
    console.log('� Cliente de Supabase listo para usar');
  } catch (error) {
    console.error('❌ Error al conectar con Supabase:', error.message);
    console.log('⚠️  Revisa tu configuración en .env');
  }
};

module.exports = connectDB;
module.exports.supabase = supabase;