import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Registro: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    emailRegistro: '',
    passwordRegistro: '',
    confirmarPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registro intent:', formData);
  };

  return (
    <div className="fondo-punteado min-vh-100">
      <div className="registro-wrapper d-flex align-items-center justify-content-center min-vh-100 py-5">
        <div className="registro-card">

          {/* Marca / Volver a inicio */}
          <div className="text-center mb-4">
            <Link to="/" className="d-inline-block text-decoration-none mb-3">
              <div className="icono-marca mx-auto">
                <i className="bi bi-person-plus-fill"></i>
              </div>
            </Link>
            <h1 className="h3 font-display mb-1">Creá tu cuenta</h1>
            <p className="text-muted mb-0">Completá tus datos para comenzar</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6 mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="nombre" 
                  placeholder="Juan" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="col-6 mb-3">
                <label htmlFor="apellido" className="form-label">Apellido</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="apellido" 
                  placeholder="Pérez" 
                  value={formData.apellido} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label htmlFor="dni" className="form-label">DNI</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="dni" 
                  placeholder="38.123.456" 
                  value={formData.dni} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="col-6 mb-3">
                <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento</label>
                <input 
                  type="date" 
                  className="form-control" 
                  id="fechaNacimiento" 
                  value={formData.fechaNacimiento} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <input 
                type="tel" 
                className="form-control" 
                id="telefono" 
                placeholder="+54 9 11 1234-5678" 
                value={formData.telefono} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="emailRegistro" className="form-label">Correo electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                id="emailRegistro" 
                placeholder="nombre@gmail.com" 
                value={formData.emailRegistro} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label htmlFor="passwordRegistro" className="form-label">Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="passwordRegistro" 
                  placeholder="••••••••" 
                  value={formData.passwordRegistro} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="col-6 mb-3">
                <label htmlFor="confirmarPassword" className="form-label">Confirmar contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="confirmarPassword" 
                  placeholder="••••••••" 
                  value={formData.confirmarPassword} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 mb-3">
              Crear cuenta
            </button>

            <p className="text-center text-muted small mb-0">
              ¿Ya tenés cuenta? <Link to="/login" className="link-primario fw-semibold">Iniciá sesión</Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};