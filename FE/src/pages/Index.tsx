import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/PublicLayout';
import { getEspecialidades } from '../../services/especialidadService';
import type { Especialidad } from '../../services/especialidadService';

export const Index: React.FC = () => {
const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  getEspecialidades()
    .then(setEspecialidades)
    .catch((err: Error) => setError(err.message))
    .finally(() => setLoading(false));
}, []);
  return (
    
    <PublicLayout>
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

        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="fw-bold mb-1">Nuestras especialidades</h2>
            <p className="text-muted mb-4">Elegí una para ver sus profesionales.</p>

            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando…</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-warning" role="alert">
                No pudimos cargar las especialidades. {error}
              </div>
            )}

            {!loading && !error && especialidades.length === 0 && (
              <p className="text-muted">Todavía no hay especialidades cargadas.</p>
            )}

            <div className="row g-3">
              {especialidades.slice(0, 6).map((esp) => (
                <div className="col-6 col-md-4" key={esp.cod_especialidad}>
                  <Link
                    to={`/especialistas?especialidad=${esp.cod_especialidad}`}
                    className="card border-0 shadow-sm h-100 p-3 text-decoration-none"
                  >
                    <span className="fw-semibold text-dark">{esp.nombre}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
      </section>
    </PublicLayout>
  );
};