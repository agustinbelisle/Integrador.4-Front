import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';


const AUTH_STATE_KEY = "auth_state";
const API_BASE_URL = "http://localhost:5000/api";

// Leer estado guardado (para mantener sesión)
const getAuthStateFromStorage = () => {
  const state = localStorage.getItem(AUTH_STATE_KEY);

  if (!state) {
    return { isAuthenticated: false, user: null, token: null, error: null };
  }

  try {
    const parsed = JSON.parse(state);
    const decoded = jwtDecode(parsed.token);

    const isExpired = Date.now() >= decoded.exp * 1000;

    if (isExpired) {
      console.warn("Token expirado. Cerrando sesión automáticamente.");
      localStorage.removeItem(AUTH_STATE_KEY);
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        error: "Sesión expirada. Iniciá sesión nuevamente.",
      };
    }

    return parsed;
  } catch (err) {
    console.error("Error al decodificar el token:", err);
    return { isAuthenticated: false, user: null, token: null, error: null };
  }
};


// Guardar sesión
const saveAuthStateToStorage = (state) => {
  localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
};

// Thunk para registrar
export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
      return res.data; // { token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al registrar");
    }
  }
);

// Thunk para login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      return res.data; // { token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Credenciales inválidas");
    }
  }
);

const initialState = getAuthStateFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      saveAuthStateToStorage(state);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        saveAuthStateToStorage(state);
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        saveAuthStateToStorage(state);
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
