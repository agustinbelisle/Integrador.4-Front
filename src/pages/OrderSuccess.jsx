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
  width: 100%;
  max-width: 600px;
`;

const ProductList = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 40px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ddd;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 16px;
  }

  .info {
    flex: 1;
    text-align: left;

    h4 {
      margin: 0 0 4px 0;
      font-size: 1rem;
    }

    span {
      font-size: 0.9rem;
      color: #555;
    }
  }
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

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, amount, method, products } = location.state || {};

  return (
    <Container>
      <Icon />
      <Title>¡Gracias por tu compra!</Title>
      <Subtitle>Tu orden ha sido procesada con éxito.</Subtitle>

      <Info>
        {orderId && <p><strong>Orden N.º:</strong> {orderId}</p>}
        {amount && <p><strong>Total pagado:</strong> ${amount.toLocaleString("es-AR")}</p>}
        {method && <p><strong>Método de pago:</strong> {method.toUpperCase()}</p>}
      </Info>

      {products && products.length > 0 && (
        <ProductList>
          {products.map((item, index) => {
            const imageUrl = item.image
              ? item.image.startsWith("http")
                ? item.image
                : `${IMAGE_BASE_URL}${item.image}`
              : "https://via.placeholder.com/60";

            return (
              <ProductItem key={index}>
                <img src={imageUrl} alt={item.name || "Producto"} />
                <div className="info">
                  <h4>{item.name || "Sin nombre"}</h4>
                  <span>
                    {item.quantity} x ${item.price?.toLocaleString("es-AR") || "0"}
                  </span>
                </div>
              </ProductItem>
            );
          })}
        </ProductList>
      )}

      <Button to="/">Volver al inicio</Button>
    </Container>
  );
};

export default OrderSuccess;

