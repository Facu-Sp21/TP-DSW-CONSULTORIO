import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { buildMonthCalendar, UserNavigation } from './Usuario';
import { getEspecialidades } from '../../services/especialidadService';
import type { Especialidad } from '../../services/especialidadService';
import { getEspecialistasByEspecialidad } from '../../services/especialistaService';
import type { Especialista } from '../../services/especialistaService';
import { isAuthenticated } from '../../services/authService';
import { getUsuarioActual } from '../../services/authService';
import { createTurno, getHorariosDisponibles } from '../../services/turnoService';

export const SacarTurno: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [especialidad, setEspecialidad] = useState<Especialidad | null>(null);
  const [especialista, setEspecialista] = useState<Especialista | null>(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEspecialidades().then(setEspecialidades).catch(() => setError('No se pudieron cargar las especialidades.'));
  }, []);

  useEffect(() => {
    const selectedId = Number(searchParams.get('especialidad'));
    const selected = especialidades.find((item) => item.cod_especialidad === selectedId);
    if (selected && !especialidad) {
      setEspecialidad(selected);
      setStep(2);
    }
  }, [especialidades, searchParams, especialidad]);

  useEffect(() => {
  if (!especialidad || especialidad.cod_especialidad === undefined) return;
  setLoading(true);
  getEspecialistasByEspecialidad(especialidad.cod_especialidad)
    .then(setEspecialistas)
    .catch(() => setError('No se pudieron cargar los especialistas.'))
    .finally(() => setLoading(false));
  }, [especialidad]);

  useEffect(() => {
    if (!especialista?.cod_especialista || !fecha) return;

    let cancelled = false;
    getHorariosDisponibles(especialista.cod_especialista, fecha)
      .then((disponibilidad) => {
        if (!cancelled) setHorariosDisponibles(disponibilidad.horarios);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudieron cargar los horarios disponibles.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingHorarios(false);
      });

    return () => {
      cancelled = true;
    };
  }, [especialista, fecha]);

  const { calendarDays, maxDate } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date(today);
    limit.setMonth(limit.getMonth() + 1);
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    return { calendarDays: buildMonthCalendar(first.getFullYear(), first.getMonth()), maxDate: limit };
  }, []);

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const finish = (event: React.FormEvent) => {
    event.preventDefault();
    const usuario = getUsuarioActual();
    if (!usuario || !especialista?.cod_especialista || !horariosDisponibles.includes(hora)) return;

    setIsSubmitting(true);
    setError(null);
    createTurno({
      fecha,
      hora_inicio: hora,
      cod_especialista: especialista.cod_especialista,
      nro_afiliado: usuario.id,
    })
      .then(() => navigate('/usuario', { state: { bookingSuccess: true } }))
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo confirmar el turno.'))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-vh-100 fondo-punteado">
      <UserNavigation />
      <main className="container py-5" style={{ maxWidth: '850px' }}>
        <div className="text-center mb-4">
          <span className="etiqueta-superior rounded-pill mb-3">Nueva reserva</span>
          <h1 className="fw-bold">Sacá tu turno</h1>
          <p className="text-muted">Elegí una opción en cada paso para confirmar tu consulta.</p>
        </div>
        <div className="booking-steps mb-4">
          {['Especialidad', 'Especialista', 'Fecha y hora'].map((label, index) => (
            <div className={`booking-step ${step >= index + 1 ? 'active' : ''}`} key={label}>
              <span>{index + 1}</span><small>{label}</small>
            </div>
          ))}
        </div>
        <section className="card border-0 shadow-sm p-4 p-md-5">
          {error && <div className="alert alert-danger">{error}</div>}
          {step === 1 && (
            <>
              <h2 className="h4 fw-bold mb-1">¿Qué especialidad necesitás?</h2>
              <p className="text-muted mb-4">Seleccioná el tipo de consulta.</p>
              <div className="row g-3">
                {especialidades.map((item) => (
                  <div className="col-md-6" key={item.cod_especialidad}>
                    <button className={`selection-card text-start w-100 ${especialidad?.cod_especialidad === item.cod_especialidad ? 'selected' : ''}`} onClick={() => setEspecialidad(item)} onDoubleClick={() => { setEspecialidad(item); setStep(2); }}>
                      <i className="bi bi-clipboard2-pulse fs-4" />
                      <span>{item.nombre}</span>
                      {especialidad?.cod_especialidad === item.cod_especialidad && <i className="bi bi-check-circle-fill ms-auto" />}
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-4 ms-auto d-block" disabled={!especialidad} onClick={() => setStep(2)}>Continuar <i className="bi bi-arrow-right ms-2" /></button>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="h4 fw-bold mb-1">Elegí tu especialista</h2>
              <p className="text-muted mb-4">Profesionales disponibles para {especialidad?.nombre}.</p>
              {loading ? <div className="text-center py-4"><div className="spinner-border text-primary" /></div> : (
                <div className="row g-3">
                  {especialistas.map((item) => (
                    <div className="col-md-6" key={item.cod_especialista}>
                      <button className={`selection-card text-start w-100 ${especialista?.cod_especialista === item.cod_especialista ? 'selected' : ''}`} onClick={() => { setEspecialista(item); setHora(''); setHorariosDisponibles([]); setLoadingHorarios(Boolean(fecha)); setError(null); }} onDoubleClick={() => { setEspecialista(item); setHora(''); setHorariosDisponibles([]); setLoadingHorarios(Boolean(fecha)); setError(null); setStep(3); }}>
                        <i className="bi bi-person-badge fs-4" /><span><strong className="d-block">{item.nombre}</strong><small className="text-muted">{item.matricula}</small></span>
                        {especialista?.cod_especialista === item.cod_especialista && <i className="bi bi-check-circle-fill ms-auto" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="d-flex justify-content-between mt-4"><button className="btn btn-outline-secondary" onClick={() => setStep(1)}>Atrás</button><button className="btn btn-primary" disabled={!especialista} onClick={() => setStep(3)}>Continuar <i className="bi bi-arrow-right ms-2" /></button></div>
            </>
          )}
          {step === 3 && (
            <form onSubmit={finish}>
              <h2 className="h4 fw-bold mb-1">¿Cuándo querés venir?</h2>
              <p className="text-muted mb-4">Elegí una fecha y un horario disponible.</p>
              <label className="form-label fw-semibold" htmlFor="fecha"><i className="bi bi-calendar3 me-2 text-primary" />Fecha</label>
              <div className="booking-calendar mb-3">
                <div className="calendar-grid calendar-head mb-2">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => <span key={day}>{day}</span>)}</div>
                <div className="calendar-grid">
                  {calendarDays.map((calendarDay) => {
                    const { date: day } = calendarDay;
                    const value = new Date(`${day}T12:00:00`);
                    const today = new Date(); today.setHours(0, 0, 0, 0);
                    const disabled = !calendarDay.isCurrentMonth || value < today || value > maxDate || value.getDay() === 0 || value.getDay() === 6;
                    return <button type="button" className={`calendar-day ${!calendarDay.isCurrentMonth ? 'adjacent-month' : ''} ${fecha === day ? 'selected' : ''}`} disabled={disabled} key={day} onClick={() => { setFecha(day); setHora(''); setHorariosDisponibles([]); setLoadingHorarios(Boolean(especialista?.cod_especialista)); setError(null); }}>{value.getDate()}</button>;
                  })}
                </div>
              </div>
              <label className="form-label fw-semibold"><i className="bi bi-clock me-2 text-primary" />Horarios disponibles</label>
              {!fecha ? (
                <div className="text-muted small fst-italic p-2 bg-light rounded border">
                  Seleccioná un día hábil para ver los horarios.
                </div>
              ) : loadingHorarios ? (
                <div className="text-muted small fst-italic p-2 bg-light rounded border">
                  Cargando horarios disponibles...
                </div>
              ) : horariosDisponibles.length === 0 ? (
                <div className="text-muted small fst-italic p-2 bg-light rounded border">
                  No hay horarios disponibles para esta fecha.
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded border">
                  {horariosDisponibles.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`btn btn-sm ${hora === item ? 'btn-primary shadow-sm' : 'btn-outline-primary'}`}
                      onClick={() => { setHora(item); setError(null); }}
                      style={{ minWidth: '65px' }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
              {hora && (
                <div className="text-success small fw-semibold mt-1">
                  <i className="bi bi-check-circle-fill me-1" />Horario seleccionado: {hora}
                </div>
              )}
              <div className="alert alert-light border mt-4"><strong>{especialidad?.nombre}</strong> con {especialista?.nombre}</div>
              <div className="d-flex justify-content-between mt-4"><button type="button" className="btn btn-outline-secondary" onClick={() => setStep(2)}>Atrás</button><button className="btn btn-primary" type="submit" disabled={!hora || !horariosDisponibles.includes(hora) || isSubmitting}>{isSubmitting ? 'Confirmando...' : 'Confirmar turno'} <i className="bi bi-check-lg ms-2" /></button></div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};
