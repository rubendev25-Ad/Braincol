const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔍 Verificando conexión a MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/brainsure');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brainsure', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ MongoDB conectado exitosamente!');
    console.log('📊 Base de datos:', conn.connection.name);
    console.log('🌐 Host:', conn.connection.host);
    console.log('🔢 Puerto:', conn.connection.port);
    
    // Listar colecciones existentes
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📁 Colecciones:', collections.length > 0 ? collections.map(c => c.name).join(', ') : 'Ninguna (base de datos vacía)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:');
    console.error('📝 Mensaje:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n💡 Posibles soluciones:');
      console.error('1. Verifica que MongoDB esté corriendo: mongod');
      console.error('2. Verifica la URI en el archivo .env');
      console.error('3. Si usas MongoDB Atlas, verifica tu IP en whitelist');
      console.error('4. Verifica tu usuario y contraseña de MongoDB');
    }
    
    process.exit(1);
  }
};

testConnection();