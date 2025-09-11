// src/services/api.js

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      ...options,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error en la solicitud');
    }

    return await res.json();
  } catch (err) {
    console.error('apiFetch error:', err);
    throw err;
  }
};
