import { apiFetch } from './api';

export type Rol = 'paciente' | 'especialista' | 'administrativo';

export interface UsuarioLogueado {
  id: number;
  email: string;
  nombre: string;
  legajo?: string;
  rol: Rol;
}

export interface LoginResponse {
  token: string;
  user: UsuarioLogueado;
}

const TOKEN_KEY = 'vitalis-token';
const USER_KEY = 'vitalis-user';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsuarioActual(): UsuarioLogueado | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UsuarioLogueado;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// Devuelve a qué ruta debería ir cada rol después de loguearse
export function rutaSegunRol(rol: Rol): string {
  switch (rol) {
    case 'administrativo':
      return '/administrativo';
    case 'especialista':
      return '/especialista';
    case 'paciente':
    default:
      return '/usuario';
  }
}
