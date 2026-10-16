import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEspecialidades } from '../../services/especialidadService';
import type { Especialidad } from '../../services/especialidadService';
import { PublicLayout } from '../components/PublicLayout';

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
    <PublicLayout activo="/especialidades">
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
    </PublicLayout>
  );
};