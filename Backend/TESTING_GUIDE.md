# 🧪 Guía de Pruebas del Backend

## 📋 Requisitos previos

1. **MongoDB instalado y corriendo**
   ```powershell
   # Si tienes MongoDB instalado localmente:
   mongod
   
   # O usa MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   # Actualiza MONGODB_URI en el archivo .env
   ```

2. **Dependencias instaladas**
   ```powershell
   cd Backend
   npm install
   ```

3. **Servidor corriendo**
   ```powershell
   npm run dev
   ```

## 🔧 Herramientas para hacer pruebas

### Opción 1: REST Client (VS Code Extension) ⭐ Recomendado
1. Instala la extensión "REST Client" en VS Code
2. Abre el archivo `Backend/tests.http`
3. Haz clic en "Send Request" encima de cada petición

### Opción 2: Thunder Client (VS Code Extension)
1. Instala la extensión "Thunder Client" en VS Code
2. Crea una nueva request y copia las peticiones del archivo `tests.http`

### Opción 3: Postman
1. Descarga Postman: https://www.postman.com/downloads/
2. Importa las peticiones del archivo `tests.http`

### Opción 4: cURL (Línea de comandos)
Copia los comandos de abajo en tu terminal.

## 🧪 Flujo de Pruebas Completo

### Paso 1: Verificar que el servidor está corriendo

**REST Client / Thunder Client:**
```http
GET http://localhost:3000
```

**cURL:**
```powershell
curl http://localhost:3000
```

**Resultado esperado:** ✅
```json
{
  "message": "Brainsure Cuidadores API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "auth": "/api/auth",
    "docs": "/api/docs"
  }
}
```

---

### Paso 2: Registrar un nuevo usuario

**REST Client / Thunder Client:**
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "fullName": "Juan Pérez Cuidador",
  "email": "juan.perez@test.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**cURL:**
```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"fullName\":\"Juan Pérez Cuidador\",\"email\":\"juan.perez@test.com\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}'
```

**Resultado esperado:** ✅
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente. Por favor verifica tu email.",
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Juan Pérez Cuidador",
      "email": "juan.perez@test.com",
      "isVerified": false,
      "role": "cuidador"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "needsVerification": true
  }
}
```

**⚠️ IMPORTANTE:** En la consola del servidor verás algo como:
```
========================================
📧 Email de Verificación
========================================
Para: juan.perez@test.com
Código: 123456
========================================
```

**Copia ese código de 6 dígitos** para el siguiente paso.

---

### Paso 3: Verificar la cuenta con el código

**REST Client / Thunder Client:**
```http
POST http://localhost:3000/api/auth/verify
Content-Type: application/json

{
  "email": "juan.perez@test.com",
  "code": "123456"
}
```

**cURL:**
```powershell
curl -X POST http://localhost:3000/api/auth/verify `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"juan.perez@test.com\",\"code\":\"123456\"}'
```

**Resultado esperado:** ✅
```json
{
  "success": true,
  "message": "Cuenta verificada exitosamente",
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Juan Pérez Cuidador",
      "email": "juan.perez@test.com",
      "isVerified": true,
      "role": "cuidador"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Paso 4: Iniciar sesión

**REST Client / Thunder Client:**
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan.perez@test.com",
  "password": "password123"
}
```

**cURL:**
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"juan.perez@test.com\",\"password\":\"password123\"}'
```

**Resultado esperado:** ✅
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Juan Pérez Cuidador",
      "email": "juan.perez@test.com",
      "isVerified": true,
      "role": "cuidador"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANTE:** **Copia el token** (todo el texto largo después de `"token": "`). Lo necesitarás para probar rutas protegidas.

---

### Paso 5: Obtener perfil del usuario (Ruta protegida)

**REST Client / Thunder Client:**
```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**cURL:**
```powershell
curl -X GET http://localhost:3000/api/auth/profile `
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Resultado esperado:** ✅
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Juan Pérez Cuidador",
      "email": "juan.perez@test.com",
      "isVerified": true,
      "role": "cuidador"
    }
  }
}
```

---

### Paso 6: Reenviar código de verificación

**REST Client / Thunder Client:**
```http
POST http://localhost:3000/api/auth/resend-code
Content-Type: application/json

{
  "email": "juan.perez@test.com"
}
```

**cURL:**
```powershell
curl -X POST http://localhost:3000/api/auth/resend-code `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"juan.perez@test.com\"}'
```

**Resultado esperado:** ✅
```json
{
  "success": true,
  "message": "Código de verificación reenviado"
}
```

---

### Paso 7: Recuperar contraseña

**REST Client / Thunder Client:**
```http
POST http://localhost:3000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "juan.perez@test.com"
}
```

**cURL:**
```powershell
curl -X POST http://localhost:3000/api/auth/forgot-password `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"juan.perez@test.com\"}'
```

**Resultado esperado:** ✅
```json
{
  "success": true,
  "message": "Si el email existe, recibirás un código de recuperación"
}
```

**En la consola verás:**
```
========================================
🔑 Email de Recuperación de Contraseña
========================================
Para: juan.perez@test.com
Código: 654321
========================================
```

---

### Paso 8: Resetear contraseña con código

**REST Client / Thunder Client:**
```http
POST http://localhost:3000/api/auth/reset-password
Content-Type: application/json

{
  "email": "juan.perez@test.com",
  "code": "654321",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**cURL:**
```powershell
curl -X POST http://localhost:3000/api/auth/reset-password `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"juan.perez@test.com\",\"code\":\"654321\",\"newPassword\":\"newpassword456\",\"confirmPassword\":\"newpassword456\"}'
```

**Resultado esperado:** ✅
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

---

### Paso 9: Login con nueva contraseña

**REST Client / Thunder Client:**
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan.perez@test.com",
  "password": "newpassword456"
}
```

**cURL:**
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"juan.perez@test.com\",\"password\":\"newpassword456\"}'
```

**Resultado esperado:** ✅
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {...},
    "token": "..."
  }
}
```

---

## 🚫 Pruebas de Validación (Casos de error)

### Error: Email inválido
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "email-invalido",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Resultado esperado:** ❌
```json
{
  "success": false,
  "message": "Email inválido"
}
```

---

### Error: Contraseña muy corta
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "test@test.com",
  "password": "123",
  "confirmPassword": "123"
}
```

**Resultado esperado:** ❌
```json
{
  "success": false,
  "message": "La contraseña debe tener al menos 6 caracteres"
}
```

---

### Error: Contraseñas no coinciden
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "test@test.com",
  "password": "password123",
  "confirmPassword": "password456"
}
```

**Resultado esperado:** ❌
```json
{
  "success": false,
  "message": "Las contraseñas no coinciden"
}
```

---

### Error: Email duplicado
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "fullName": "Otro Usuario",
  "email": "juan.perez@test.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Resultado esperado:** ❌
```json
{
  "success": false,
  "message": "Este email ya está registrado"
}
```

---

### Error: Credenciales incorrectas
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan.perez@test.com",
  "password": "contraseña_incorrecta"
}
```

**Resultado esperado:** ❌
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

### Error: Acceder sin token
```http
GET http://localhost:3000/api/auth/profile
```

**Resultado esperado:** ❌
```json
{
  "success": false,
  "message": "No se proporcionó token de autenticación"
}
```

---

### Error: Token inválido
```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer token_invalido_12345
```

**Resultado esperado:** ❌
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

---

## ✅ Checklist de Verificación

- [ ] Servidor inicia correctamente
- [ ] Conexión a MongoDB exitosa
- [ ] Registro de usuario funciona
- [ ] Código de verificación se muestra en consola
- [ ] Verificación de cuenta funciona
- [ ] Login funciona después de verificar
- [ ] Login falla si la cuenta no está verificada
- [ ] Token JWT se genera correctamente
- [ ] Ruta protegida (`/profile`) requiere token
- [ ] Ruta protegida funciona con token válido
- [ ] Reenvío de código funciona
- [ ] Recuperación de contraseña envía código
- [ ] Reseteo de contraseña funciona con código
- [ ] Login funciona con nueva contraseña
- [ ] Validaciones de email funcionan
- [ ] Validaciones de contraseña funcionan
- [ ] Email duplicado es rechazado
- [ ] Credenciales incorrectas son rechazadas
- [ ] Token inválido es rechazado

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB esté corriendo: `mongod`
- O usa MongoDB Atlas y actualiza `MONGODB_URI` en `.env`

### Error: "Module not found"
- Instala las dependencias: `npm install`

### Error: "Port 3000 already in use"
- Cambia el puerto en `.env`: `PORT=3001`
- O cierra el proceso que usa el puerto 3000

### El código de verificación no aparece
- Revisa la consola del servidor (donde ejecutaste `npm run dev`)
- El código se imprime en formato de caja con emojis 📧

### Los tokens no funcionan
- Verifica que `JWT_SECRET` esté configurado en `.env`
- Copia el token completo (incluyendo todo el texto largo)

---

## 📊 Monitoreo

Durante las pruebas, observa la consola del servidor. Verás:
- Conexión a MongoDB
- Códigos de verificación generados
- Códigos de recuperación de contraseña
- Errores detallados si algo falla

---

## 🎯 Siguiente Paso

Una vez que todas las pruebas pasen exitosamente, puedes:
1. Integrar el frontend con el backend
2. Implementar envío real de emails
3. Agregar más funcionalidades (perfiles, pacientes, etc.)

¡Buena suerte con las pruebas! 🚀