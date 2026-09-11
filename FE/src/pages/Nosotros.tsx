import React from 'react';
import { Link } from 'react-router-dom';

export const Nosotros: React.FC = () => {
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white sticky-top border-bottom py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <span className="icono-marca"><i className="bi bi-heart-pulse-fill"></i></span>
            <span className="fw-bold fs-5" style={{ color: 'var(--color-primario-oscuro)' }}>Vitalis</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Abrir menú">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav mx-auto gap-lg-1 py-2 py-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/especialidades">Especialidades</Link></li>
              <li className="nav-item"><Link className="nav-link active" to="/nosotros">Nosotros</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
            </ul>
            <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">Iniciar Sesión</Link>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <section className="fondo-punteado py-5">
        <div className="container text-center mx-auto" style={{ maxWidth: '700px' }}>
          <span className="etiqueta-superior rounded-pill mb-4">Conocé nuestra historia</span>
          <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', letterSpacing: '-0.02em' }}>
            Un equipo comprometido con <span className="texto-degradado">tu salud</span>
          </h1>
          <p className="text-muted fs-5">
            Detrás de cada turno, cada consulta y cada historial digital hay personas que trabajan
            para que tu experiencia sea simple, humana y confiable.
          </p>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="py-5 py-md-6">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="etiqueta-superior rounded-pill mb-3">Quiénes somos</span>
              <h2 className="fw-bold h1 mb-3" style={{ letterSpacing: '-0.02em' }}>Más de una década acompañando a nuestros pacientes</h2>
              <p className="text-muted mb-3">
                Vitalis nació con la idea de acercar la atención médica de calidad a más familias,
                combinando profesionales con años de trayectoria y una plataforma pensada para
                simplificar cada paso del proceso.
              </p>
              <p className="text-muted mb-3">
                Hoy somos un equipo interdisciplinario que integra medicina, tecnología y atención
                al paciente, trabajando todos los días para que gestionar tu salud sea una tarea
                sencilla y no una carga más.
              </p>
              <p className="text-muted mb-0">
                Creemos en una medicina cercana, basada en la evidencia y en el respeto por el
                tiempo de cada persona que confía en nosotros.
              </p>
            </div>

            <div className="col-lg-6">
              <div className="card border p-4">
                <div className="card-body p-0">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="icono-marca" style={{ width: '48px', height: '48px', fontSize: '1.3rem' }}><i className="bi bi-graph-up-arrow"></i></span>
                    <div>
                      <h3 className="h6 fw-bold mb-0">Vitalis en números</h3>
                      <p className="text-muted small mb-0">Resultados que respaldan nuestro trabajo</p>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <div className="border rounded-3 p-3 h-100">
                        <strong className="d-block fs-3 fw-bold" style={{ color: 'var(--color-primario-oscuro)' }}>12+</strong>
                        <span className="text-muted small">Años de trayectoria</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border rounded-3 p-3 h-100">
                        <strong className="d-block fs-3 fw-bold" style={{ color: 'var(--color-primario-oscuro)' }}>45</strong>
                        <span className="text-muted small">Profesionales activos</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border rounded-3 p-3 h-100">
                        <strong className="d-block fs-3 fw-bold" style={{ color: 'var(--color-primario-oscuro)' }}>30K+</strong>
                        <span className="text-muted small">Pacientes atendidos</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border rounded-3 p-3 h-100">
                        <strong className="d-block fs-3 fw-bold" style={{ color: 'var(--color-primario-oscuro)' }}>98%</strong>
                        <span className="text-muted small">Satisfacción general</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN / VISIÓN / COMPROMISO */}
      <section className="fondo-punteado py-5 py-md-6">
        <div className="container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '640px' }}>
            <span className="etiqueta-superior rounded-pill mb-3">Lo que nos guía</span>
            <h2 className="fw-bold mb-2">Misión, visión y compromiso</h2>
            <p className="text-muted mb-0">Los principios que definen cada decisión que tomamos como institución.</p>
          </div>

          <div className="row g-4 row-cols-1 row-cols-md-3">
            <div className="col">
              <div className="card border-0 shadow-sm h-100 p-4 tarjeta-interactiva">
                <div className="card-body p-0">
                  <span className="caja-icono mb-3"><i className="bi bi-bullseye fs-4"></i></span>
                  <h3 className="h5 fw-bold mb-2">Nuestra misión</h3>
                  <p className="text-muted small mb-0">Brindar atención médica accesible y de calidad, apoyada en herramientas digitales que simplifiquen la relación entre pacientes y profesionales.</p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card border-0 shadow-sm h-100 p-4 tarjeta-interactiva">
                <div className="card-body p-0">
                  <span className="caja-icono mb-3"><i className="bi bi-eye-fill fs-4"></i></span>
                  <h3 className="h5 fw-bold mb-2">Nuestra visión</h3>
                  <p className="text-muted small mb-0">Ser una referencia regional en salud digital, integrando innovación tecnológica sin perder jamás el trato humano en cada consulta.</p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card border-0 shadow-sm h-100 p-4 tarjeta-interactiva">
                <div className="card-body p-0">
                  <span className="caja-icono mb-3"><i className="bi bi-shield-check fs-4"></i></span>
                  <h3 className="h5 fw-bold mb-2">Nuestro compromiso</h3>
                  <p className="text-muted small mb-0">Cuidar cada dato, cada turno y cada interacción con la misma responsabilidad con la que cuidamos la salud de quienes confían en nosotros.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-5 py-md-6">
        <div className="container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '640px' }}>
            <span className="etiqueta-superior rounded-pill mb-3">Nuestros valores</span>
            <h2 className="fw-bold mb-2">Cómo trabajamos todos los días</h2>
            <p className="text-muted mb-0">Cuatro pilares presentes en cada área de la institución.</p>
          </div>

          <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4 text-center">
            <div className="col">
              <span className="icono-circular mb-3"><i className="bi bi-check-circle-fill fs-4"></i></span>
              <h4 className="h6 fw-bold mb-2">Confiabilidad</h4>
              <p className="text-muted small mb-0">Información clara y procesos transparentes en cada etapa de tu atención.</p>
            </div>
            <div className="col">
              <span className="icono-circular mb-3"><i className="bi bi-people-fill fs-4"></i></span>
              <h4 className="h6 fw-bold mb-2">Cercanía</h4>
              <p className="text-muted small mb-0">Atención personalizada, escuchando las necesidades de cada paciente.</p>
            </div>
            <div className="col">
              <span className="icono-circular mb-3"><i className="bi bi-lightbulb-fill fs-4"></i></span>
              <h4 className="h6 fw-bold mb-2">Innovación</h4>
              <p className="text-muted small mb-0">Tecnología aplicada para agilizar turnos, consultas y seguimientos.</p>
            </div>
            <div className="col">
              <span className="icono-circular mb-3"><i className="bi bi-shield-lock-fill fs-4"></i></span>
              <h4 className="h6 fw-bold mb-2">Responsabilidad</h4>
              <p className="text-muted small mb-0">Cuidado riguroso de tus datos e historial médico en todo momento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="fondo-punteado py-5 py-md-6">
        <div className="container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '640px' }}>
            <span className="etiqueta-superior rounded-pill mb-3">Nuestro equipo</span>
            <h2 className="fw-bold mb-2">Profesionales que te acompañan</h2>
            <p className="text-muted mb-0">Un grupo interdisciplinario listo para atender tus consultas.</p>
          </div>

          <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4 text-center">
            <div className="col">
              <div className="card border-0 shadow-sm h-100 p-4 tarjeta-interactiva">
                <div className="card-body p-0">
                  <div className="avatar-iniciales mb-3">CL</div>
                  <h4 className="h6 fw-bold mb-1">Dra. Carla Lorenzo</h4>
                  <div className="small fw-semibold mb-2" style={{ color: 'var(--color-primario-oscuro)' }}>Dirección Médica</div>
                  <p className="text-muted small mb-0">Más de 15 años de experiencia en gestión de instituciones de salud.</p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card border-0 shadow-sm h-100 p-4 tarjeta-interactiva">
                <div className="card-body p-0">
                  <div className="avatar-iniciales mb-3">RM</div>
                  <h4 className="h6 fw-bold mb-1">Dr. Rodrigo Medina</h4>
                  <div className="small fw-semibold mb-2" style={{ color: 'var(--color-primario-oscuro)' }}>Medicina General</div>
                  <p className="text-muted small mb-0">Especialista en atención primaria y seguimiento de pacientes crónicos.</p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card border-0 shadow-sm h-100 p-4 tarjeta-interactiva">
                <div className="card-body p-0">
                  <div className="avatar-iniciales mb-3">SA</div>
                  <h4 className="h6 fw-bold mb-1">Dra. Sofía Aguirre</h4>
                  <div className="small fw-semibold mb-2" style={{ color: 'var(--color-primario-oscuro)' }}>Pediatría</div>
                  <p className="text-muted small mb-0">Dedicada al cuidado integral de niños, niñas y adolescentes.</p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card border-0 shadow-sm h-100 p-4 tarjeta-interactiva">
                <div className="card-body p-0">
                  <div className="avatar-iniciales mb-3">FT</div>
                  <h4 className="h6 fw-bold mb-1">Fernando Torres</h4>
                  <div className="small fw-semibold mb-2" style={{ color: 'var(--color-primario-oscuro)' }}>Coordinación Administrativa</div>
                  <p className="text-muted small mb-0">A cargo de la gestión de turnos y la atención al paciente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-5 py-md-6">
        <div className="container">
          <div className="bg-dark rounded-4 text-center text-white p-5">
            <h2 className="fw-bold mb-3">¿Listo para empezar a cuidarte?</h2>
            <p className="text-light mx-auto mb-4" style={{ maxWidth: '520px' }}>
              Reservá tu turno online en minutos y sumate a la comunidad de pacientes que ya confían en nosotros.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/turnos" className="btn btn-primary btn-lg px-4">Agendar Turno Online</Link>
              <Link to="/contacto" className="btn btn-outline-light btn-lg px-4">Contactar al equipo</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-light footer-oscuro pt-5">
        <div className="container">
          <div className="row gy-4 pb-5">

            <div className="col-lg-4 col-md-6">
              <Link className="navbar-brand d-flex align-items-center gap-2 mb-3" to="/">
                <span className="icono-marca"><i className="bi bi-heart-pulse-fill"></i></span>
                <span className="fw-bold fs-5 text-white">Vitalis</span>
              </Link>
              <p className="small" style={{ maxWidth: '260px' }}>
                Un equipo de profesionales pensando en vos: acompañamiento cercano, información clara
                y un sistema pensado para simplificar cada consulta.
              </p>
            </div>

            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="fw-bold text-white mb-3">Enlaces Rápidos</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/especialidades">Especialidades</Link></li>
                <li><Link to="/nosotros">Nosotros</Link></li>
                <li><Link to="/contacto">Contacto administrativo</Link></li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 col-6">
              <h6 className="fw-bold text-white mb-3">Horarios</h6>
              <div className="horario-footer small mb-3">
                <strong>Consultas Externas:</strong><br />
                Lunes a Viernes<br />08:00 a 20:00 hs
              </div>
              <div className="horario-footer small mb-3">
                <strong>Sábados:</strong><br />
                08:00 a 13:00 hs
              </div>
              <div className="horario-footer small">
                <strong>Guardias Médicas:</strong><br />
                <span className="activo-ahora">Activa las 24 horas</span>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-white mb-3">Novedades y Bienestar</h6>
              <p className="small">Sumate a nuestra lista y recibí recomendaciones prácticas de nuestro equipo médico cada mes.</p>
              <form className="input-group" onSubmit={(e) => e.preventDefault()}>
                <input type="email" className="form-control" placeholder="Tu correo electrónico" required />
                <button className="btn btn-primary" type="submit" aria-label="Suscribirse">
                  <i className="bi bi-send-fill"></i>
                </button>
              </form>
            </div>

          </div>

          <div className="border-top border-secondary-subtle py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
            <small className="text-muted-dark">© 2026 Vitalis S.A. Todos los derechos reservados. Plataforma desarrollada íntegramente en la web.</small>
            <div className="d-flex gap-4">
              <Link to="/terminos" className="small">Términos de servicio</Link>
              <Link to="/privacidad" className="small">Políticas de privacidad</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};