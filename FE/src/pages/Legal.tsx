import React from 'react';
import { PublicLayout } from '../components/PublicLayout';

const SECCIONES = {
  terminos: {
    titulo: 'Términos de servicio',
    parrafos: [
      'Vitalis es una plataforma para gestionar turnos con los profesionales del sanatorio. Al crear una cuenta aceptás usar el servicio solo para tus propios turnos y con datos verdaderos.',
      'Podés cancelar un turno desde tu calendario cuando lo necesites. Te pedimos hacerlo con anticipación para que otra persona pueda tomar ese horario.',
    ],
  },
  privacidad: {
    titulo: 'Políticas de privacidad',
    parrafos: [
      'Guardamos tus datos personales y tu historia clínica únicamente para brindarte atención. Solo pueden verlos vos y los profesionales que te atienden.',
      'Las contraseñas se almacenan cifradas y nunca se comparten con terceros.',
    ],
  },
} as const;

interface LegalProps {
  tipo: keyof typeof SECCIONES;
}

export const Legal: React.FC<LegalProps> = ({ tipo }) => {
  const { titulo, parrafos } = SECCIONES[tipo];

  return (
    <PublicLayout>
      <main className="container py-5" style={{ maxWidth: '760px' }}>
        <h1 className="fw-bold mb-4">{titulo}</h1>
        {parrafos.map((p) => (
          <p className="text-muted fs-6" key={p}>{p}</p>
        ))}
        <p className="small text-muted mt-5 mb-0">
          Texto de ejemplo para el trabajo práctico; no constituye un documento legal.
        </p>
      </main>
    </PublicLayout>
  );
};