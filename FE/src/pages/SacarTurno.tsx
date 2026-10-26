import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { buildMonthCalendar, UserNavigation } from './Usuario';
import { getEspecialidades } from '../../services/especialidadService';
import type { Especialidad } from '../../services/especialidadService';
import { getEspecialistasByEspecialidad } from '../../services/especialistaService';
import type { Especialista } from '../../services/especialistaService';
import { isAuthenticated } from '../../services/authService';
import { getUsuarioActual } from '../../services/authService';
import { createTurno, getHorariosDisponibles } from '../../services/turnoService';
import { getPacienteById, type PacienteResponse } from '../../services/pacienteService';

export const SacarTurno: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [especialidad, setEspecialidad] = useState<Especialidad | null>(null);
  const [especialista, setEspecialista] = useState<Especialista | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pacienteActual, setPacienteActual] = useState<PacienteResponse | null>(null);

  // ESTADO PARA MODAL / CARTEL INTEGRADO DE ALERTAS Y CONFIRMACIONES
  const [modalAlerta, setModalAlerta] = useState<{
    show: boolean;
    titulo: string;
    mensaje: string;
    tipo: 'error' | 'success' | 'confirm';
    onConfirm?: () => void;
  }>({ show: false, titulo: '', mensaje: '', tipo: 'error' });

  useEffect(() => {
    const usuario = getUsuarioActual();
    if (!usuario) return;

    getPacienteById(usuario.id)
      .then(setPacienteActual)
      .catch(() => setModalAlerta({
        show: true,
        titulo: 'Error',
        mensaje: 'No se pudieron cargar los datos de tu obra social.',
        tipo: 'error',
      }));
  }, []);

  useEffect(() => {
    getEspecialidades()
      .then(setEspecialidades)
      .catch(() => setModalAlerta({ show: true, titulo: 'Error', mensaje: 'No se pudieron cargar las especialidades.', tipo: 'error' }));
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
      .catch(() => setModalAlerta({ show: true, titulo: 'Error', mensaje: 'No se pudieron cargar los especialistas.', tipo: 'error' }))
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
          setModalAlerta({
            show: true,
            titulo: 'Atención',
            mensaje: err instanceof Error ? err.message : 'No se pudieron cargar los horarios disponibles.',
            tipo: 'error'
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingHorarios(false);
      });

    return () => {
      cancelled = true;
    };
  }, [especialista, fecha]);

  const { calendarDays, maxDate, minMonth, maxMonth } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 6);
    maxDate.setHours(23, 59, 59, 999);
    return {
      calendarDays: buildMonthCalendar(displayedMonth.getFullYear(), displayedMonth.getMonth()),
      maxDate,
      minMonth: today.getFullYear() * 12 + today.getMonth(),
      maxMonth: maxDate.getFullYear() * 12 + maxDate.getMonth(),
    };
  }, [displayedMonth]);

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const ejecutarReserva = (aceptaParticular = false) => {
    const usuario = getUsuarioActual();
    if (!usuario || !especialista?.cod_especialista || !horariosDisponibles.includes(hora)) return;

    setIsSubmitting(true);
    createTurno({
      fecha,
      hora_inicio: hora,
      cod_especialista: especialista.cod_especialista,
      nro_afiliado: usuario.id,
      ...(aceptaParticular ? { acepta_particular: true } : {}),
    })
      .then(() => navigate('/usuario', { state: { bookingSuccess: true } }))
      .catch((err) => {
        setIsSubmitting(false);
        setModalAlerta({
          show: true,
          titulo: 'Error al reservar',
          mensaje: err instanceof Error ? err.message : 'No se pudo confirmar el turno.',
          tipo: 'error'
        });
      });
  };

  const finish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!hora || !horariosDisponibles.includes(hora)) return;

    if (!pacienteActual || !especialista) {
      setModalAlerta({
        show: true,
        titulo: 'Error',
        mensaje: 'No se pudieron verificar los datos de cobertura. Intentá nuevamente.',
        tipo: 'error',
      });
      return;
    }

    const codOsPaciente = pacienteActual.obraSocial?.cod_os ?? pacienteActual.cod_os ?? null;
    const aceptaObraSocial = Boolean(
      codOsPaciente &&
      especialista.obrasSociales?.some((obraSocial) => obraSocial.cod_os === codOsPaciente),
    );

    setModalAlerta({
      show: true,
      titulo: aceptaObraSocial ? 'Confirmar turno' : 'Consulta particular',
      mensaje: aceptaObraSocial
        ? `¿Confirmás tu turno de ${especialidad?.nombre} con ${especialista?.nombre} para el día ${fecha} a las ${hora} hs?`
        : `El especialista no acepta tu obra social. La consulta deberá abonarse de forma particular por $${Number(especialista.consulta_particular ?? 0).toFixed(2)}. ¿Deseás continuar?`,
      tipo: 'confirm',
      onConfirm: () => ejecutarReserva(!aceptaObraSocial),
    });
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
                      <button className={`selection-card text-start w-100 ${especialista?.cod_especialista === item.cod_especialista ? 'selected' : ''}`} onClick={() => { setEspecialista(item); setHora(''); setHorariosDisponibles([]); setLoadingHorarios(Boolean(fecha)); }} onDoubleClick={() => { setEspecialista(item); setHora(''); setHorariosDisponibles([]); setLoadingHorarios(Boolean(fecha)); setStep(3); }}>
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    aria-label="Mes anterior"
                    disabled={displayedMonth.getFullYear() * 12 + displayedMonth.getMonth() <= minMonth}
                    onClick={() => setDisplayedMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                  >
                    <i className="bi bi-chevron-left" />
                  </button>
                  <h3 className="h6 fw-bold text-capitalize mb-0" aria-live="polite">
                    {displayedMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    aria-label="Mes siguiente"
                    disabled={displayedMonth.getFullYear() * 12 + displayedMonth.getMonth() >= maxMonth}
                    onClick={() => setDisplayedMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                  >
                    <i className="bi bi-chevron-right" />
                  </button>
                </div>
                <div className="calendar-grid calendar-head mb-2">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => <span key={day}>{day}</span>)}</div>
                <div className="calendar-grid">
                  {calendarDays.map((calendarDay) => {
                    const { date: day } = calendarDay;
                    const value = new Date(`${day}T12:00:00`);
                    const today = new Date(); today.setHours(0, 0, 0, 0);
                    const disabled = !calendarDay.isCurrentMonth || value < today || value > maxDate || value.getDay() === 0 || value.getDay() === 6;
                    return <button type="button" className={`calendar-day ${!calendarDay.isCurrentMonth ? 'adjacent-month' : ''} ${fecha === day ? 'selected' : ''}`} disabled={disabled} key={day} onClick={() => { setFecha(day); setHora(''); setHorariosDisponibles([]); setLoadingHorarios(Boolean(especialista?.cod_especialista)); }}>{value.getDate()}</button>;
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
                      onClick={() => setHora(item)}
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

      {/* MODAL / CARTEL INTEGRADO DE ALERTAS Y CONFIRMACIONES */}
      {modalAlerta.show && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className={`modal-header border-0 pb-0 ${modalAlerta.tipo === 'error' ? 'text-danger' : modalAlerta.tipo === 'success' ? 'text-success' : 'text-primary'}`}>
                <h5 className="modal-title fw-bold">
                  <i className={`bi ${modalAlerta.tipo === 'error' ? 'bi-exclamation-triangle-fill' : modalAlerta.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-question-circle-fill'} me-2`}></i>
                  {modalAlerta.titulo}
                </h5>
                <button type="button" className="btn-close" onClick={() => setModalAlerta({ ...modalAlerta, show: false })}></button>
              </div>
              <div className="modal-body py-4 text-center">
                <p className="mb-0 text-secondary fs-6">{modalAlerta.mensaje}</p>
              </div>
              <div className="modal-footer border-0 pt-0 justify-content-center pb-4">
                {modalAlerta.tipo === 'confirm' ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => setModalAlerta({ ...modalAlerta, show: false })}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger rounded-pill px-4"
                      onClick={() => {
                        const confirmCallback = modalAlerta.onConfirm;
                        setModalAlerta({ ...modalAlerta, show: false });
                        if (confirmCallback) confirmCallback();
                      }}
                    >
                      Aceptar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-5"
                    onClick={() => setModalAlerta({ ...modalAlerta, show: false })}
                  >
                    Entendido
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
