// src/pages/OrderSuccess.jsx
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaCheckCircle } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  text-align: center;
`;

const Icon = styled(FaCheckCircle)`
  color: green;
  font-size: 64px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 30px;
`;

const Info = styled.div`
  background: #f2f2f2;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 40px;
`;

const Button = styled(Link)`
  padding: 12px 24px;
  background: #0077cc;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    background: #005fa3;
  }
`;

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, amount, method } = location.state || {};

  return (
    <Container>
      <Icon />
      <Title>¡Gracias por tu compra!</Title>
      <Subtitle>Tu orden ha sido procesada con éxito.</Subtitle>

      <Info>
        {orderId && <p><strong>Orden N.º:</strong> {orderId}</p>}
        {amount && <p><strong>Total pagado:</strong> ${amount}</p>}
        {method && <p><strong>Método de pago:</strong> {method.toUpperCase()}</p>}
      </Info>

      <Button to="/">Volver al inicio</Button>
    </Container>
  );
};

export default OrderSuccess;
