// src/components/CardProduct.jsx
import { Card } from "./CardProductStyles";

const CardProduct = ({ name, price, image, images, onClick }) => {
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  // 👉 Resolver la imagen correcta
  const getImageUrl = () => {
    // Si viene un string directo (prop image)
    if (image) {
      return image;
    }

    // Si viene un array de imágenes
    if (images && images.length > 0) {
      if (typeof images[0] === "string") {
        return imageBaseUrl + images[0];
      }
      if (images[0]?.url) {
        return imageBaseUrl + images[0].url;
      }
    }

    // Fallback
    return `${imageBaseUrl}placeholder.jpg`;
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
        <span style={{ color: "#007bff", fontWeight: "500" }}>
          ${price?.toLocaleString("es-AR")}
        </span>
      </div>
    </Card>
  );
};

export default CardProduct;
