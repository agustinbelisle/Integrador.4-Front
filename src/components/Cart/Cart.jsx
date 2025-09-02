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

  useEffect(() => {
    if (isAuthenticated && user?.id && token) {
      dispatch(fetchCart({ userId: user.id, token }));
    }
  }, [dispatch, isAuthenticated, user, token]);

  const handleAddOne = (item) => {
    if (!item?.itemId) return;
    dispatch(
      updateCartItem({
        itemId: item.itemId,
        quantity: (item.quantity || 0) + 1,
        token,
      })
    );
  };

  const handleRemoveOne = (item) => {
    if (!item?.itemId) return;
    if ((item.quantity || 0) > 1) {
      dispatch(
        updateCartItem({
          itemId: item.itemId,
          quantity: (item.quantity || 1) - 1,
          token,
        })
      );
    } else {
      dispatch(removeItemFromCart({ itemId: item.itemId, token }));
    }
  };

  const handleRemoveProduct = (item) => {
    if (!item?.itemId) return;
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

  const total = cartItems.reduce(
    (acc, item) => acc + ((item.product?.price || 0) * (item.quantity || 0)),
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
                <ProductTopRow>
                  <img
                    src={item.product?.imageUrl || `${IMAGE_BASE_URL}placeholder.jpg`}
                    alt={item.product?.name || "Producto"}
                  />
                  <div className="info">
                    <h3>{item.product?.name || "Sin nombre"}</h3>
                    <span>
                      ${item.product?.price?.toLocaleString("es-AR") || "0"}
                    </span>
                  </div>
                </ProductTopRow>

                <ProductBottomRow>
                  <QuantityButton onClick={() => handleRemoveOne(item)}>-</QuantityButton>
                  <span>{item.quantity || 0}</span>
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

