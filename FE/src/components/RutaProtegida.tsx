import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUsuarioActual, isAuthenticated, rutaSegunRol } from '../../services/authService';
import type { Rol } from '../../services/authService';

interface RutaProtegidaProps {
  /** Roles que pueden ver la página. */
  roles: Rol[];
  children: React.ReactNode;
}

export const RutaProtegida: React.FC<RutaProtegidaProps> = ({ roles, children }) => {
  const usuario = getUsuarioActual();

  if (!isAuthenticated() || !usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(usuario.rol)) {
    return <Navigate to={rutaSegunRol(usuario.rol)} replace />;
  }

  return <>{children}</>;
};