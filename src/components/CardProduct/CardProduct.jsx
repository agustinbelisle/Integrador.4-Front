import { Card } from "./CardProductStyles";

const CardProduct = ({ name, price, image, onClick }) => {
  const imageUrl =
    typeof image === "string"
      ? image
      : image?.url || "/placeholder.jpg"; // Fallback si es objeto o nulo

  return (
    <Card onClick={onClick}>
      <img src={imageUrl} alt={name} />
      <div className="info">
        <h3>{name}</h3>
        <span>${price}</span>
      </div>
    </Card>
  );
};

export default CardProduct;
