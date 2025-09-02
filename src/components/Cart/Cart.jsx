// src/components/Cart/Cart.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CartContainer,
  CartHeader,
  CartItems,
  CartItem,
  ItemImage,
  ItemDetails,
  ItemName,
  ItemPrice,
  ItemQuantity,
  QuantityButton,
  RemoveButton,
  CartFooter,
  EmptyCart,
  CheckoutButton,
  ClearCartButton,
} from "./CartStyles";

import {
  fetchCart,
  updateCartItem,
  removeItemFromCart,
  clearCartRemote,
} from "../../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  // Cargar carrito remoto si está logeado
  useEffect(() => {
    if (isAuthenticated && user?.id && token) {
      dispatch(fetchCart({ userId: user.id, token }));
    }
  }, [dispatch, isAuthenticated, user, token]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

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

  const total = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  if (loading) return <p>Cargando carrito...</p>;
  if (!loading && cartItems.length === 0) return <EmptyCart>Tu carrito está vacío</EmptyCart>;

  return (
    <CartContainer>
      <CartHeader>
        <h2>Tu Carrito</h2>
        <ClearCartButton onClick={handleClearCart}>Vaciar carrito</ClearCartButton>
      </CartHeader>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <CartItems>
        {cartItems.map((item) => (
          <CartItem key={item.itemId}>
            <ItemImage
              src={item.product?.images?.[0]?.url || "/assets/images/default.png"}
              alt={item.product?.name || "Imagen"}
            />
            <ItemDetails>
              <ItemName>{item.product?.name || "Producto sin nombre"}</ItemName>
              <ItemPrice>${item.product?.price}</ItemPrice>
              <ItemQuantity>
                <QuantityButton onClick={() => handleRemoveOne(item)}>-</QuantityButton>
                <span>{item.quantity}</span>
                <QuantityButton onClick={() => handleAddOne(item)}>+</QuantityButton>
              </ItemQuantity>
            </ItemDetails>
            <RemoveButton onClick={() => handleRemoveProduct(item)}>X</RemoveButton>
          </CartItem>
        ))}
      </CartItems>

      <CartFooter>
        <p>Total: ${total.toFixed(2)}</p>
        <CheckoutButton onClick={handleCheckout}>Ir al checkout</CheckoutButton>
      </CartFooter>
    </CartContainer>
  );
};

export default Cart;
