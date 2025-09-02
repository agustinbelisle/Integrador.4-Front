// src/components/CardProduct.jsx
import { Card } from "./CardProductStyles";

const CardProduct = ({ name, price, image, images, onClick }) => {
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  // 👉 Resolver la imagen correcta
  const getImageUrl = () => {
    // Si viene un string directo (prop image)
    if (image) {
      // Si la URL ya es completa (http/https), usarla tal cual
      if (image.startsWith("http")) return image;
      return imageBaseUrl + image;
    }

    // Si viene un array de imágenes
    if (images && images.length > 0) {
      const first = images[0];
      if (typeof first === "string") return imageBaseUrl + first;
      if (first?.url) {
        if (first.url.startsWith("http")) return first.url;
        return imageBaseUrl + first.url;
      }
    }

    // Fallback a placeholder
    return `${imageBaseUrl}placeholder.jpg`;
  };

  const imageUrl = getImageUrl();
  console.log("CardProduct imageUrl:", imageUrl); // Para depuración

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
