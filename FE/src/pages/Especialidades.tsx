import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEspecialidades } from '../../services/especialidadService';
import type { Especialidad } from '../../services/especialidadService';

export const Especialidades: React.FC = () => {
  const navigate = useNavigate();
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');

  useEffect(() => {
    getEspecialidades()
      .then((data: Especialidad[]) => {
        setEspecialidades(data);
        setLoading(false);
      })
      .catch((err: { message?: string }) => {
        setError(err.message || 'Error al conectar con el servidor');
        setLoading(false);
      });
  }, []);

  // Filtrado en tiempo real según el término ingresado en el buscador
  const especialidadesFiltradas = especialidades.filter((esp) =>
    esp.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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
              <li className="nav-item"><Link className="nav-link active" to="/especialidades">Especialidades</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
            </ul>
            <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">Iniciar Sesión</Link>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <section className="fondo-punteado py-5">
        <div className="container text-center mx-auto" style={{ maxWidth: '700px' }}>
          <span className="etiqueta-superior rounded-pill mb-4">Nuestras especialidades</span>
          <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', letterSpacing: '-0.02em' }}>
            Un especialista para <span className="texto-degradado">cada etapa de tu vida</span>
          </h1>
          <p className="text-muted fs-5">
            Encontrá al profesional indicado según lo que necesites y reservá tu turno en pocos clics.
          </p>
        </div>
      </section>

      {/* BUSCADOR */}
      <section className="py-5">
        <div className="container d-flex justify-content-center">
          <form className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden" style={{ maxWidth: '560px' }} onSubmit={(e) => e.preventDefault()}>
            <span className="input-group-text bg-white border-0 ps-4"><i className="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              className="form-control border-0" 
              placeholder="Buscar por especialidad, ej: Pediatría, Cardiología..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button type="submit" className="btn btn-primary px-4">Buscar</button>
          </form>
        </div>
      </section>

      {/* GRID DE ESPECIALIDADES */}
      <section className="pb-5 pb-md-6">
        <div className="container">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted mt-2">Cargando especialidades desde la base de datos...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center my-4" role="alert">
              {error}. Por favor verificá que el backend esté corriendo.
            </div>
          )}

          {!loading && !error && especialidadesFiltradas.length === 0 && (
            <div className="text-center py-4 text-muted">
              No se encontraron especialidades que coincidan con "{busqueda}".
            </div>
          )}

          {!loading && !error && (
            <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
              {especialidadesFiltradas.map((item) => (
                <div className="col" key={item.cod_especialidad}>
                  <div className="card tarjeta-especialidad border h-100 p-4" onDoubleClick={() => navigate(`/sacar-turno?especialidad=${item.cod_especialidad}`)} title="Doble clic para sacar un turno">
                    <div className="card-body p-0">
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <span className="caja-icono"><i className="bi bi-clipboard2-pulse fs-4"></i></span>
                        <span className="badge rounded-pill" style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primario-oscuro)' }}>
                          Código #{item.cod_especialidad}
                        </span>
                      </div>
                      <h3 className="h5 fw-bold mb-2">{item.nombre}</h3>
                      <p className="text-muted small">Consultas de rutina, diagnóstico especializado y seguimiento del paciente.</p>
                      <Link to={`/profesionales?especialidad=${item.cod_especialidad}`} className="fw-semibold small text-decoration-none" style={{ color: 'var(--color-primario-oscuro)' }}>
                        Ver profesionales <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BLOQUE DE AYUDA */}
      <section className="pb-5 pb-md-6">
        <div className="container">
          <div className="card fondo-punteado border p-4 p-md-5">
            <div className="card-body p-0 d-flex flex-wrap align-items-center justify-content-between gap-4">
              <div className="d-flex align-items-start gap-3" style={{ maxWidth: '560px' }}>
                <span className="icono-marca" style={{ width: '48px', height: '48px', fontSize: '1.3rem' }}>
                  <i className="bi bi-question-circle-fill"></i>
                </span>
                <div>
                  <h3 className="h6 fw-bold mb-1">¿No sabés qué especialidad necesitás?</h3>
                  <p className="text-muted small mb-0">Escribinos y nuestro equipo administrativo te va a orientar para coordinar el turno con el profesional adecuado.</p>
                </div>
              </div>
              <Link to="/contacto" className="btn btn-primary">Contactar al equipo</Link>
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
              <a href="#" className="small">Términos de servicio</a>
              <a href="#" className="small">Políticas de privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};