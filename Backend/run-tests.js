const axios = require('axios');

const baseUrl = 'http://localhost:3000';
let testResults = [];
let userToken = '';
let verificationCode = '';
let resetCode = '';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const statusColor = passed ? 'green' : 'red';
  log(`${status} - ${testName}`, statusColor);
  if (details) log(`   ${details}`, 'cyan');
  testResults.push({ test: testName, passed, details });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Verificar servidor
async function testServerRunning() {
  log('\n📡 Test 1: Verificar servidor corriendo...', 'yellow');
  try {
    const response = await axios.get(`${baseUrl}/`);
    const passed = response.status === 200 && response.data.status === 'running';
    logTest('Servidor respondiendo', passed, `Status: ${response.status}`);
    return passed;
  } catch (error) {
    logTest('Servidor respondiendo', false, `Error: ${error.message}`);
    return false;
  }
}

// Test 2: Registro de usuario
async function testRegister() {
  log('\n👤 Test 2: Registro de usuario...', 'yellow');
  try {
    const response = await axios.post(`${baseUrl}/api/auth/register`, {
      fullName: 'Juan Pérez Cuidador',
      email: 'juan.perez@test.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    const passed = response.status === 201 && response.data.success === true;
    if (passed && response.data.data.token) {
      userToken = response.data.data.token;
    }
    logTest('Registro de usuario', passed, `Usuario: ${response.data.data?.user?.email || 'N/A'}`);
    
    // Esperar un momento para el código
    await delay(500);
    log('⚠️  NOTA: Revisa la consola del servidor para copiar el código de verificación', 'yellow');
    
    return passed;
  } catch (error) {
    logTest('Registro de usuario', false, `Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 3: Registro con email duplicado (debe fallar)
async function testDuplicateEmail() {
  log('\n🔄 Test 3: Registro con email duplicado (debe fallar)...', 'yellow');
  try {
    await axios.post(`${baseUrl}/api/auth/register`, {
      fullName: 'Otro Usuario',
      email: 'juan.perez@test.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    logTest('Email duplicado rechazado', false, 'Debería haber fallado pero no lo hizo');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400 && 
                   error.response?.data?.message?.includes('ya está registrado');
    logTest('Email duplicado rechazado', passed, error.response?.data?.message);
    return passed;
  }
}

// Test 4: Validación de email inválido
async function testInvalidEmail() {
  log('\n📧 Test 4: Validación de email inválido...', 'yellow');
  try {
    await axios.post(`${baseUrl}/api/auth/register`, {
      fullName: 'Test User',
      email: 'email-invalido',
      password: 'password123',
      confirmPassword: 'password123'
    });
    logTest('Email inválido rechazado', false, 'Debería haber fallado');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400 && 
                   error.response?.data?.message?.includes('inválido');
    logTest('Email inválido rechazado', passed, error.response?.data?.message);
    return passed;
  }
}

// Test 5: Contraseña muy corta
async function testShortPassword() {
  log('\n🔒 Test 5: Contraseña muy corta (debe fallar)...', 'yellow');
  try {
    await axios.post(`${baseUrl}/api/auth/register`, {
      fullName: 'Test User',
      email: 'test@test.com',
      password: '123',
      confirmPassword: '123'
    });
    logTest('Contraseña corta rechazada', false, 'Debería haber fallado');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400 && 
                   error.response?.data?.message?.includes('6 caracteres');
    logTest('Contraseña corta rechazada', passed, error.response?.data?.message);
    return passed;
  }
}

// Test 6: Contraseñas no coinciden
async function testPasswordMismatch() {
  log('\n🔐 Test 6: Contraseñas no coinciden (debe fallar)...', 'yellow');
  try {
    await axios.post(`${baseUrl}/api/auth/register`, {
      fullName: 'Test User',
      email: 'test2@test.com',
      password: 'password123',
      confirmPassword: 'password456'
    });
    logTest('Contraseñas no coinciden rechazado', false, 'Debería haber fallado');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400 && 
                   error.response?.data?.message?.includes('no coinciden');
    logTest('Contraseñas no coinciden rechazado', passed, error.response?.data?.message);
    return passed;
  }
}

// Test 7: Login sin verificar (debe fallar)
async function testLoginUnverified() {
  log('\n🚫 Test 7: Login sin verificar cuenta (debe fallar)...', 'yellow');
  try {
    const response = await axios.post(`${baseUrl}/api/auth/login`, {
      email: 'juan.perez@test.com',
      password: 'password123'
    });
    logTest('Login sin verificar bloqueado', false, 'Debería requerir verificación');
    return false;
  } catch (error) {
    const passed = error.response?.status === 403 && 
                   error.response?.data?.needsVerification === true;
    logTest('Login sin verificar bloqueado', passed, error.response?.data?.message);
    return passed;
  }
}

// Test 8: Verificar con código incorrecto
async function testWrongVerificationCode() {
  log('\n❌ Test 8: Verificación con código incorrecto (debe fallar)...', 'yellow');
  try {
    await axios.post(`${baseUrl}/api/auth/verify`, {
      email: 'juan.perez@test.com',
      code: '000000'
    });
    logTest('Código incorrecto rechazado', false, 'Debería haber fallado');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400;
    logTest('Código incorrecto rechazado', passed, error.response?.data?.message);
    return passed;
  }
}

// Test 9: Reenviar código de verificación
async function testResendCode() {
  log('\n📨 Test 9: Reenviar código de verificación...', 'yellow');
  try {
    const response = await axios.post(`${baseUrl}/api/auth/resend-code`, {
      email: 'juan.perez@test.com'
    });
    const passed = response.status === 200 && response.data.success === true;
    logTest('Reenvío de código', passed, response.data.message);
    await delay(500);
    log('⚠️  NOTA: Revisa la consola del servidor para el NUEVO código', 'yellow');
    return passed;
  } catch (error) {
    logTest('Reenvío de código', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 10: Login con credenciales incorrectas
async function testWrongCredentials() {
  log('\n🔑 Test 10: Login con contraseña incorrecta (debe fallar)...', 'yellow');
  
  // Primero, registrar y verificar un usuario de prueba
  try {
    await axios.post(`${baseUrl}/api/auth/register`, {
      fullName: 'Test Login User',
      email: 'testlogin@test.com',
      password: 'correctpassword',
      confirmPassword: 'correctpassword'
    });
    await delay(500);
  } catch (error) {
    // Usuario ya existe, continuar
  }

  try {
    await axios.post(`${baseUrl}/api/auth/login`, {
      email: 'testlogin@test.com',
      password: 'wrongpassword'
    });
    logTest('Credenciales incorrectas rechazadas', false, 'Debería haber fallado');
    return false;
  } catch (error) {
    const passed = error.response?.status === 401 && 
                   error.response?.data?.message?.includes('inválidas');
    logTest('Credenciales incorrectas rechazadas', passed, error.response?.data?.message);
    return passed;
  }
}

// Test 11: Acceder sin token
async function testNoToken() {
  log('\n🔓 Test 11: Acceder a perfil sin token (debe fallar)...', 'yellow');
  try {
    await axios.get(`${baseUrl}/api/auth/profile`);
    logTest('Acceso sin token bloqueado', false, 'Debería requerir token');
    return false;
  } catch (error) {
    const passed = error.response?.status === 401;
    logTest('Acceso sin token bloqueado', passed, error.response?.data?.message);
    return passed;
  }
}

// Test 12: Token inválido
async function testInvalidToken() {
  log('\n🎫 Test 12: Acceder con token inválido (debe fallar)...', 'yellow');
  try {
    await axios.get(`${baseUrl}/api/auth/profile`, {
      headers: { Authorization: 'Bearer token_invalido_12345' }
    });
    logTest('Token inválido rechazado', false, 'Debería haber fallado');
    return false;
  } catch (error) {
    const passed = error.response?.status === 401;
    logTest('Token inválido rechazado', passed, error.response?.data?.message);
    return passed;
  }
}

// Test Manual: Pedir código de verificación
async function testManualVerification() {
  log('\n\n' + '='.repeat(60), 'cyan');
  log('⚠️  PRUEBA MANUAL REQUERIDA', 'yellow');
  log('='.repeat(60), 'cyan');
  log('\n📋 Para completar las pruebas, necesitas:', 'yellow');
  log('1. Revisar la consola del servidor (donde ejecutaste npm run dev)', 'cyan');
  log('2. Buscar un recuadro como este:', 'cyan');
  log('   ========================================', 'blue');
  log('   📧 Email de Verificación', 'blue');
  log('   ========================================', 'blue');
  log('   Para: juan.perez@test.com', 'blue');
  log('   Código: 123456  ← ESTE CÓDIGO', 'green');
  log('   ========================================', 'blue');
  log('3. Copiar el código de 6 dígitos', 'cyan');
  log('4. Ejecutar este comando en otra terminal:\n', 'cyan');
  
  const curlCommand = `curl -X POST ${baseUrl}/api/auth/verify -H "Content-Type: application/json" -d "{\\"email\\":\\"juan.perez@test.com\\",\\"code\\":\\"TU_CODIGO_AQUI\\"}"`;
  log(curlCommand, 'green');
  
  log('\n5. Luego ejecutar para login:', 'cyan');
  const loginCommand = `curl -X POST ${baseUrl}/api/auth/login -H "Content-Type: application/json" -d "{\\"email\\":\\"juan.perez@test.com\\",\\"password\\":\\"password123\\"}"`;
  log(loginCommand, 'green');
  
  log('\n' + '='.repeat(60) + '\n', 'cyan');
}

// Resumen final
function printSummary() {
  log('\n\n' + '='.repeat(60), 'cyan');
  log('📊 RESUMEN DE PRUEBAS', 'yellow');
  log('='.repeat(60), 'cyan');
  
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  const total = testResults.length;
  
  log(`\n✅ Pasadas: ${passed}/${total}`, 'green');
  log(`❌ Fallidas: ${failed}/${total}`, failed > 0 ? 'red' : 'green');
  log(`📈 Porcentaje de éxito: ${Math.round((passed/total) * 100)}%`, 'cyan');
  
  if (failed > 0) {
    log('\n❌ Pruebas fallidas:', 'red');
    testResults.filter(r => !r.passed).forEach(r => {
      log(`   • ${r.test}: ${r.details}`, 'red');
    });
  }
  
  log('\n' + '='.repeat(60) + '\n', 'cyan');
}

// Ejecutar todas las pruebas
async function runAllTests() {
  log('\n🚀 INICIANDO SUITE DE PRUEBAS AUTOMATIZADAS', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');
  
  try {
    // Verificar que el servidor esté corriendo
    const serverRunning = await testServerRunning();
    if (!serverRunning) {
      log('\n❌ El servidor no está corriendo. Ejecuta: npm run dev', 'red');
      return;
    }
    
    // Ejecutar pruebas
    await testRegister();
    await delay(1000);
    
    await testDuplicateEmail();
    await delay(500);
    
    await testInvalidEmail();
    await delay(500);
    
    await testShortPassword();
    await delay(500);
    
    await testPasswordMismatch();
    await delay(500);
    
    await testLoginUnverified();
    await delay(500);
    
    await testWrongVerificationCode();
    await delay(500);
    
    await testResendCode();
    await delay(1000);
    
    await testWrongCredentials();
    await delay(500);
    
    await testNoToken();
    await delay(500);
    
    await testInvalidToken();
    await delay(500);
    
    // Mostrar instrucciones para prueba manual
    await testManualVerification();
    
    // Mostrar resumen
    printSummary();
    
    log('✅ Suite de pruebas completada\n', 'green');
    
  } catch (error) {
    log(`\n❌ Error fatal en las pruebas: ${error.message}`, 'red');
  }
}

// Ejecutar
runAllTests();