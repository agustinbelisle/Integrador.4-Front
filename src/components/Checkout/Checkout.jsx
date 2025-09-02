// src/pages/Checkout.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CheckoutContainer,
  LeftPanel,
  RightPanel,
  ProductList,
  ProductItem,
  ProductImage,
  TotalAmount,
  ConfirmButton,
  PaymentOptions,
  PaymentLabel,
  CardDetails,
  PaymentOptionItem,
  ResponsiveText,
} from "./CheckoutStyles";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { clearCartRemote } from "../../redux/slices/cartSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const { cartItems } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cardFormik = useFormik({
    initialValues: { number: "", expiry: "", cvc: "" },
    validationSchema: Yup.object({
      number: Yup.string()
        .required("El número de tarjeta es obligatorio")
        .matches(/^\d{4} \d{4} \d{4} \d{4}$/, "Formato inválido"),
      expiry: Yup.string()
        .required("La fecha de expiración es obligatoria")
        .matches(/^\d{2}\/\d{2}$/, "Formato MM/AA"),
      cvc: Yup.string()
        .required("El código CVC es obligatorio")
        .matches(/^\d{3,4}$/, "Formato inválido"),
    }),
    onSubmit: () => {},
  });

  useEffect(() => {
    if (!user || !token) navigate("/login");
  }, [user, token, navigate]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isCardMethod = paymentMethod === "visa" || paymentMethod === "mastercard";

  const handleConfirm = async () => {
    try {
      if (isCardMethod) {
        const errors = await cardFormik.validateForm();
        cardFormik.setTouched({ number: true, expiry: true, cvc: true });
        if (Object.keys(errors).length > 0) return;
      }

      const orderRes = await fetch(`${API_BASE_URL}/orders/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!orderRes.ok) {
        const errMsg = await orderRes.text();
        throw new Error(errMsg || "Error al crear la orden.");
      }

      const order = await orderRes.json();

      const paymentRes = await fetch(`${API_BASE_URL}/payments/${order.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ method: paymentMethod }),
      });

      if (!paymentRes.ok) {
        const errMsg = await paymentRes.text();
        throw new Error(errMsg || "Error al procesar el pago.");
      }

      const payment = await paymentRes.json();
      dispatch(clearCartRemote({ userId: user.id, token }));

      navigate("/order-success", {
        state: {
          orderId: order.id,
          amount: payment.amount,
          method: payment.method,
        },
      });
    } catch (error) {
      console.error("Error durante el checkout:", error);
      alert("Hubo un problema al procesar tu compra. Intenta nuevamente.");
    }
  };

  return (
    <>
      <ResponsiveText />
      <CheckoutContainer>
        <LeftPanel>
          <h2>Resumen de Compra</h2>
          <ProductList>
            {cartItems.length === 0 && <p>Tu carrito está vacío.</p>}
            {cartItems.map((item) => {
              const imageUrl = item.image?.startsWith("http")
                ? item.image
                : `${IMAGE_BASE_URL}${item.image || "placeholder.jpg"}`;

              return (
                <ProductItem key={item.itemId || item.id}>
                  <ProductImage
                    src={imageUrl}
                    alt={item.name || "Producto sin nombre"}
                    onError={(e) => (e.currentTarget.src = `${IMAGE_BASE_URL}placeholder.jpg`)}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                    }}
                  />
                  <div style={{ marginLeft: "1rem" }}>
                    <strong>{item.name || "Producto sin nombre"}</strong> ×{item.quantity}
                    <br />
                    <span style={{ color: "#007bff", fontWeight: "500" }}>
                      ${item.price * item.quantity}
                    </span>
                  </div>
                </ProductItem>
              );
            })}
          </ProductList>
          <TotalAmount>Total: ${total.toFixed(2)}</TotalAmount>
        </LeftPanel>

        <RightPanel>
          <h4>Método de Pago</h4>
          <PaymentOptions>
            <PaymentOptionItem active={isCardMethod}>
              <PaymentLabel>
                <input
                  type="radio"
                  name="payment"
                  value="visa"
                  checked={paymentMethod === "visa"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <FaCcVisa /> <FaCcMastercard /> Tarjeta de crédito
              </PaymentLabel>
              {isCardMethod && (
                <CardDetails>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    name="number"
                    placeholder="1234 5678 9012 3456"
                    value={cardFormik.values.number}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                      const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
                      cardFormik.setFieldValue("number", formatted);
                    }}
                    onBlur={cardFormik.handleBlur}
                  />
                  {cardFormik.touched.number && cardFormik.errors.number && (
                    <p className="error">{cardFormik.errors.number}</p>
                  )}

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    name="expiry"
                    placeholder="MM/AA"
                    value={cardFormik.values.expiry}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                      const formatted = raw.replace(/(\d{2})(\d{0,2})/, "$1/$2");
                      cardFormik.setFieldValue("expiry", formatted);
                    }}
                    onBlur={cardFormik.handleBlur}
                  />
                  {cardFormik.touched.expiry && cardFormik.errors.expiry && (
                    <p className="error">{cardFormik.errors.expiry}</p>
                  )}

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    name="cvc"
                    placeholder="CVV / CVC"
                    value={cardFormik.values.cvc}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                      cardFormik.setFieldValue("cvc", raw);
                    }}
                    onBlur={cardFormik.handleBlur}
                  />
                  {cardFormik.touched.cvc && cardFormik.errors.cvc && (
                    <p className="error">{cardFormik.errors.cvc}</p>
                  )}
                </CardDetails>
              )}
            </PaymentOptionItem>

            <PaymentOptionItem active={paymentMethod === "gpay"}>
              <PaymentLabel>
                <input
                  type="radio"
                  name="payment"
                  value="gpay"
                  checked={paymentMethod === "gpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <FaGoogle /> Google Pay
              </PaymentLabel>
            </PaymentOptionItem>

            <PaymentOptionItem active={paymentMethod === "paypal"}>
              <PaymentLabel>
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <FaCcPaypal /> PayPal
              </PaymentLabel>
            </PaymentOptionItem>
          </PaymentOptions>

          <ConfirmButton onClick={handleConfirm}>Confirmar compra</ConfirmButton>
        </RightPanel>
      </CheckoutContainer>
    </>
  );
};

export default Checkout;

