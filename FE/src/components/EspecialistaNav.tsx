import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const EspecialistaNav: React.FC = () => {
  // NavLink es como Link, pero sabe si su ruta es la actual (isActive) para poder resaltarla
  const estiloEnlace = ({ isActive }: { isActive: boolean }) =>
    `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-primary'}`;

  return (
    <nav className="navbar bg-white border-bottom py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/especialista">
          <span className="icono-marca"><i className="bi bi-heart-pulse-fill"></i></span>
          <span className="fw-bold fs-5" style={{ color: 'var(--color-primario-oscuro)' }}>Vitalis</span>
          <span className="badge text-bg-light border ms-1">Profesionales</span>
        </Link>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <NavLink className={estiloEnlace} to="/especialista" end>
            <i className="bi bi-calendar-week me-1"></i>Agenda
          </NavLink>
          {/* Cuando exista el login, acá va el botón "Salir" */}
          <Link className="btn btn-sm btn-outline-secondary" to="/">Volver al sitio</Link>
        </div>
      </div>
    </nav>
  );
};