// src/components/Cart/Cart.jsx

import {
  CartContainer,
  ProductList,
  ProductItem,
  ProductTopRow,
  ProductBottomRow,
  QuantityButton,
  RemoveButton,
  ButtonsRow,
  ClearCartButton,
  CheckoutButton,
  TotalAmount,
} from "./CartStyles";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  updateCartItem,
  removeItemFromCart,
  clearCartRemote,
  addToCartLocal,
  removeOneItemLocal,
  removeItemLocal,
  clearCartLocal,
} from "../../redux/slices/cartSlice";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const { cartItems, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isAuthenticated && user?.id && token) {
      dispatch(fetchCart({ userId: user.id, token }));
    }
  }, [dispatch, isAuthenticated, user, token]);

  // --- Agregar una unidad ---
  const handleAddOne = (item) => {
    if (isAuthenticated && token && item?.cartItemId) {
      dispatch(
        updateCartItem({ itemId: item.cartItemId, quantity: item.quantity + 1, token })
      );
    } else {
      const product = {
        id: item.product?.id || item.productId || item.id,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        images: item.product?.images || [{ url: item.image }],
      };
      dispatch(addToCartLocal({ product, quantity: 1 }));
    }
  };

  // --- Quitar una unidad ---
  const handleRemoveOne = (item) => {
    if (isAuthenticated && token && item?.cartItemId) {
      if (item.quantity > 1) {
        dispatch(
          updateCartItem({ itemId: item.cartItemId, quantity: item.quantity - 1, token })
        );
      } else {
        dispatch(removeItemFromCart({ itemId: item.cartItemId, token }));
      }
    } else {
      dispatch(removeOneItemLocal(item.product?.id || item.productId || item.id));
    }
  };

  // --- Eliminar producto ---
  const handleRemoveProduct = (item) => {
    if (isAuthenticated && token && item?.cartItemId) {
      dispatch(removeItemFromCart({ itemId: item.cartItemId, token }));
    } else {
      dispatch(removeItemLocal(item.product?.id || item.productId || item.id));
    }
  };

  // --- Vaciar carrito ---
  const handleClearCart = () => {
    if (isAuthenticated && token && user?.id) {
      dispatch(clearCartRemote({ userId: user.id, token }));
    } else {
      dispatch(clearCartLocal());
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) navigate("/checkout");
    else navigate("/login", { state: { from: "/checkout" } });
  };

  const total = cartItems.reduce(
    (acc, item) => acc + ((item.price ?? 0) * (item.quantity ?? 0)),
    0
  );

  const getImageUrl = (item) => {
    const url =
      item.product?.images?.[0]?.url ||
      item.image ||
      `${IMAGE_BASE_URL}placeholder.jpg`;
    return url.startsWith("http") ? url : IMAGE_BASE_URL + url;
  };

  return (
    <CartContainer>
      <h2>Carrito de Compras</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && cartItems.length === 0 && <p>Tu carrito está vacío.</p>}
      {!loading && cartItems.length > 0 && (
        <>
          <ProductList>
            {cartItems.map((item) => (
              <ProductItem key={item.cartItemId || item.productId}>
                <ProductTopRow>
                  <img
                    src={getImageUrl(item)}
                    alt={item.name || "Producto"}
                  />
                  <div className="info">
                    <h3>{item.name || "Sin nombre"}</h3>
                    <span>${(item.price ?? 0).toLocaleString("es-AR")}</span>
                  </div>
                </ProductTopRow>
                <ProductBottomRow>
                  <QuantityButton onClick={() => handleRemoveOne(item)}>
                    -
                  </QuantityButton>
                  <span>{item.quantity ?? 0}</span>
                  <QuantityButton onClick={() => handleAddOne(item)}>
                    +
                  </QuantityButton>
                  <RemoveButton onClick={() => handleRemoveProduct(item)}>
                    Eliminar
                  </RemoveButton>
                </ProductBottomRow>
              </ProductItem>
            ))}
          </ProductList>
          <TotalAmount>Total: ${total.toLocaleString("es-AR")}</TotalAmount>
          <ButtonsRow>
            <ClearCartButton onClick={handleClearCart}>Vaciar carrito</ClearCartButton>
            <CheckoutButton onClick={handleCheckout}>Ir al checkout</CheckoutButton>
          </ButtonsRow>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;
