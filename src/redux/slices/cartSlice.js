import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// --- Async thunks ---

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("user"); // Limpia token expirado
      }
      return rejectWithValue(err.response?.data?.message || "Error al cargar carrito");
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("auth_state"))?.token;
      if (!token) throw new Error("Token no disponible");

      const res = await axios.post(
        `${API_BASE_URL}/cart/${userId}`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    try {
      const res = await axios.put(
        `${API_BASE_URL}/cart/item/${itemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    try {
      await axios.delete(`${API_BASE_URL}/cart/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    try {
      await axios.delete(`${API_BASE_URL}/cart/clear/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  } catch (error) {
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
      const existing = state.cartItems.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cartItems.push({ ...product, quantity });
      }
      saveCartToLocalStorage(state.cartItems);
    },
    removeOneItemLocal: (state, action) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
        }
        saveCartToLocalStorage(state.cartItems);
      }
    },
    removeItemLocal: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
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

        state.cartItems = action.payload
          .filter(item => item.product) // evita undefined
          .map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            itemId: item.id,
            image:
              item.product.images && item.product.images.length > 0 && item.product.images[0].url
                ? item.product.images[0].url.startsWith("http")
                  ? item.product.images[0].url
                  : `${API_BASE_URL}/uploads/${item.product.images[0].url}`
                : "/assets/images/default.png",
          }));

        saveCartToLocalStorage(state.cartItems);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const item = action.payload;

        if (!item.product) {
          console.error("Producto indefinido en addItemToCart.fulfilled", item);
          return;
        }

        const index = state.cartItems.findIndex((ci) => ci.itemId === item.id);
        const product = item.product;
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image:
            product.images && product.images.length > 0 && product.images[0].url
              ? product.images[0].url.startsWith("http")
                ? product.images[0].url
                : `${API_BASE_URL}/uploads/${product.images[0].url}`
              : "/assets/images/default.png",
          quantity: item.quantity,
          itemId: item.id,
        };

        if (index !== -1) {
          state.cartItems[index] = newItem;
        } else {
          state.cartItems.push(newItem);
        }

        saveCartToLocalStorage(state.cartItems);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.cartItems.findIndex((ci) => ci.itemId === updatedItem.id);
        if (index !== -1) {
          state.cartItems[index].quantity = updatedItem.quantity;
          saveCartToLocalStorage(state.cartItems);
        }
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter((ci) => ci.itemId !== action.payload);
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
