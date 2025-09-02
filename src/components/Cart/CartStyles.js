import styled from "styled-components";

export const CartContainer = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  
  h2 {
    font-size: 1.8rem;
    font-weight: 500;
    margin-bottom: 20px;
    font-family: 'Exo 2 Bold', sans-serif;
    color: #333;
  }
`;

export const ProductList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
  max-height: 400px;
  overflow-y: auto;
`;

export const ProductItem = styled.li`
  display: flex;
  flex-direction: column; /* Para dos filas */
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

export const ProductTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    background-color: #f5f5f5;
  }

  .info {
    display: flex;
    flex-direction: column;

    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
    }

    span {
      font-size: 1rem;
      font-weight: 500;
      color: #007bff;
      margin-top: 4px;
    }
  }
`;

export const ProductBottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

export const QuantityButton = styled.button`
  background-color: rgba(0, 123, 255, 0.85);
  border: none;
  color: white;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Exo 2 Bold', sans-serif;

  &:hover {
    background-color: rgba(0, 123, 255, 1);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const RemoveButton = styled.button`
  background-color: rgba(240, 192, 64, 0.85);
  border: none;
  color: #333;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Exo 2 Bold', sans-serif;

  &:hover {
    background-color: rgba(240, 192, 64, 1);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const TotalAmount = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  margin-top: 20px;
`;

export const ButtonsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

export const ClearCartButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background-color: rgba(0, 123, 255, 0.85); 
  color: white;
  border: none;
  font-weight: 400;
  font-size: 1.1rem;
  font-family: 'Exo 2 Bold', sans-serif;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 123, 255, 1);
    transform: translateY(-2px) scale(1.03);
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const CheckoutButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background-color: rgba(240, 192, 64, 0.85); 
  color: #333;
  border: none;
  font-weight: 400;
  font-size: 1.1rem;
  font-family: 'Exo 2 Bold', sans-serif;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(240, 192, 64, 1);
    transform: translateY(-2px) scale(1.03);
  }

  &:active {
    transform: scale(0.97);
  }
`;

