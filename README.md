# Brainsure Cuidadores - Frontend Mobile

App móvil desarrollada con React Native y Expo para el apoyo de cuidadores de personas con deterioro cognitivo.

## Instalación

1. **Navegar a la carpeta del proyecto:**
```powershell
cd c:\Users\User\Desktop\BrainCol\Braincol\Frontend
```

2. **Instalar dependencias:**
```powershell
npm install
```

3. **Iniciar la app:**
```powershell
npm start
```

## Estructura del proyecto

```
Frontend/
├── app/                    # Pantallas de la app
│   ├── _layout.tsx        # Layout principal y configuración de fuentes
│   ├── index.tsx          # Splash Screen (pantalla de carga)
│   ├── onboarding.tsx     # Pantallas de introducción (3 slides)
│   ├── login.tsx          # Pantalla de login
│   ├── register.tsx       # Pantalla de registro
│   └── verify.tsx         # Pantalla de verificación de código
├── assets/                # Recursos estáticos
│   ├── fonts/            # Fuentes Poppins
│   └── img/              # Imágenes y logos
├── components/           # Componentes reutilizables
├── constants/           # Constantes (colores, etc)
│   └── Colors.ts
├── app.json            # Configuración de Expo
└── package.json
```

## Características

### Autenticación
- **Splash Screen**: Pantalla de carga con logo animado (respiración) y spinner después de 3s
- **Onboarding**: 3 slides introductorios con deslizamiento suave
- **Login**: Pantalla de inicio de sesión con integración social (Facebook, Google)
- **Registro**: Formulario completo con validación visual
- **Verificación**: Código de 6 dígitos con auto-focus

### Diseño
- Tipografía Poppins en todos los textos
- Paleta de colores personalizada y consistente
- Diseño completamente responsive (iPhone SE a iPhone 14 Pro Max)
- Animaciones suaves en transiciones
- Iconos profesionales de Ionicons
- Componentes con estados visuales claros

### Navegación
- Expo Router para navegación fluida
- Transiciones animadas entre pantallas
- Stack navigation configurado

## Flujo de la App

1. **Splash Screen** (5 segundos)
   - Logo con animación de respiración
   - Spinner opcional si tarda más de 3s
   - Fade out al terminar

2. **Onboarding** (3 slides)
   - Slide 1: Tu bienestar es nuestra prioridad
   - Slide 2: Monitorea el progreso cognitivo
   - Slide 3: Conéctate con otros cuidadores
   - Deslizamiento manual o con botones
   - Fade out al completar

3. **Login**
   - Email y contraseña
   - Login social (Facebook, Google)
   - Recuperar contraseña
   - Ir a registro

4. **Registro**
   - Nombre completo
   - Email
   - Contraseña con visibilidad toggle
   - Confirmar contraseña
   - Términos y condiciones

5. **Verificación**
   - Código de 6 dígitos
   - Auto-focus entre campos
   - Reenviar código

## Tecnologías

- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **Expo Router** - Navegación basada en archivos
- **TypeScript** - Tipado estático
- **Expo Font** - Gestión de fuentes
- **React Native Animated** - Animaciones nativas
- **Ionicons** - Iconografía

## Paleta de Colores

```typescript
Colors = {
  primary: '#5B68DF',      // Azul principal
  background: '#F5F6FA',   // Gris claro de fondo
  white: '#FFFFFF',
  border: '#E5E7EB',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    placeholder: '#9CA3AF',
  }
}
```

## Notas de Desarrollo

- Las animaciones están optimizadas para funcionar en web y móvil
- El diseño usa porcentajes para adaptarse a cualquier tamaño de pantalla
- Las fuentes se cargan de manera asíncrona en el `_layout.tsx`
- Los componentes usan `useWindowDimensions` para responsive design en tiempo real
