import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import {mailFormatTurnoPendiente} from './email.template.js';
import {mailFormatConfirmarTurno} from './email.template.confirmacion.js';
import { Turno } from '../turno/turno.entity.js';

dotenv.config({ path: '.env.desarrollo' });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD ?? process.env.EMAIL_PASS,
  },
});

//en producción
/*
const transporter = nodemailer.createTransport({
  service: 'gmail',
    auth: {
    user: process.env.EMAIL_USER_P,
    pass: process.env.EMAIL_PASS_P
  }
});*/


export async function enviarCorreo(destinatario: string,asunto: string, turno: Turno, tipo: 'pend'|'confirm', url?: string
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    html: tipo=== 'pend'? mailFormatTurnoPendiente(turno): mailFormatConfirmarTurno(turno, url)
  });
}
