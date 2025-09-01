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

useEffect(() => {
  if (isAuthenticated && user && token) {
    console.log("User en Cart.jsx:", user); // 👈 Agregá esta línea
    dispatch(fetchCart({ userId: user.id, token }));
  }
}, [dispatch, isAuthenticated, user, token]);


  const handleAdd = (productId) => {
    dispatch(addItemToCart({ userId: user.id, productId, quantity: 1, token }));
  };

  const handleRemoveOne = (item) => {
    if (item.quantity > 1) {
      dispatch(updateCartItem({ itemId: item.itemId, quantity: item.quantity - 1, token }));
    } else {
      dispatch(removeItemFromCart({ itemId: item.itemId, token }));
    }
  };

  const handleAddOne = (item) => {
    dispatch(updateCartItem({ itemId: item.itemId, quantity: item.quantity + 1, token }));
  };

  const handleRemoveProduct = (item) => {
    dispatch(removeItemFromCart({ itemId: item.itemId, token }));
  };

  const handleClearCart = () => {
    dispatch(clearCartRemote({ userId: user.id, token }));
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  };

  const total = cartItems.reduce((acc, item) => {
  const price = item.product?.price || 0;
  return acc + price * item.quantity;
}, 0);


  return (
    <CartContainer>
      <h2>Carrito de Compras</h2>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && cartItems.length === 0 && <p>Tu carrito está vacío.</p>}

      {!loading && cartItems.length > 0 && (
        <>
          <ProductList>
          {cartItems.map((item) => {
            const name = item.product?.name || "Producto sin nombre";
            const price = item.product?.price || 0;
            return (
              <ProductItem key={item.itemId || item.id}>
                <ProductInfo>
                  {name}
                  <Quantity>
                    <QuantityButton onClick={() => handleRemoveOne(item)}>-</QuantityButton>
                    {item.quantity}
                    <QuantityButton onClick={() => handleAddOne(item)}>+</QuantityButton>
                  </Quantity>
                </ProductInfo>
                <RemoveButton onClick={() => handleRemoveProduct(item)}>Eliminar</RemoveButton>
              </ProductItem>
            );
          })}

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
