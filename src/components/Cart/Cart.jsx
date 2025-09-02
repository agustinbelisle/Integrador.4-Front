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
} from "../../redux/slices/cartSlice";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const { cartItems, loading, error } = useSelector((state) => state.cart);

  // Cargar carrito remoto si está logeado
  useEffect(() => {
    if (isAuthenticated && user?.id && token) {
      dispatch(fetchCart({ userId: user.id, token }));
    }
  }, [dispatch, isAuthenticated, user, token]);

  // Handlers
  const handleAddOne = (item) => {
    dispatch(
      updateCartItem({
        itemId: item.itemId,
        quantity: item.quantity + 1,
        token,
      })
    );
  };

  const handleRemoveOne = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCartItem({
          itemId: item.itemId,
          quantity: item.quantity - 1,
          token,
        })
      );
    } else {
      dispatch(removeItemFromCart({ itemId: item.itemId, token }));
    }
  };

  const handleRemoveProduct = (item) => {
    dispatch(removeItemFromCart({ itemId: item.itemId, token }));
  };

  const handleClearCart = () => {
    if (user?.id && token) {
      dispatch(clearCartRemote({ userId: user.id, token }));
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  };

  // Total
  const total = cartItems.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );

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
              <ProductItem key={item.id}>
                {/* Primera fila: imagen + info */}
                <ProductTopRow>
                  <img
                    src={item.product.imageUrl || `${IMAGE_BASE_URL}placeholder.jpg`}
                    alt={item.product.name}
                  />
                  <div className="info">
                    <h3>{item.product.name}</h3>
                    <span>${item.product.price.toLocaleString("es-AR")}</span>
                  </div>
                </ProductTopRow>

                {/* Segunda fila: cantidad + eliminar */}
                <ProductBottomRow>
                  <QuantityButton onClick={() => handleRemoveOne(item)}>-</QuantityButton>
                  <span>{item.quantity}</span>
                  <QuantityButton onClick={() => handleAddOne(item)}>+</QuantityButton>
                  <RemoveButton onClick={() => handleRemoveProduct(item)}>Eliminar</RemoveButton>
                </ProductBottomRow>
              </ProductItem>
            ))}
          </ProductList>

          <TotalAmount>Total: ${total.toFixed(2)}</TotalAmount>

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
