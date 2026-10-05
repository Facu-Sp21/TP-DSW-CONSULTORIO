import React from 'react';
import { Link } from 'react-router-dom';

interface PublicLayoutProps {
  activo?: string; // ruta del link a resaltar, por ejemplo '/nosotros'
  children: React.ReactNode;
}

const ENLACES = [
  { to: '/', etiqueta: 'Inicio' },
  { to: '/especialidades', etiqueta: 'Especialidades' },
  { to: '/nosotros', etiqueta: 'Nosotros' },
  { to: '/contacto', etiqueta: 'Contacto' },
];

export const PublicLayout: React.FC<PublicLayoutProps> = ({ activo = '/', children }) => {
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
                        {ENLACES.map((e) => (
                         <li className="nav-item" key={e.to}>
                            <Link className={`nav-link ${activo === e.to ? 'active' : ''}`} to={e.to}>
                                {e.etiqueta}
                            </Link>
                        </li>
                        ))}
                    </ul>
                  <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">Iniciar Sesión</Link>
                </div>
              </div>
            </nav>

      {children}

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