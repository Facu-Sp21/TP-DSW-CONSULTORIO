import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

export const EspecialistaNav: React.FC = () => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar bg-white border-bottom py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/especialista">
          <span className="icono-marca"><i className="bi bi-heart-pulse-fill"></i></span>
          <span className="fw-bold fs-5" style={{ color: 'var(--color-primario-oscuro)' }}>Vitalis</span>
        </Link>

        <button type="button" className="btn btn-outline-danger rounded-pill px-4" onClick={cerrarSesion}>
          <i className="bi bi-box-arrow-right me-1"></i>Salir
        </button>
      </div>
    </nav>
  );
};