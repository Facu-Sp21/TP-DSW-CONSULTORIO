import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CampoFormulario } from '../components/CampoFormulario';
import { login, rutaSegunRol } from '../../services/authService';
import { ApiError } from '../../services/api';
import { validarEmail, validarPasswordLogin } from '../../services/validaciones';

type Campo = 'email' | 'password';
type Errores = Partial<Record<Campo, string>>;

const CAMPOS: Campo[] = ['email', 'password'];

function validarCampo(campo: Campo, datos: Record<Campo, string>): string {
  return campo === 'email' ? validarEmail(datos.email) : validarPasswordLogin(datos.password);
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<Campo, string>>({ email: '', password: '' });
  const [errores, setErrores] = useState<Errores>({});
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [credencialesInvalidas, setCredencialesInvalidas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const campo = e.target.id as Campo;
    const nuevo = { ...formData, [campo]: e.target.value };
    setFormData(nuevo);
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: validarCampo(campo, nuevo) }));
    setErrorServidor(null);
    setCredencialesInvalidas(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const campo = e.target.id as Campo;
    setErrores((prev) => ({ ...prev, [campo]: validarCampo(campo, formData) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorServidor(null);
    setCredencialesInvalidas(false);

    const nuevosErrores: Errores = {};
    for (const campo of CAMPOS) {
      const mensaje = validarCampo(campo, formData);
      if (mensaje) nuevosErrores[campo] = mensaje;
    }
    setErrores(nuevosErrores);
    const primero = CAMPOS.find((campo) => nuevosErrores[campo]);
    if (primero) {
      document.getElementById(primero)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const { user } = await login(formData.email.trim(), formData.password);
      navigate(rutaSegunRol(user.rol));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setCredencialesInvalidas(true);
        setErrorServidor('El correo o la contraseña no son correctos.');
      } else if (err instanceof ApiError) {
        setErrorServidor(err.message);
      } else {
        setErrorServidor('No pudimos conectarnos con el servidor. Probá de nuevo en unos minutos.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fondo-punteado min-vh-100">
      <div className="login-wrapper d-flex align-items-center justify-content-center min-vh-100 py-5">
        <div className="login-card">

          <div className="text-center mb-4">
            <Link to="/" className="d-inline-block text-decoration-none mb-3">
              <div className="icono-marca mx-auto">
                <i className="bi bi-lock-fill"></i>
              </div>
            </Link>
            <h1 className="h3 font-display mb-1">Bienvenido</h1>
            <p className="text-muted mb-0">Ingresá tus datos para acceder a tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <CampoFormulario
              id="email"
              etiqueta="Correo electrónico"
              type="email"
              placeholder="nombre@gmail.com"
              autoComplete="email"
              value={formData.email}
              error={errores.email}
              marcarInvalido={credencialesInvalidas}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <CampoFormulario
              id="password"
              etiqueta="Contraseña"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={formData.password}
              error={errores.password}
              marcarInvalido={credencialesInvalidas}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errorServidor && <div className="alert alert-danger py-2 small" role="alert">{errorServidor}</div>}

            <button type="submit" className="btn btn-primary w-100 py-2 mb-3 mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
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