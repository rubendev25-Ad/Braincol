# 📧 Configuración de Emails - BrainCol

## ✅ Configuración Completada

### Backend
- ✅ Nodemailer instalado y configurado para Gmail
- ✅ Diseño profesional de emails implementado
- ✅ Emails de verificación con diseño moderno
- ✅ Emails de recuperación de contraseña personalizados
- ✅ Validación automática de configuración SMTP

### Frontend
- ✅ AsyncStorage instalado para persistencia
- ✅ Integración completa con API de autenticación
- ✅ Flujo de verificación automático
- ✅ Redirección a la app después de verificar
- ✅ Manejo de errores y loading states

---

## 🔧 Configuración Actual

### Archivo `.env` (Backend)
```env
EMAIL_USER=adminbrainsure@gmail.com
EMAIL_PASS=ldfv dusf zapn mkyg
```

⚠️ **Importante:** Nunca subas este archivo a Git

---

## 🎨 Diseño de Emails

### Email de Verificación
- 🧠 Logo animado de BrainCol
- Gradiente moderno (púrpura/azul)
- Código destacado de 6 dígitos
- Advertencia de expiración (15 min)
- Consejos de seguridad
- Iconos de características

### Email de Recuperación
- 🔑 Tema de seguridad (rojo)
- Código de recuperación destacado
- Advertencias de seguridad prominentes
- Instrucciones claras

---

## 🚀 Flujo de Verificación Implementado

### 1. Registro de Usuario
```
Usuario completa formulario
    ↓
Backend crea cuenta
    ↓
Se envía email con código bonito
    ↓
Token temporal guardado
    ↓
Redirección a pantalla de verificación
```

### 2. Verificación
```
Usuario ingresa código de 6 dígitos
    ↓
Auto-verificación al completar
    ↓
Backend valida código
    ↓
Token JWT guardado en AsyncStorage
    ↓
¡Usuario logueado y redirigido a la app! ✅
```

### 3. Funcionalidades Extra
- ✅ Reenvío de código
- ✅ Auto-focus entre inputs
- ✅ Validación en tiempo real
- ✅ Loading states
- ✅ Manejo de errores

---

## 📱 Cómo Probar

### En el Backend:
```bash
cd Backend
npm start
```
Deberías ver: `✅ Servidor de email listo para enviar mensajes`

### En el Frontend (Simulador):
```bash
cd Frontend
npx expo start
```

### En Dispositivo Físico:
1. Cambia `API_URL` en:
   - `Frontend/app/register.tsx`
   - `Frontend/app/verify.tsx`
   
   De: `http://localhost:3000`
   A: `http://TU_IP_LOCAL:3000`
   
   Ejemplo: `http://192.168.1.100:3000`

2. Asegúrate de que tu teléfono y PC estén en la misma red WiFi

---

## 🎯 Endpoints Utilizados

### POST `/api/auth/register`
Crea usuario y envía email de verificación
```json
{
  "fullName": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

### POST `/api/auth/verify`
Verifica código y devuelve token JWT
```json
{
  "email": "juan@example.com",
  "code": "123456"
}
```

### POST `/api/auth/resend-code`
Reenvía código de verificación
```json
{
  "email": "juan@example.com"
}
```

---

## 🔒 Seguridad Implementada

✅ Códigos de 6 dígitos aleatorios
✅ Expiración de 15 minutos
✅ Contraseñas hasheadas con bcrypt
✅ Tokens JWT seguros
✅ Validación de email
✅ Almacenamiento seguro en AsyncStorage

---

## 📋 Próximos Pasos Sugeridos

1. **Cambiar API_URL en producción**
   - Usar variables de entorno
   - Configurar dominio real

2. **Agregar persistencia de sesión**
   - Auto-login al abrir la app
   - Verificar token válido

3. **Mejorar manejo de errores**
   - Toasts en lugar de Alerts
   - Mensajes más descriptivos

4. **Testing**
   - Probar en dispositivos físicos
   - Verificar emails en diferentes clientes

---

## 🎨 Personalización

Para cambiar colores o diseño del email, edita:
`Backend/src/utils/emailService.js`

Los estilos CSS están inline para máxima compatibilidad con clientes de email.

---

## ❓ Troubleshooting

### "Error al enviar email"
- Verifica que las credenciales de Gmail sean correctas
- Confirma que la contraseña de aplicación esté bien copiada (sin espacios)

### "No recibo el email"
- Revisa la carpeta de spam
- Verifica que el email sea correcto
- Comprueba los logs del backend

### "Código inválido o expirado"
- El código expira en 15 minutos
- Usa el botón "Reenviar" para obtener uno nuevo

---

## 📞 Soporte

Si tienes problemas, revisa:
1. Los logs del backend en la terminal
2. Los logs del frontend con React Native Debugger
3. La consola del navegador si usas Expo Web

¡Listo! Tu sistema de emails está 100% funcional 🚀
