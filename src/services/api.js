const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // necesario si usás cookies/JWT
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error en la solicitud');
  }

  return res.json();
};
