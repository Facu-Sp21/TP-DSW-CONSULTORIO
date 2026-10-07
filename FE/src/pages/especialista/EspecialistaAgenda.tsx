import React, { useEffect, useState } from 'react';
import { EspecialistaNav } from '../../components/EspecialistaNav';
import { formatearFecha, hoyISO, sumarDias } from '../../../services/fechas';
import { getAgenda } from '../../../services/agendaService';
import type { EstadoTurno, TurnoAgenda } from '../../../services/agendaService';

// TEMPORAL: cuando exista el login (Elian), este código sale de la sesión del especialista.
const COD_ESPECIALISTA_PRUEBA = 1;

const ESTADOS: Record<EstadoTurno, { clase: string; texto: string }> = {
  PENDIENTE: { clase: 'text-bg-primary', texto: 'Pendiente' },
  ATENDIDO: { clase: 'text-bg-success', texto: 'Atendido' },
  AUSENTE: { clase: 'text-bg-warning', texto: 'Ausente' },
};

export const EspecialistaAgenda: React.FC = () => {
  const [fecha, setFecha] = useState(hoyISO());
  // Guardamos el resultado junto con la fecha a la que pertenece
  const [resultado, setResultado] = useState<{ fecha: string; turnos: TurnoAgenda[]; error: string | null } | null>(null);

  useEffect(() => {
    let vigente = true; // evita que una respuesta lenta pise a una más nueva
    getAgenda(COD_ESPECIALISTA_PRUEBA, fecha)
      .then((turnos) => vigente && setResultado({ fecha, turnos, error: null }))
      .catch((err: Error) => vigente && setResultado({ fecha, turnos: [], error: err.message }));
    return () => { vigente = false; };
  }, [fecha]);

  // Si lo que tenemos guardado es de otra fecha, todavía estamos cargando la nueva
  const cargando = resultado?.fecha !== fecha;
  const turnos = cargando ? [] : resultado.turnos;
  const error = cargando ? null : resultado.error;
  const pendientes = turnos.filter((t) => t.estado === 'PENDIENTE').length;
  const atendidos = turnos.filter((t) => t.estado === 'ATENDIDO').length;

  return (
    <div className="min-vh-100 bg-light">
      <EspecialistaNav />

      <main className="container py-5">
        <div className="mb-4">
          <span className="etiqueta-superior rounded-pill mb-3">Panel del profesional</span>
          <h1 className="fw-bold mb-1">Mi agenda</h1>
          <p className="text-muted mb-0">Elegí un día para ver los turnos de tus pacientes.</p>
        </div>

        <div className="card border-0 shadow-sm p-3 mb-4">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="btn-group">
              <button className="btn btn-outline-secondary" onClick={() => setFecha(sumarDias(fecha, -1))} aria-label="Día anterior">
                <i className="bi bi-chevron-left"></i>
              </button>
              <button className="btn btn-outline-secondary" onClick={() => setFecha(hoyISO())}>Hoy</button>
              <button className="btn btn-outline-secondary" onClick={() => setFecha(sumarDias(fecha, 1))} aria-label="Día siguiente">
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
            <input
              type="date"
              className="form-control w-auto"
              value={fecha}
              onChange={(e) => e.target.value && setFecha(e.target.value)}
              aria-label="Elegir fecha"
            />
          </div>
        </div>

        <section className="card border-0 shadow-sm p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h5 fw-bold mb-0 text-capitalize">{formatearFecha(fecha)}</h2>
            <div className="d-flex gap-2">
              <span className="badge rounded-pill text-bg-primary">{pendientes} pendiente{pendientes === 1 ? '' : 's'}</span>
              <span className="badge rounded-pill text-bg-success">{atendidos} atendido{atendidos === 1 ? '' : 's'}</span>
            </div>
          </div>

          {cargando && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando…</span>
              </div>
            </div>
          )}

          {error && <div className="alert alert-danger" role="alert">No pudimos cargar la agenda. {error}</div>}

          {!cargando && !error && turnos.length === 0 && (
            <div className="fondo-punteado rounded p-4 text-center">
              <i className="bi bi-calendar2-check fs-2 text-primary"></i>
              <p className="mb-0 mt-2 text-muted">No tenés turnos para este día.</p>
            </div>
          )}

          <div className="d-flex flex-column gap-3">
            {turnos.map((t) => (
              <div className="agenda-item flex-wrap" key={t.id}>
                <span className="agenda-hora">{t.hora}</span>
                <div className="flex-grow-1">
                  <strong>{t.paciente.nombre}</strong>
                  <small className="d-block text-muted">DNI {t.paciente.dni} · Tel. {t.paciente.telefono}</small>
                </div>
                <span className={`badge rounded-pill ms-auto ${ESTADOS[t.estado].clase}`}>{ESTADOS[t.estado].texto}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};