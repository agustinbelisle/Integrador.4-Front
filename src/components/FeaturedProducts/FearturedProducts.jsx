import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardProduct from "../CardProduct/CardProduct";
import ProductModal from "../ProductModal/ProductModal";
import {
  FeaturedSection,
  ProductsGrid,
  ViewMoreButton,
  Title,
} from "./FeaturedProductsStyles";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        if (data?.products) {
          const filtered = data.products.filter(product =>
            ["Notebooks", "Smartphones", "Hogar", "Audio"].includes(product.category.name)
          );
          setProducts(filtered.slice(0, 4)); // primeros 4 destacados
        }
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <FeaturedSection>
      <Title>Productos Destacados</Title>

<ProductsGrid>
  {products.map(product => (
    <div
      key={product.id}
      onClick={() => setSelectedProduct(product)}
      style={{ cursor: "pointer" }}
    >
      <CardProduct
        name={product.name}
        price={product.price}
        image={
          Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]?.url
            : "/placeholder.jpg" // imagen por defecto si falta
        }
      />
    </div>
  ))}
</ProductsGrid>


      <ViewMoreButton onClick={() => navigate("/products")}>
        Más productos...
      </ViewMoreButton>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </FeaturedSection>
  );
};

export default FeaturedProducts;
