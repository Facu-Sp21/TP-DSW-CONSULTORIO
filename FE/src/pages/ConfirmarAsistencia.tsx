import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {confirmacionTurno, getTurnoDelCorreo, type TurnoDelCorreo} from '../../services/turnoService';


export  function ConfirmarAsistencia() {
  const [respuesta, setRespuesta] = useState<'confirmado' | 'cancelado' | null>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turno, setTurno] = useState<TurnoDelCorreo | null>(null);
  const [cargandoTurno, setCargandoTurno] = useState(true);

  useEffect(() => {
  async function cargarTurno() {
    if (!token) {
      setError('El enlace para gestionar el turno es inválido.');
      setCargandoTurno(false);
      return;
    }

    try {
      const datos = await getTurnoDelCorreo(token);
      setTurno(datos);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el turno.',
      );
    } finally {
      setCargandoTurno(false);
    }
  }

  cargarTurno();
}, [token]);

async function responder(accion: 'confirmar' | 'cancelar') {
  if (!token) {
    setError('El enlace para gestionar el turno es inválido o está incompleto.');
    return;
  }

  setCargando(true);
  setError(null);

  try {
    const datos = await confirmacionTurno({
  token,
  accion,
});

setRespuesta(
  datos.estado === 'CONFIRMADO' ? 'confirmado' : 'cancelado',
);

  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : 'Ocurrió un error al gestionar el turno.',
    );
  } finally {
    setCargando(false);
  }
}

   return (
    <main className="fondo-punteado min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            <section className="respuesta-turno-card">
              <div className="respuesta-turno-card__contenido">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="icono-marca">
                    <i className="bi bi-calendar-check" />
                  </div>

                  <div>
                    <span className="etiqueta-superior">
                      Gestión de turno
                    </span>

                    <h1 className="font-display mt-3 mb-0">
                      Confirmá tu asistencia
                    </h1>
                  </div>
                </div>

                <p className="text-secondary mb-4">
                  Por favor, confirmá tu asistencia o cancelá el turno
                  si no podés concurrir.
                </p>

                <div className="turno-recordatorio rounded-4 p-4 mb-4">
                  <div className="d-flex gap-3 mb-3">
                    <i className="bi bi-calendar3 text-primary fs-5" />
                    <div>
                      <small className="text-secondary d-block">Fecha</small>
                      <strong>{turno?.fecha ?? 'Cargando...'}</strong>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <i className="bi bi-clock text-primary fs-5" />
                    <div>
                      <small className="text-secondary d-block">Hora</small>
                      <strong>{turno?.hora_inicio ?? 'Cargando...'}</strong>
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <i className="bi bi-person-badge text-primary fs-5" />
                    <div>
                      <small className="text-secondary d-block">Especialista</small>
                      <strong>{turno?.especialista.nombre ?? 'Cargando...'}</strong>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-3 d-sm-flex">
                  <button
                    type="button"
                    className="btn btn-primary flex-fill py-3"
                    onClick={() => responder('confirmar')}
                    disabled={cargando || cargandoTurno || respuesta !== null || !turno}
                  >
                    <i className="bi bi-check-circle me-2" />
                    Confirmar asistencia
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger flex-fill py-3"
                    onClick={() => responder('cancelar')}
                    disabled={cargando || cargandoTurno || respuesta !== null || !turno}
                  >
                    <i className="bi bi-x-circle me-2" />
                    Cancelar turno
                  </button>
                </div>

                {respuesta === 'confirmado' && (
                  <p className="respuesta-turno__mensaje respuesta-turno__mensaje--confirmado">
                    <i className="bi bi-check-circle-fill me-2" />
                    Asistencia confirmada correctamente.
                  </p>
                )}

                {respuesta === 'cancelado' && (
                  <p className="respuesta-turno__mensaje respuesta-turno__mensaje--cancelado">
                    <i className="bi bi-x-circle-fill me-2" />
                    Turno cancelado correctamente.
                  </p>
                )}

                {error && (
                  <div className="alert alert-danger mt-4 mb-0">
                  <i className="bi bi-exclamation-circle me-2" />
                  {error}
                </div>
)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );

  
}