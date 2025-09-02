// src/components/Cart/Cart.jsx
import {
  CartContainer,
  ProductList,
  ProductItem,
  ProductInfo,
  Quantity,
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
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCartRemote,
} from "../../redux/slices/cartSlice";

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

  const total = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
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
              <ProductItem key={item.itemId}>
                <ProductInfo>
                  {item.product?.name || "Producto sin nombre"}
                  <Quantity>
                    <QuantityButton onClick={() => handleRemoveOne(item)}>
                      -
                    </QuantityButton>
                    {item.quantity}
                    <QuantityButton onClick={() => handleAddOne(item)}>
                      +
                    </QuantityButton>
                  </Quantity>
                </ProductInfo>
                <RemoveButton onClick={() => handleRemoveProduct(item)}>
                  Eliminar
                </RemoveButton>
              </ProductItem>
            ))}
          </ProductList>

          <TotalAmount>Total: ${total.toFixed(2)}</TotalAmount>

          <ButtonsRow>
            <ClearCartButton onClick={handleClearCart}>
              Vaciar carrito
            </ClearCartButton>
            <CheckoutButton onClick={handleCheckout}>
              Ir al checkout
            </CheckoutButton>
          </ButtonsRow>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;

