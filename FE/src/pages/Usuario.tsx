import React, { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

export interface Turno {
  id: string;
  especialidad: string;
  especialista: string;
  fecha: string;
  hora: string;
}

const initialTurnos: Turno[] = [
  { id: 'demo-1', especialidad: 'Clínica médica', especialista: 'Dra. Laura Fernández', fecha: '2026-09-17', hora: '10:30' },
];

export function getTurnos(): Turno[] {
  const saved = localStorage.getItem('vitalis-turnos');
  if (!saved) return initialTurnos;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : initialTurnos;
  } catch {
    return initialTurnos;
  }
}

const formatDate = (date: string) => new Intl.DateTimeFormat('es-AR', {
  weekday: 'long', day: 'numeric', month: 'long',
}).format(new Date(`${date}T12:00:00`));

const sortTurnos = (turnos: Turno[]) => [...turnos].sort((a, b) =>
  `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));

export interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
}

export function buildMonthCalendar(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingDays = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const result: CalendarDay[] = [];

  for (let index = 0; index < totalCells; index += 1) {
    const dayOffset = index - leadingDays + 1;
    const date = new Date(year, month, dayOffset);
    result.push({
      date: date.toISOString().slice(0, 10),
      isCurrentMonth: dayOffset >= 1 && dayOffset <= daysInMonth,
    });
  }

  return result;
}

export const UserNavigation: React.FC = () => {
  const navigate = useNavigate();
  const cerrarSesion = () => {
    sessionStorage.removeItem('vitalis-authenticated');
    navigate('/login');
  };

  return (
    <nav className="navbar bg-white border-bottom py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/usuario">
          <span className="icono-marca"><i className="bi bi-heart-pulse-fill" /></span>
          <span className="fw-bold fs-5" style={{ color: 'var(--color-primario-oscuro)' }}>Vitalis</span>
        </Link>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link className="btn btn-sm btn-link text-decoration-none" to="/usuario">
            <i className="bi bi-house me-1" />Inicio
          </Link>
          <Link className="btn btn-sm btn-primary" to="/sacar-turno">
            <i className="bi bi-calendar-plus me-1" />Sacar turno
          </Link>
          <Link className="btn btn-sm btn-outline-primary" to="/calendario">
            <i className="bi bi-calendar3 me-1" />Calendario
          </Link>
          <button className="btn btn-outline-secondary btn-sm" onClick={cerrarSesion}>
            <i className="bi bi-box-arrow-right me-1" />Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export const Usuario: React.FC = () => {
  const turnos = useMemo(getTurnos, []);
  const location = useLocation();
  const [showFeedback, setShowFeedback] = useState(Boolean(location.state?.bookingSuccess));
  if (sessionStorage.getItem('vitalis-authenticated') !== 'true') return <Navigate to="/login" replace />;

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - (today.getDay() || 7) + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  const turnosSemana = turnos.filter((turno) => {
    const date = new Date(`${turno.fecha}T${turno.hora}:00`);
    return date >= weekStart && date < weekEnd;
  });

  return (
    <div className="min-vh-100 bg-light">
      <UserNavigation />
      <main className="container py-5">
        {showFeedback && (
          <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
            <i className="bi bi-check-circle-fill me-2" />
            <strong>Turno confirmado.</strong> Ya podés verlo en tu calendario y en el recordatorio semanal.
            <button type="button" className="btn-close" onClick={() => setShowFeedback(false)} aria-label="Cerrar" />
          </div>
        )}
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <span className="etiqueta-superior rounded-pill mb-3">Mi espacio de salud</span>
            <h1 className="fw-bold mb-1">Hola, Martín</h1>
            <p className="text-muted mb-0">Gestioná tus próximos turnos de forma simple.</p>
          </div>
          <Link to="/sacar-turno" className="btn btn-primary px-4">
            <i className="bi bi-plus-lg me-2" />Sacar un turno
          </Link>
        </div>
        <section className="card border-0 shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="h5 fw-bold mb-1">Recordatorio semanal</h2>
              <p className="small text-muted mb-0">Tus turnos próximos de esta semana</p>
            </div>
            <span className="badge rounded-pill text-bg-primary">{turnosSemana.length} turno{turnosSemana.length === 1 ? '' : 's'}</span>
          </div>
          {turnosSemana.length === 0 ? (
            <div className="fondo-punteado rounded p-4 text-center">
              <i className="bi bi-calendar2-check fs-2 text-primary" />
              <p className="mb-0 mt-2 text-muted">No tenés turnos agendados esta semana.</p>
            </div>
          ) : (
            <div className="row g-3">
              {sortTurnos(turnosSemana).map((turno) => <TurnoCard turno={turno} key={turno.id} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const TurnoCard: React.FC<{ turno: Turno }> = ({ turno }) => (
  <div className="col-md-6">
    <div className="turno-recordatorio d-flex gap-3 align-items-center p-3 rounded">
      <span className="caja-icono"><i className="bi bi-calendar-heart fs-4" /></span>
      <div>
        <strong className="d-block">{turno.especialidad}</strong>
        <span className="small text-muted">{turno.especialista}</span>
        <span className="d-block small text-primary fw-semibold">{formatDate(turno.fecha)} · {turno.hora} hs</span>
      </div>
    </div>
  </div>
);

export const Calendario: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const turnos = useMemo(() => sortTurnos(getTurnos()), []);
  if (sessionStorage.getItem('vitalis-authenticated') !== 'true') return <Navigate to="/login" replace />;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 1);
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const calendarDays = buildMonthCalendar(firstDay.getFullYear(), firstDay.getMonth());
  const selectedTurnos = selectedDate ? turnos.filter((turno) => turno.fecha === selectedDate) : [];

  return (
    <div className="min-vh-100 bg-light">
      <UserNavigation />
      <main className="container py-5">
        <div className="mb-4">
          <span className="etiqueta-superior rounded-pill mb-3">Agenda personal</span>
          <h1 className="fw-bold mb-1">Calendario de turnos</h1>
          <p className="text-muted">Consultá tus turnos por día o revisá la agenda completa.</p>
        </div>
        <div className="row g-4">
          <section className="col-lg-7">
            <div className="card border-0 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">Próximos 30 días</h2>
                <span className="small text-muted">Hasta {maxDate.toLocaleDateString('es-AR')}</span>
              </div>
              <div className="calendar-grid calendar-head mb-2">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => <span key={day}>{day}</span>)}</div>
              <div className="calendar-grid">
                {calendarDays.map((calendarDay) => {
                  const { date } = calendarDay;
                  const value = new Date(`${date}T12:00:00`);
                  const hasTurno = turnos.some((turno) => turno.fecha === date);
                  const disabled = !calendarDay.isCurrentMonth || value < today || value > maxDate || value.getDay() === 0 || value.getDay() === 6;
                  return <button type="button" className={`calendar-day ${!calendarDay.isCurrentMonth ? 'adjacent-month' : ''} ${selectedDate === date ? 'selected' : ''}`} disabled={disabled} key={date} onClick={() => setSelectedDate(date)}>{value.getDate()}{hasTurno && <i className="calendar-dot" />}</button>;
                })}
              </div>
            </div>
          </section>
          <section className="col-lg-5">
            <div className="card border-0 shadow-sm p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">{selectedDate ? formatDate(selectedDate) : 'Todos tus turnos'}</h2>
                {selectedDate && <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedDate(null)}>Ver todos</button>}
              </div>
              {(selectedDate ? selectedTurnos : turnos).length === 0 ? <p className="text-muted mb-0">No hay turnos para mostrar.</p> : (
                <div className="d-flex flex-column gap-3">
                  {(selectedDate ? selectedTurnos : turnos).map((turno) => (
                    <div className="agenda-item" key={turno.id}>
                      <span className="agenda-hora">{turno.hora}</span>
                      <div><strong>{turno.especialidad}</strong><small className="d-block text-muted">{turno.especialista}</small><small className="d-block text-primary">{formatDate(turno.fecha)}</small></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
