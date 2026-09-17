import React from 'react';
import { Link } from 'react-router-dom';

export const Index: React.FC = () => {
  return (
    <>
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
              <li className="nav-item"><Link className="nav-link active" to="/">Inicio</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/especialidades">Especialidades</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
            </ul>
            <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">Iniciar Sesión</Link>
          </div>
        </div>
      </nav>

      <section className="fondo-punteado py-5 py-md-6">
        <div className="container text-center mx-auto" style={{ maxWidth: '860px' }}>
          <span className="etiqueta-superior rounded-pill mb-4">Turnos online, sin filas ni esperas</span>

          <h1 className="fw-bold mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', letterSpacing: '-0.02em' }}>
            Tu bienestar, <span className="texto-degradado">gestionado de forma simple</span> y acompañado por profesionales
          </h1>

          <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: '620px' }}>
            Elegí tu especialista, coordiná el turno que mejor se adapte a tu rutina
            y llevá el seguimiento de tus consultas desde un solo lugar, cuando y donde lo necesites.
          </p>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/login" className="btn btn-primary btn-lg px-4">
              <i className="bi bi-calendar-check me-2"></i>Agendar Turno Online
            </Link>
            <Link to="/especialidades" className="btn btn-outline-secondary btn-lg px-4">
              Ver Especialidades
            </Link>
          </div>
        </div>
      </section>

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
              <a href="#" className="small">Términos de servicio</a>
              <a href="#" className="small">Políticas de privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};