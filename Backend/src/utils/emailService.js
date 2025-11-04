// Servicio simulado de email (puedes integrar Nodemailer, SendGrid, etc.)
const sendVerificationEmail = async (email, code) => {
  console.log(`
    ========================================
    📧 Email de Verificación
    ========================================
    Para: ${email}
    Código: ${code}
    ========================================
  `);
  
  // TODO: Implementar envío real de email
  // Ejemplo con Nodemailer:
  // const transporter = nodemailer.createTransport({...});
  // await transporter.sendMail({
  //   from: '"Brainsure" <noreply@brainsure.com>',
  //   to: email,
  //   subject: 'Código de Verificación',
  //   html: `<p>Tu código de verificación es: <strong>${code}</strong></p>`
  // });
  
  return true;
};

const sendPasswordResetEmail = async (email, code) => {
  console.log(`
    ========================================
    🔑 Email de Recuperación de Contraseña
    ========================================
    Para: ${email}
    Código: ${code}
    ========================================
  `);
  
  // TODO: Implementar envío real de email
  
  return true;
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};