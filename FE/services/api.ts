const API_BASE_URL = 'http://localhost:3000';

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

    // Si el token venció o es inválido, limpiamos la sesión para forzar un nuevo login
    if (response.status === 401) {
      localStorage.removeItem('vitalis-token');
      localStorage.removeItem('vitalis-user');
    }

    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
