import cron from 'node-cron';
import { sGetTurnos } from '../turno/turno.service.js';
import { orm } from '../shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import {enviarCorreo} from './email.service.js';
import {signTokenGestionTurno} from '../shared/auth/jwt.js';
import type {Turno} from '../turno/turno.entity.js'; //prueba después borralo
/*
const turnoPrueba = {
  fecha: '2026-10-18',
  hora_inicio: '10:00',
  paciente: {
    nombre: 'Paciente de prueba',
    email: 'paciente@prueba.com'
  },
  especialista: {
    nombre: 'Dra. Especialista de prueba'
  }
} as Turno;*/

function obtenerFechaDeManiana(): string {
  const maniana = new Date();
  maniana.setDate(maniana.getDate() + 1);

  return maniana.toLocaleDateString('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });
}

export function iniciarRecordatoriosTurnos() {
  cron.schedule(
  
  '41 10 * * *',  //se ejecuta todos los dias a las 10:41 am 
    async () => {
      try {
      
        await RequestContext.create(orm.em, async () => {

        const fechaDeManiana = obtenerFechaDeManiana();
        const turnos = await sGetTurnos({ fecha: fechaDeManiana });

        const turnosARecordar = turnos.filter(
          (turno) => turno.estado === 'PENDIENTE'
        );
        //para controlar despues BORRAR
       /* console.log(
          `Turnos a recordar para ${fechaDeManiana}:`,
          turnosARecordar.length
        );

        await enviarCorreo(turnoPrueba.paciente.email,"Confirmación de turno", turnoPrueba,"confirm");*/
        //acá llamo a enviar correo para cada turno

        for (let i = 0; i<turnosARecordar.length; i++){
          const token= signTokenGestionTurno(turnosARecordar[i].cod_turno);
          const url= process.env.FRONTEND_URL+'/confirmar-asistencia?token='+token;

          await enviarCorreo(turnosARecordar[i].paciente.email, "Confirmación de turno",turnosARecordar[i],"confirm",url);
        }

        });
      } catch (error) {
        console.error('Error al buscar recordatorios:', error);
      }
    },
    {
      timezone: 'America/Argentina/Buenos_Aires',
      noOverlap: true
    },
  );
}