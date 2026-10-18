import { useState } from 'react';


const turnoPrueba = {
  fecha: '18/10/2026',
  hora: '10:00',
  especialista: 'Dra. Especialista de prueba'
};

export  function ConfirmarAsistencia() {
  const [respuesta, setRespuesta] = useState<'confirmado' | 'cancelado' | null>(null);
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
                      <strong>{turnoPrueba.fecha}</strong>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <i className="bi bi-clock text-primary fs-5" />
                    <div>
                      <small className="text-secondary d-block">Hora</small>
                      <strong>{turnoPrueba.hora}</strong>
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <i className="bi bi-person-badge text-primary fs-5" />
                    <div>
                      <small className="text-secondary d-block">Especialista</small>
                      <strong>{turnoPrueba.especialista}</strong>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-3 d-sm-flex">
                  <button
                    type="button"
                    className="btn btn-primary flex-fill py-3"
                    onClick={() => setRespuesta('confirmado')}
                  >
                    <i className="bi bi-check-circle me-2" />
                    Confirmar asistencia
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger flex-fill py-3"
                    onClick={() => setRespuesta('cancelado')}
                  >
                    <i className="bi bi-x-circle me-2" />
                    Cancelar turno
                  </button>
                </div>

                {respuesta === 'confirmado' && (
                  <p className="respuesta-turno__mensaje respuesta-turno__mensaje--confirmado">
                    <i className="bi bi-check-circle-fill me-2" />
                    Asistencia confirmada. Por ahora es una prueba visual.
                  </p>
                )}

                {respuesta === 'cancelado' && (
                  <p className="respuesta-turno__mensaje respuesta-turno__mensaje--cancelado">
                    <i className="bi bi-x-circle-fill me-2" />
                    Turno cancelado. Por ahora es una prueba visual.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );

  
}