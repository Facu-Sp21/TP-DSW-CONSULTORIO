import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CampoFormulario } from '../components/CampoFormulario';
import { createPaciente } from '../../services/pacienteService';
import { login, rutaSegunRol } from '../../services/authService';
import { ApiError } from '../../services/api';
import { hoyISO } from '../../services/fechas';
import {
  normalizarDni,
  validarConfirmacion,
  validarDireccion,
  validarDni,
  validarEmail,
  validarFechaNacimiento,
  validarNombre,
  validarPasswordRegistro,
  validarTelefono,
} from '../../services/validaciones';

type Campo =
  | 'nombre'
  | 'apellido'
  | 'dni'
  | 'fechaNacimiento'
  | 'telefono'
  | 'direccion'
  | 'emailRegistro'
  | 'passwordRegistro'
  | 'confirmarPassword';

type Datos = Record<Campo, string>;
type Errores = Partial<Record<Campo, string>>;

const CAMPOS: Campo[] = [
  'nombre',
  'apellido',
  'dni',
  'fechaNacimiento',
  'telefono',
  'direccion',
  'emailRegistro',
  'passwordRegistro',
  'confirmarPassword',
];

const CAMPO_DEL_BACKEND: Record<string, Campo> = {
  nombre: 'nombre',
  dni: 'dni',
  telefono: 'telefono',
  direccion: 'direccion',
  email: 'emailRegistro',
  contrasena: 'passwordRegistro',
};

function validarCampo(campo: Campo, d: Datos): string {
  switch (campo) {
    case 'nombre':
      return validarNombre(d.nombre, 'nombre');
    case 'apellido':
      return validarNombre(d.apellido, 'apellido');
    case 'dni':
      return validarDni(d.dni);
    case 'fechaNacimiento':
      return validarFechaNacimiento(d.fechaNacimiento);
    case 'telefono':
      return validarTelefono(d.telefono);
    case 'direccion':
      return validarDireccion(d.direccion);
    case 'emailRegistro':
      return validarEmail(d.emailRegistro);
    case 'passwordRegistro':
      return validarPasswordRegistro(d.passwordRegistro);
    case 'confirmarPassword':
      return validarConfirmacion(d.passwordRegistro, d.confirmarPassword);
  }
}

function camposDeUnConflicto(mensaje: string): Campo[] {
  const campos: Campo[] = [];
  if (/dni/i.test(mensaje)) campos.push('dni');
  if (/email|correo/i.test(mensaje)) campos.push('emailRegistro');
  return campos;
}

export const Registro: React.FC = () => {
  const navigate = useNavigate();
  const todayInputValue = hoyISO();
  const [formData, setFormData] = useState<Datos>({
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
  const [errores, setErrores] = useState<Errores>({});
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const campo = e.target.id as Campo;
    const nuevo = { ...formData, [campo]: e.target.value };
    setFormData(nuevo);
    setErrores((prev) => {
      const actualizados = { ...prev };
      if (prev[campo]) actualizados[campo] = validarCampo(campo, nuevo);
      if (campo === 'passwordRegistro' && prev.confirmarPassword) {
        actualizados.confirmarPassword = validarCampo('confirmarPassword', nuevo);
      }
      return actualizados;
    });
    setErrorServidor(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const campo = e.target.id as Campo;
    setErrores((prev) => ({ ...prev, [campo]: validarCampo(campo, formData) }));
  };

  const irAlPrimerError = (conError: Errores) => {
    const primero = CAMPOS.find((campo) => conError[campo]);
    if (primero) document.getElementById(primero)?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorServidor(null);

    const nuevosErrores: Errores = {};
    for (const campo of CAMPOS) {
      const mensaje = validarCampo(campo, formData);
      if (mensaje) nuevosErrores[campo] = mensaje;
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      irAlPrimerError(nuevosErrores);
      return;
    }

    setIsSubmitting(true);
    try {
      await createPaciente({
        nombre: `${formData.nombre.trim()} ${formData.apellido.trim()}`,
        dni: normalizarDni(formData.dni),
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        email: formData.emailRegistro.trim(),
        contrasena: formData.passwordRegistro,
      });

      const { user } = await login(formData.emailRegistro.trim(), formData.passwordRegistro);
      navigate(rutaSegunRol(user.rol));
    } catch (err) {
      if (err instanceof ApiError) {
        const delServidor: Errores = {};
        for (const { path, message } of err.errores) {
          const campo = CAMPO_DEL_BACKEND[path];
          if (campo && !delServidor[campo]) delServidor[campo] = message;
        }
        if (err.status === 409) {
          for (const campo of camposDeUnConflicto(err.message)) delServidor[campo] = err.message;
        }

        if (Object.keys(delServidor).length > 0) {
          setErrores(delServidor);
          irAlPrimerError(delServidor);
        } else {
          setErrorServidor(err.message);
        }
      } else {
        setErrorServidor('No pudimos conectarnos con el servidor. Probá de nuevo en unos minutos.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const campo = (id: Campo) => ({
    id,
    value: formData[id],
    error: errores[id],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <div className="fondo-punteado min-vh-100">
      <div className="registro-wrapper d-flex align-items-center justify-content-center min-vh-100 py-5">
        <div className="registro-card">

          <div className="text-center mb-4">
            <Link to="/" className="d-inline-block text-decoration-none mb-3">
              <div className="icono-marca mx-auto">
                <i className="bi bi-person-plus-fill"></i>
              </div>
            </Link>
            <h1 className="h3 font-display mb-1">Creá tu cuenta</h1>
            <p className="text-muted mb-0">Completá tus datos para comenzar</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <CampoFormulario {...campo('nombre')} etiqueta="Nombre" placeholder="Juan" autoComplete="given-name" claseContenedor="col-6 mb-3" />
              <CampoFormulario {...campo('apellido')} etiqueta="Apellido" placeholder="Pérez" autoComplete="family-name" claseContenedor="col-6 mb-3" />
            </div>

            <div className="row">
              <CampoFormulario {...campo('dni')} etiqueta="DNI" placeholder="38.123.456" claseContenedor="col-6 mb-3" />
              <CampoFormulario {...campo('fechaNacimiento')} etiqueta="Fecha de nacimiento" type="date" max={todayInputValue} autoComplete="bday" claseContenedor="col-6 mb-3" />
            </div>

            <CampoFormulario {...campo('telefono')} etiqueta="Teléfono" type="tel" placeholder="+54 9 11 1234-5678" autoComplete="tel" />

            <CampoFormulario {...campo('direccion')} etiqueta="Dirección" placeholder="Av. Siempre Viva 742" autoComplete="street-address" />

            <CampoFormulario {...campo('emailRegistro')} etiqueta="Correo electrónico" type="email" placeholder="nombre@gmail.com" autoComplete="email" />

            <div className="row">
              <CampoFormulario {...campo('passwordRegistro')} etiqueta="Contraseña" type="password" placeholder="••••••••" autoComplete="new-password" claseContenedor="col-6 mb-3" />
              <CampoFormulario {...campo('confirmarPassword')} etiqueta="Confirmar contraseña" type="password" placeholder="••••••••" autoComplete="new-password" claseContenedor="col-6 mb-3" />
            </div>

            {errorServidor && <div className="alert alert-danger py-2 small" role="alert">{errorServidor}</div>}

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