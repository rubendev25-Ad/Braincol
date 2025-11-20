const nodemailer = require('nodemailer');
require('dotenv').config();

// Verificar si las credenciales de email están configuradas
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

// Configuración del transporter para Gmail (solo si hay credenciales)
let transporter = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verificar la configuración del transporter
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Error en la configuración del email:', error.message);
      console.log('⚠️  El registro funcionará pero no se enviarán emails');
    } else {
      console.log('✅ Servidor de email listo para enviar mensajes');
    }
  });
} else {
  console.log('⚠️  Credenciales de email no configuradas');
  console.log('   El sistema funcionará en modo desarrollo (códigos en consola)');
  console.log('   Configura EMAIL_USER y EMAIL_PASS en .env para enviar emails reales');
}

const sendVerificationEmail = async (email, code) => {
  try {
    // Modo desarrollo: mostrar código en consola
    if (!isEmailConfigured) {
      console.log('\n' + '='.repeat(60));
      console.log('📧 CÓDIGO DE VERIFICACIÓN (Modo Desarrollo)');
      console.log('='.repeat(60));
      console.log(`Email: ${email}`);
      console.log(`Código: ${code}`);
      console.log(`⏰ Expira en: 15 minutos`);
      console.log('='.repeat(60) + '\n');
      return true;
    }

    const mailOptions = {
      from: `"Brainsure Cuidadores 🧠" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Verifica tu cuenta en Brainsure Cuidadores',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #333;
              background: #f5f7fa;
              padding: 20px;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
              background-size: cover;
              opacity: 0.3;
            }
            .logo {
              font-size: 60px;
              margin-bottom: 10px;
              animation: pulse 2s ease-in-out infinite;
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            .header h1 {
              color: white;
              font-size: 28px;
              font-weight: 700;
              margin: 0;
              position: relative;
              z-index: 1;
            }
            .header p {
              color: rgba(255, 255, 255, 0.95);
              font-size: 16px;
              margin-top: 8px;
              position: relative;
              z-index: 1;
            }
            .content {
              padding: 40px 30px;
              background: white;
            }
            .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .message {
              color: #6b7280;
              font-size: 16px;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .code-container {
              background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
              border-radius: 12px;
              padding: 30px;
              margin: 30px 0;
              text-align: center;
              border: 2px solid #e5e7eb;
              position: relative;
              overflow: hidden;
            }
            .code-container::before {
              content: '';
              position: absolute;
              top: -2px;
              left: -2px;
              right: -2px;
              bottom: -2px;
              background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef);
              border-radius: 12px;
              z-index: -1;
            }
            .code-label {
              font-size: 14px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .code {
              font-size: 42px;
              font-weight: 800;
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .warning-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px 20px;
              border-radius: 8px;
              margin: 25px 0;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .warning-icon {
              font-size: 24px;
            }
            .warning-text {
              color: #92400e;
              font-size: 14px;
              margin: 0;
            }
            .info-box {
              background: #eff6ff;
              border-left: 4px solid #3b82f6;
              padding: 15px 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .info-text {
              color: #1e40af;
              font-size: 14px;
              margin: 0;
            }
            .features {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 20px;
              margin: 30px 0;
            }
            .feature {
              text-align: center;
              padding: 20px;
              background: #f9fafb;
              border-radius: 10px;
              transition: transform 0.2s;
            }
            .feature:hover {
              transform: translateY(-2px);
            }
            .feature-icon {
              font-size: 32px;
              margin-bottom: 10px;
            }
            .feature-text {
              font-size: 13px;
              color: #6b7280;
              font-weight: 500;
            }
            .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer-text {
              color: #9ca3af;
              font-size: 13px;
              margin: 5px 0;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-link {
              display: inline-block;
              margin: 0 8px;
              font-size: 24px;
              text-decoration: none;
              transition: transform 0.2s;
            }
            .social-link:hover {
              transform: scale(1.2);
            }
            @media only screen and (max-width: 600px) {
              .content { padding: 25px 20px; }
              .code { font-size: 36px; letter-spacing: 6px; }
              .greeting { font-size: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <!-- Header -->
            <div class="header">
              <div class="logo">🧠</div>
              <h1>Brainsure Cuidadores</h1>
              <p>Cuidado profesional para tus seres queridos</p>
            </div>

            <!-- Content -->
            <div class="content">
              <div class="greeting">¡Bienvenido a Brainsure Cuidadores! 🎉</div>
              
              <p class="message">
                Estamos emocionados de tenerte con nosotros. Para comenzar a usar todas las funciones de Brainsure Cuidadores y conectar con cuidadores profesionales, necesitamos verificar tu dirección de correo electrónico.
              </p>

              <div class="code-container">
                <div class="code-label">Tu código de verificación</div>
                <div class="code">${code}</div>
              </div>

              <div class="warning-box">
                <span class="warning-icon">⏰</span>
                <p class="warning-text">
                  <strong>Este código expirará en 15 minutos.</strong> Si no lo usas a tiempo, puedes solicitar uno nuevo.
                </p>
              </div>

              <div class="info-box">
                <p class="info-text">
                  💡 <strong>Consejo:</strong> Si no solicitaste este código, simplemente ignora este correo. Tu cuenta permanecerá segura.
                </p>
              </div>

              <div class="features">
                <div class="feature">
                  <div class="feature-icon">👨‍⚕️</div>
                  <div class="feature-text">Cuidadores verificados</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🔒</div>
                  <div class="feature-text">100% Seguro</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">📱</div>
                  <div class="feature-text">Fácil de usar</div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p class="footer-text"><strong>Brainsure Cuidadores</strong> - Conectando familias con cuidado profesional</p>
              <p class="footer-text">© ${new Date().getFullYear()} Brainsure Cuidadores. Todos los derechos reservados.</p>
              <p class="footer-text" style="margin-top: 15px; font-size: 11px;">
                Este es un correo automático, por favor no respondas a este mensaje.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de verificación enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email de verificación:', error);
    throw new Error('No se pudo enviar el email de verificación');
  }
};

const sendPasswordResetEmail = async (email, code) => {
  try {
    // Modo desarrollo: mostrar código en consola
    if (!isEmailConfigured) {
      console.log('\n' + '='.repeat(60));
      console.log('🔑 CÓDIGO DE RECUPERACIÓN (Modo Desarrollo)');
      console.log('='.repeat(60));
      console.log(`Email: ${email}`);
      console.log(`Código: ${code}`);
      console.log(`⏰ Expira en: 15 minutos`);
      console.log('='.repeat(60) + '\n');
      return true;
    }

    const mailOptions = {
      from: `"Brainsure Cuidadores 🧠" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔑 Recupera tu cuenta de Brainsure Cuidadores',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #333;
              background: #f5f7fa;
              padding: 20px;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .logo {
              font-size: 60px;
              margin-bottom: 10px;
            }
            .header h1 {
              color: white;
              font-size: 28px;
              font-weight: 700;
              margin: 0;
            }
            .header p {
              color: rgba(255, 255, 255, 0.95);
              font-size: 16px;
              margin-top: 8px;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .message {
              color: #6b7280;
              font-size: 16px;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .code-container {
              background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
              border-radius: 12px;
              padding: 30px;
              margin: 30px 0;
              text-align: center;
              border: 2px solid #fecaca;
            }
            .code-label {
              font-size: 14px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .code {
              font-size: 42px;
              font-weight: 800;
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .warning-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px 20px;
              border-radius: 8px;
              margin: 25px 0;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .warning-icon {
              font-size: 24px;
            }
            .warning-text {
              color: #92400e;
              font-size: 14px;
              margin: 0;
            }
            .security-box {
              background: #fee2e2;
              border-left: 4px solid #ef4444;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .security-title {
              color: #991b1b;
              font-weight: 700;
              font-size: 16px;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .security-text {
              color: #991b1b;
              font-size: 14px;
              margin: 0;
              line-height: 1.5;
            }
            .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer-text {
              color: #9ca3af;
              font-size: 13px;
              margin: 5px 0;
            }
            @media only screen and (max-width: 600px) {
              .content { padding: 25px 20px; }
              .code { font-size: 36px; letter-spacing: 6px; }
              .greeting { font-size: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <!-- Header -->
            <div class="header">
              <div class="logo">🔑</div>
              <h1>Recuperación de Cuenta</h1>
              <p>Brainsure Cuidadores - Restablece tu contraseña</p>
            </div>

            <!-- Content -->
            <div class="content">
              <div class="greeting">Solicitud de recuperación de contraseña</div>
              
              <p class="message">
                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Brainsure Cuidadores. Utiliza el siguiente código para continuar con el proceso:
              </p>

              <div class="code-container">
                <div class="code-label">Código de recuperación</div>
                <div class="code">${code}</div>
              </div>

              <div class="warning-box">
                <span class="warning-icon">⏰</span>
                <p class="warning-text">
                  <strong>Este código expirará en 15 minutos.</strong> Úsalo pronto para restablecer tu contraseña.
                </p>
              </div>

              <div class="security-box">
                <div class="security-title">
                  <span>⚠️</span>
                  <span>Importante - Seguridad de tu cuenta</span>
                </div>
                <p class="security-text">
                  Si NO solicitaste este cambio de contraseña, <strong>ignora este correo</strong> inmediatamente. Tu contraseña permanecerá sin cambios y tu cuenta estará segura.
                  <br><br>
                  Si crees que alguien está intentando acceder a tu cuenta sin autorización, te recomendamos contactar a nuestro equipo de soporte.
                </p>
              </div>

              <p class="message" style="margin-top: 30px; text-align: center; color: #9ca3af; font-size: 14px;">
                🛡️ En Brainsure Cuidadores, la seguridad de tu cuenta es nuestra prioridad
              </p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p class="footer-text"><strong>Brainsure Cuidadores</strong> - Conectando familias con cuidado profesional</p>
              <p class="footer-text">© ${new Date().getFullYear()} Brainsure Cuidadores. Todos los derechos reservados.</p>
              <p class="footer-text" style="margin-top: 15px; font-size: 11px;">
                Este es un correo automático, por favor no respondas a este mensaje.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de recuperación enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email de recuperación:', error);
    throw new Error('No se pudo enviar el email de recuperación');
  }
};

const sendWelcomeEmail = async (email, name) => {
  console.log('📨 sendWelcomeEmail llamado con:', { email, name });
  console.log('🔧 Configuración SMTP:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER ? 'configurado' : 'NO configurado'
  });

  try {
    // Modo desarrollo: mostrar mensaje en consola
    if (!isEmailConfigured) {
      console.log('\n' + '='.repeat(60));
      console.log('🎉 MENSAJE DE BIENVENIDA (Modo Desarrollo)');
      console.log('='.repeat(60));
      console.log(`Email: ${email}`);
      console.log('='.repeat(60) + '\n');
      return true;
    }

    const mailOptions = {
      from: `"Brainsure Cuidadores 🧠" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '¡Bienvenido a Brainsure Cuidadores!',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #333;
              background: #f5f7fa;
              padding: 20px;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%);
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .logo {
              font-size: 60px;
              margin-bottom: 10px;
            }
            .header h1 {
              color: white;
              font-size: 28px;
              font-weight: 700;
              margin: 0;
            }
            .header p {
              color: rgba(255, 255, 255, 0.95);
              font-size: 16px;
              margin-top: 8px;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .message {
              color: #6b7280;
              font-size: 16px;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer-text {
              color: #9ca3af;
              font-size: 13px;
              margin: 5px 0;
            }
            @media only screen and (max-width: 600px) {
              .content { padding: 25px 20px; }
              .greeting { font-size: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <!-- Header -->
            <div class="header">
              <div class="logo">🎉</div>
              <h1>¡Bienvenido a Brainsure Cuidadores!</h1>
              <p>Estamos felices de tenerte con nosotros</p>
            </div>

            <!-- Content -->
            <div class="content">
              <div class="greeting">Hola ${name},</div>
              
              <p class="message">
                Gracias por unirte a Brainsure Cuidadores. Ahora puedes disfrutar de todas nuestras funciones y conectar con cuidadores profesionales para tus seres queridos.
              </p>

              <p class="message">
                Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. Estamos aquí para ayudarte.
              </p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p class="footer-text"><strong>Brainsure Cuidadores</strong> - Conectando familias con cuidado profesional</p>
              <p class="footer-text">© ${new Date().getFullYear()} Brainsure Cuidadores. Todos los derechos reservados.</p>
              <p class="footer-text" style="margin-top: 15px; font-size: 11px;">
                Este es un correo automático, por favor no respondas a este mensaje.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de bienvenida enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email de bienvenida:', error);
    throw new Error('No se pudo enviar el email de bienvenida');
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};