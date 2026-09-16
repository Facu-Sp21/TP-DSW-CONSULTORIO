import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getEspecialistas, getEspecialistasByEspecialidad } from '../../services/especialistaService';
import type { Especialista } from '../../services/especialistaService';

export const Especialistas: React.FC = () => {
  const navigate = useNavigate();
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  
  const [searchParams] = useSearchParams();
  const especialidadIdParam = searchParams.get('especialidad');

  useEffect(() => {
    setLoading(true);
    const fetchPromise = especialidadIdParam 
      ? getEspecialistasByEspecialidad(Number(especialidadIdParam))
      : getEspecialistas();

    fetchPromise
      .then((data: Especialista[]) => {
        setEspecialistas(data);
        setLoading(false);
      })
      .catch((err: { message?: string }) => {
        setError(err.message || 'Error al conectar con el servidor');
        setLoading(false);
      });
  }, [especialidadIdParam]);

  const especialistasFiltrados = especialistas.filter((esp) =>
    esp.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    esp.matricula.toLowerCase().includes(busqueda.toLowerCase())
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
              <li className="nav-item"><Link className="nav-link" to="/especialidades">Especialidades</Link></li>
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
          <span className="etiqueta-superior rounded-pill mb-4">Nuestros profesionales</span>
          <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', letterSpacing: '-0.02em' }}>
            Especialistas al cuidado de <span className="texto-degradado">tu salud</span>
          </h1>
          <p className="text-muted fs-5">
            Conocé al equipo médico, sus matrículas y ponete en contacto para solicitar tu atención.
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
              placeholder="Buscar por nombre o matrícula..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button type="submit" className="btn btn-primary px-4">Buscar</button>
          </form>
        </div>
      </section>

      {/* GRID DE ESPECIALISTAS */}
      <section className="pb-5 pb-md-6">
        <div className="container">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted mt-2">Cargando profesionales desde la base de datos...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center my-4" role="alert">
              {error}. Por favor verificá que el backend esté corriendo.
            </div>
          )}

          {!loading && !error && especialistasFiltrados.length === 0 && (
            <div className="text-center py-4 text-muted">
              No se encontraron profesionales {busqueda ? `que coincidan con "${busqueda}"` : 'disponibles'}.
            </div>
          )}

          {!loading && !error && (
            <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
              {especialistasFiltrados.map((item) => (
                <div className="col" key={item.cod_especialista}>
                  <div className="card tarjeta-especialidad border h-100 p-4" onDoubleClick={() => navigate('/sacar-turno')} title="Doble clic para sacar un turno">
                    <div className="card-body p-0">
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <span className="caja-icono"><i className="bi bi-person-badge fs-4"></i></span>
                        <span className="badge rounded-pill" style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primario-oscuro)' }}>
                          {item.matricula}
                        </span>
                      </div>
                      <h3 className="h5 fw-bold mb-2">{item.nombre}</h3>
                      <p className="text-muted small mb-3">
                        <i className="bi bi-telephone me-2"></i>{item.telefono}
                      </p>
                      <button className="btn btn-primary w-full rounded-pill mt-2 w-100" onClick={() => navigate('/sacar-turno')}>
                        Solicitar Turno
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                Un equipo de profesionales pensando en vos: acompañamiento cercano e información clara.
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
          </div>
          <div className="border-top border-secondary-subtle py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
            <small className="text-muted-dark">© 2026 Vitalis S.A. Todos los derechos reservados.</small>
          </div>
        </div>
      </footer>
    </>
  );
};