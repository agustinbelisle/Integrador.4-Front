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
      <img
        src={imageUrl}
        alt={name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      />
      <div className="info" style={{ padding: "0.8rem", textAlign: "center" }}>
        <h3 style={{ margin: "0.5rem 0", fontSize: "1.2rem" }}>{name}</h3>
        <span style={{ color: "#007bff", fontWeight: "500" }}>${price}</span>
      </div>
    </Card>
  );
};

export default CardProduct;
