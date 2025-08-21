import { Card } from "./CardProductStyles";

const CardProduct = ({ name, price, image, onClick }) => {
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  const getImageUrl = () => {
    if (typeof image === "string") {
      return imageBaseUrl + image;
    }
    if (image?.url) {
      return imageBaseUrl + image.url;
    }
    return imageBaseUrl + "placeholder.jpg";
  };

  const imageUrl = getImageUrl();

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
