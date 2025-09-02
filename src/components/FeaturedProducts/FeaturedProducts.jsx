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
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();

        if (data?.products) {
          const filtered = data.products.filter((product) =>
            ["Notebooks", "Smartphones", "Hogar", "Audio"].includes(
              product.category.name
            )
          );

          const enriched = filtered.map((p) => {
            const url = p.images?.[0]?.url || "placeholder.jpg";
            return {
              ...p,
              imageUrl: url.startsWith("http") ? url : IMAGE_BASE_URL + url,
            };
          });

          setProducts(enriched.slice(0, 4));
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
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            style={{ cursor: "pointer" }}
          >
            <CardProduct
              name={product.name}
              price={product.price}
              image={product.imageUrl}
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
