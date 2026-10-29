import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EspecialistaNav } from '../../components/EspecialistaNav';
import { SelectorFecha } from '../../components/SelectorFecha';
import { ConfirmarModal } from '../../components/ConfirmarModal';
import { getUsuarioActual } from '../../../services/authService';
import { formatearFecha, hoyISO } from '../../../services/fechas';
import { getAgenda, marcarAusente } from '../../../services/agendaService';
import type { EstadoTurno, TurnoAgenda } from '../../../services/agendaService';

// Si el nombre ya trae el título ("Dra. Laura Fernández") se usa tal cual; si no, se antepone "Dr."
function tituloDeAgenda(nombre: string): string {
  const limpio = nombre.trim();
  return /^dra?\.?\s/i.test(limpio) ? `Agenda de ${limpio}` : `Agenda del Dr. ${limpio}`;
}

const ESTADOS: Record<EstadoTurno, { clase: string; texto: string }> = {
  PENDIENTE: { clase: 'text-bg-primary', texto: 'Pendiente' },
  CONFIRMADO: { clase: 'text-bg-success', texto: 'Confirmado' },
  CANCELADO: { clase: 'text-bg-secondary', texto: 'Cancelado' },
  ATENDIDO: { clase: 'text-bg-success', texto: 'Atendido' },
  AUSENTE: { clase: 'text-bg-warning', texto: 'Ausente' },
};

export const EspecialistaAgenda: React.FC = () => {
  const usuario = getUsuarioActual();
  const codEspecialista = usuario?.id ?? 0;

  const [searchParams] = useSearchParams();
  const fechaDeUrl = searchParams.get('fecha');
  const [fecha, setFecha] = useState(fechaDeUrl && /^\d{4}-\d{2}-\d{2}$/.test(fechaDeUrl) ? fechaDeUrl : hoyISO());
  const [version, setVersion] = useState(0);
  const [turnoPorMarcar, setTurnoPorMarcar] = useState<TurnoAgenda | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{ fecha: string; turnos: TurnoAgenda[]; error: string | null } | null>(null);

  useEffect(() => {
    let vigente = true;
    getAgenda(codEspecialista, fecha)
      .then((turnos) => vigente && setResultado({ fecha, turnos, error: null }))
      .catch((err: Error) => vigente && setResultado({ fecha, turnos: [], error: err.message }));
    return () => { vigente = false; };
  }, [codEspecialista, fecha, version]);

  const cargando = resultado?.fecha !== fecha;
  const turnos = cargando ? [] : resultado.turnos;
  const error = cargando ? null : resultado.error;
  const pendientes = turnos.filter((t) => t.estado === 'PENDIENTE').length;
  const atendidos = turnos.filter((t) => t.estado === 'ATENDIDO').length;
  const ausentes = turnos.filter((t) => t.estado === 'AUSENTE').length;

  const confirmarAusente = async () => {
    if (!turnoPorMarcar) return;
    const turno = turnoPorMarcar;
    setTurnoPorMarcar(null);
    setErrorAccion(null);
    try {
      await marcarAusente(turno.id);
      setVersion((actual) => actual + 1);
    } catch (err) {
      setErrorAccion(err instanceof Error ? err.message : 'No se pudo actualizar el turno.');
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <EspecialistaNav />

      <main className="container py-5">
        <div className="mb-4">
          <span className="etiqueta-superior rounded-pill mb-3">Panel del profesional</span>
          <h1 className="fw-bold mb-1">{tituloDeAgenda(usuario?.nombre ?? '')}</h1>
          <p className="text-muted mb-0">Elegí un día para ver y atender a tus pacientes.</p>
        </div>

        <div className="card border-0 shadow-sm p-3 mb-4">
          <SelectorFecha fecha={fecha} onCambiar={setFecha} />
        </div>

        <section className="card border-0 shadow-sm p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h5 fw-bold mb-0 text-capitalize">{formatearFecha(fecha)}</h2>
            <div className="d-flex gap-2">
              <span className="badge rounded-pill text-bg-primary">{pendientes} pendiente{pendientes === 1 ? '' : 's'}</span>
              <span className="badge rounded-pill text-bg-success">{atendidos} atendido{atendidos === 1 ? '' : 's'}</span>
              <span className="badge rounded-pill text-bg-warning">{ausentes} ausente{ausentes === 1 ? '' : 's'}</span>
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
          {errorAccion && <div className="alert alert-danger" role="alert">{errorAccion}</div>}
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
                <div className="d-flex align-items-center gap-2 ms-auto">
                  <span className={`badge rounded-pill ${ESTADOS[t.estado].clase}`}>{ESTADOS[t.estado].texto}</span>
                  {(t.estado === 'PENDIENTE' || t.estado === 'CONFIRMADO') && t.fecha <= hoyISO() && (
                    <>
                      <Link className="btn btn-sm btn-primary" to={`/especialista/turno/${t.id}`}>Atender</Link>
                      <button className="btn btn-sm btn-outline-warning" onClick={() => setTurnoPorMarcar(t)}>Ausente</button>
                    </>
                  )}
                  {(t.estado === 'PENDIENTE' || t.estado === 'CONFIRMADO') && t.fecha > hoyISO() && (
                    <Link className="btn btn-sm btn-outline-primary" to={`/especialista/turno/${t.id}`}>Ver</Link>
                  )}
                  {t.estado === 'ATENDIDO' && (
                    <Link className="btn btn-sm btn-outline-success" to={`/especialista/turno/${t.id}`}>Ver informe</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ConfirmarModal
        abierto={turnoPorMarcar !== null}
        titulo="Marcar como ausente"
        mensaje={`¿Confirmás que ${turnoPorMarcar?.paciente.nombre ?? 'el paciente'} no se presentó a su turno?`}
        textoConfirmar="Sí, marcar ausente"
        onConfirmar={confirmarAusente}
        onCancelar={() => setTurnoPorMarcar(null)}
      />
    </div>
  );
};