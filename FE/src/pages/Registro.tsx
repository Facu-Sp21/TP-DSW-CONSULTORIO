import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPaciente } from '../../services/pacienteService';
import { login, rutaSegunRol } from '../../services/authService';

const getTodayInputValue = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

export const Registro: React.FC = () => {
  const navigate = useNavigate();
  const todayInputValue = getTodayInputValue();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    emailRegistro: '',
    passwordRegistro: '',
    confirmarPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.passwordRegistro !== formData.confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (formData.fechaNacimiento > todayInputValue) {
      setError('La fecha de nacimiento no puede ser posterior a la fecha de hoy.');
      return;
    }

    setIsSubmitting(true);
    try {
      // El backend guarda un único campo "nombre", así que combinamos nombre + apellido
      await createPaciente({
        nombre: `${formData.nombre} ${formData.apellido}`.trim(),
        dni: formData.dni,
        telefono: formData.telefono,
        direccion: formData.direccion,
        email: formData.emailRegistro,
        contrasena: formData.passwordRegistro,
      });

      // Una vez creada la cuenta, logueamos automáticamente al paciente
      const { user } = await login(formData.emailRegistro, formData.passwordRegistro);
      navigate(rutaSegunRol(user.rol));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos crear tu cuenta. Intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
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
                  max={todayInputValue}
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
              <label htmlFor="direccion" className="form-label">Dirección</label>
              <input 
                type="text" 
                className="form-control" 
                id="direccion" 
                placeholder="Av. Siempre Viva 742" 
                value={formData.direccion} 
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

            {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}

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

            <button type="submit" className="btn btn-primary w-100 py-2 mb-3" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
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
