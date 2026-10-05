import React from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/PublicLayout';

export const Index: React.FC = () => {
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

    </PublicLayout>
  );
};