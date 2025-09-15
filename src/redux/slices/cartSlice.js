import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Async thunks ---
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, token }, { rejectWithValue }) => {
    if (!userId || !token) return [];
    try {
      const res = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al cargar carrito");
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("auth_state"))?.token;
      if (!token || !userId) throw new Error("Usuario no autenticado");
      const res = await axios.post(
        `${API_BASE_URL}/cart/${userId}`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al agregar al carrito");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity, token }, { rejectWithValue }) => {
    if (!itemId || !token) return rejectWithValue("Faltan datos para actualizar");
    try {
      const res = await axios.put(
        `${API_BASE_URL}/cart/item/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.item;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al actualizar cantidad");
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async ({ itemId, token }, { rejectWithValue }) => {
    if (!itemId || !token) return rejectWithValue("Faltan datos para eliminar");
    try {
      await axios.delete(`${API_BASE_URL}/cart/item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return itemId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al eliminar item");
    }
  }
);

export const clearCartRemote = createAsyncThunk(
  "cart/clearCartRemote",
  async ({ userId, token }, { rejectWithValue }) => {
    if (!userId || !token) return rejectWithValue("Faltan datos para vaciar");
    try {
      await axios.delete(`${API_BASE_URL}/cart/clear/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al vaciar carrito");
    }
  }
);

// --- Helpers localStorage ---
const loadCartFromLocalStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
};

const saveCartToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error al guardar el carrito en localStorage:", error);
  }
};

// --- Slice ---
const initialState = {
  cartItems: loadCartFromLocalStorage(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartLocal: (state, action) => {
      const { product, quantity } = action.payload;
      const existing = state.cartItems.find((item) => item.productId === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cartItems.push({
          cartItemId: null,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || "placeholder.jpg",
          quantity,
        });
      }
      saveCartToLocalStorage(state.cartItems);
    },
    removeOneItemLocal: (state, action) => {
      const item = state.cartItems.find((i) => i.productId === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter((i) => i.productId !== action.payload);
        }
        saveCartToLocalStorage(state.cartItems);
      }
    },
    removeItemLocal: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.productId !== action.payload);
      saveCartToLocalStorage(state.cartItems);
    },
    clearCartLocal: (state) => {
      state.cartItems = [];
      saveCartToLocalStorage([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.map((item) => ({
          cartItemId: item.id,
          productId: item.product.id,
          name: item.product?.name || "Producto sin nombre",
          price: item.product?.price || 0,
          image: item.product?.images?.[0]?.url || "placeholder.jpg",
          quantity: item.quantity,
        }));
        saveCartToLocalStorage(state.cartItems);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const item = action.payload;
        if (!item.product) return;
        const index = state.cartItems.findIndex((ci) => ci.productId === item.product.id);
        const newItem = {
          cartItemId: item.itemId, // 👈 este campo es clave
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0]?.url || "placeholder.jpg",
          quantity: item.quantity,
        };
        if (index !== -1) state.cartItems[index] = newItem;
        else state.cartItems.push(newItem);
        saveCartToLocalStorage(state.cartItems);
      })


      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.cartItems.findIndex((ci) => ci.cartItemId === updatedItem.id);
        if (index !== -1) {
          state.cartItems[index].quantity = updatedItem.quantity;
          saveCartToLocalStorage(state.cartItems);
        }
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter((ci) => ci.cartItemId !== action.payload);
        saveCartToLocalStorage(state.cartItems);
      })
      .addCase(clearCartRemote.fulfilled, (state) => {
        state.cartItems = [];
        saveCartToLocalStorage([]);
      });
  },
});

export const {
  addToCartLocal,
  removeOneItemLocal,
  removeItemLocal,
  clearCartLocal,
} = cartSlice.actions;

export default cartSlice.reducer;


