import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    recordar: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = 'afiliado@vitalis.com';
    const password = 'vitalis123';

    if (formData.email.trim().toLowerCase() !== email || formData.password !== password) {
      setError('El correo o la contraseña no son correctos.');
      return;
    }

    sessionStorage.setItem('vitalis-authenticated', 'true');
    navigate('/usuario');
  };

  return (
    <div className="fondo-punteado min-vh-100">
      <div className="login-wrapper d-flex align-items-center justify-content-center min-vh-100 py-5">
        <div className="login-card">

          {/* Marca / Volver a inicio */}
          <div className="text-center mb-4">
            <Link to="/" className="d-inline-block text-decoration-none mb-3">
              <div className="icono-marca mx-auto">
                <i className="bi bi-lock-fill"></i>
              </div>
            </Link>
            <h1 className="h3 font-display mb-1">Bienvenido</h1>
            <p className="text-muted mb-0">Ingresá tus datos para acceder a tu cuenta</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="nombre@gmail.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="recordar" 
                  checked={formData.recordar} 
                  onChange={handleChange} 
                />
                <label className="form-check-label small text-muted" htmlFor="recordar">
                  Recuérdame
                </label>
              </div>
              <Link to="/recuperar-password" className="small link-primario">¿Olvidaste tu contraseña?</Link>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 mb-3">
              Iniciar sesión
            </button>

            <p className="text-center text-muted small mb-0">
              ¿No tenés cuenta? <Link to="/registro" className="link-primario fw-semibold">Registrate</Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};