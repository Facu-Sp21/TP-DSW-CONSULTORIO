import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
/*
transporter.verify((error, success) => {
  if (error) {
    console.error('Error de conexión:', error);
  } else {
    console.log('Servidor SMTP listo para enviar correos');
  }
});*/

export async function enviarCorreo(destinatario: string,asunto: string,mensaje: string
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    html: mensaje
  });
}

//prueba después bprrar (por ahora funciona)
/*
enviarCorreo(
  'almamorichetti@gmail.com',
  'Prueba Nodemailer',
  'Este es un correo de prueba desde el backend.'
)
  .then(() => console.log('Correo enviado correctamente'))
  .catch((error) => console.error('Error al enviar correo:', error));
*/