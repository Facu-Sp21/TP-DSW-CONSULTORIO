import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EspecialistaNav } from '../../components/EspecialistaNav';
import { formatearFecha, hoyISO } from '../../../services/fechas';
import { atenderTurno, getHistoria, getTurno } from '../../../services/agendaService';
import type { EntradaHistoria, TurnoAgenda } from '../../../services/agendaService';

interface Resultado {
  id: number;
  turno: TurnoAgenda | null;
  historia: EntradaHistoria[];
  error: string | null;
}

export const EspecialistaTurno: React.FC = () => {
  const { id: idDeUrl } = useParams(); // viene de la ruta /especialista/turno/:id
  const id = Number(idDeUrl);
  const navigate = useNavigate();

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [diagnostico, setDiagnostico] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    getTurno(id)
      .then(async (turno) => ({ turno, historia: await getHistoria(turno.paciente.id) })) // primero el turno, después la historia de ese paciente
      .then(({ turno, historia }) => vigente && setResultado({ id, turno, historia, error: null }))
      .catch((err: Error) => vigente && setResultado({ id, turno: null, historia: [], error: err.message }));
    return () => { vigente = false; };
  }, [id]);

  const cargando = resultado?.id !== id;
  const turno = cargando ? null : resultado.turno;
  const historia = cargando ? [] : resultado.historia;
  const error = cargando ? null : resultado.error;
  const esFuturo = turno ? turno.fecha > hoyISO() : false; // el backend no deja atender turnos futuros
  const informe = turno ? historia.find((h) => h.turnoId === turno.id) : undefined; // lo cargado en ESTA consulta
  const previas = historia.filter((h) => h.turnoId !== turno?.id); // consultas anteriores

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turno) return;
    setGuardando(true);
    setErrorGuardar(null);
    try {
      await atenderTurno(turno.id, { diagnostico, indicaciones: indicaciones || undefined });
      navigate(`/especialista?fecha=${turno.fecha}`); // vuelve a la agenda en el mismo día
    } catch (err) {
      setErrorGuardar(err instanceof Error ? err.message : 'No se pudo guardar la consulta.');
      setGuardando(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <EspecialistaNav />

      <main className="container py-5">
        <Link to={turno ? `/especialista?fecha=${turno.fecha}` : '/especialista'} className="text-decoration-none small">
          <i className="bi bi-arrow-left me-1"></i>Volver a la agenda
        </Link>

        {cargando && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando…</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger mt-3" role="alert">No pudimos cargar el turno. {error}</div>}

        {turno && (
          <div className="row g-4 mt-1">
            <div className="col-lg-7">
              <section className="card border-0 shadow-sm p-4 mb-4">
                <h1 className="h4 fw-bold mb-1">{turno.paciente.nombre}</h1>
                <p className="text-muted text-capitalize mb-3">{formatearFecha(turno.fecha)} · {turno.hora} hs</p>
                <dl className="row mb-0 small">
                  <dt className="col-sm-4 text-muted">DNI</dt>
                  <dd className="col-sm-8">{turno.paciente.dni}</dd>
                  <dt className="col-sm-4 text-muted">Teléfono</dt>
                  <dd className="col-sm-8 mb-0">{turno.paciente.telefono}</dd>
                </dl>
              </section>

              {turno.estado === 'PENDIENTE' && (
                <form className="card border-0 shadow-sm p-4" onSubmit={guardar}>
                  <h2 className="h5 fw-bold mb-3">Informe de la consulta</h2>
                    {esFuturo && (
                    <div className="alert alert-info small">
                      Este turno es de una fecha futura: vas a poder cargar el informe el día de la consulta.
                    </div>
                  )}
                  <label className="form-label fw-semibold" htmlFor="diagnostico">Diagnóstico</label>
                  <textarea
                    id="diagnostico"
                    className="form-control mb-3"
                    rows={4}
                    maxLength={2000}
                    minLength={3}
                    required
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    disabled={esFuturo}
                  />

                  <label className="form-label fw-semibold" htmlFor="indicaciones">
                    Indicaciones <span className="text-muted fw-normal small">(opcional)</span>
                  </label>
                  <textarea
                    id="indicaciones"
                    className="form-control mb-4"
                    rows={3}
                    maxLength={2000}
                    value={indicaciones}
                    onChange={(e) => setIndicaciones(e.target.value)}
                    disabled={esFuturo}
                  />

                  {errorGuardar && <div className="alert alert-danger" role="alert">{errorGuardar}</div>}

                  <button className="btn btn-primary ms-auto" type="submit" disabled={guardando || esFuturo}>
                    {guardando ? 'Guardando…' : <><i className="bi bi-check2-circle me-2"></i>Finalizar consulta</>}
                  </button>
                </form>
              )}

              {turno.estado === 'ATENDIDO' && (
                <section className="card border-0 shadow-sm p-4">
                  <h2 className="h5 fw-bold mb-3">Informe de la consulta</h2>
                  {informe ? (
                    <>
                      <p className="mb-1"><span className="fw-semibold">Diagnóstico:</span> {informe.diagnostico}</p>
                      {informe.indicaciones && (
                        <p className="mb-0 text-muted"><span className="fw-semibold">Indicaciones:</span> {informe.indicaciones}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-muted mb-0">Este turno fue atendido.</p>
                  )}
                </section>
              )}

              {turno.estado === 'AUSENTE' && (
                <div className="alert alert-warning mb-0">El paciente figura como ausente: no hay informe para cargar.</div>
              )}
            </div>

            <aside className="col-lg-5">
              <section className="card border-0 shadow-sm p-4">
                <h2 className="h5 fw-bold mb-1">Historia clínica</h2>
                <p className="small text-muted mb-3">Consultas anteriores de este paciente.</p>

                {previas.length === 0 ? (
                  <p className="text-muted mb-0">No hay consultas anteriores registradas.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {previas.map((h) => (
                      <div className="border rounded p-3" key={h.id}>
                        <div className="small text-muted text-capitalize">{formatearFecha(h.fecha)}</div>
                        <p className="mb-1 mt-1 small"><span className="fw-semibold">Diagnóstico:</span> {h.diagnostico}</p>
                        {h.indicaciones && (
                          <p className="mb-0 small text-muted"><span className="fw-semibold">Indicaciones:</span> {h.indicaciones}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};