const API_BASE_URL = 'http://localhost:3000';
export class ApiError extends Error {
  status: number;
  errores: { path: string; message: string }[];

  constructor(message: string, status: number, errores: { path: string; message: string }[] = []) {
    super(message);
    this.status = status;
    this.errores = errores;
  }
}

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('vitalis-token');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      localStorage.removeItem('vitalis-token');
      localStorage.removeItem('vitalis-user');
    }

        throw new ApiError(errorData.message || `Error HTTP: ${response.status}`, response.status, errorData.errors ?? []);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
