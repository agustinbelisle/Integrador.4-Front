import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarCategories from "../SidebarCategories/SidebarCategories";
import CardProduct from "../CardProduct/CardProduct";
import ProductModal from "../ProductModal/ProductModal";
import {
  Container,
  SidebarWrapper,
  CardsContainer,
} from "./ProductViewStyles";

const ProductView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category");

  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [modalProduct, setModalProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        if (data?.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleOpenModal = (product) => {
    setModalProduct(product);
  };

  const handleCloseModal = () => {
    setModalProduct(null);
  };

  // ✅ Extraer nombres de categorías únicas
  const allCategories = [...new Set(products.map((p) => p.category.name))];

  // ✅ Filtrar productos por categoría seleccionada
  const filteredProducts =
    selectedCategories.length > 0
      ? products.filter((p) => selectedCategories.includes(p.category.name))
      : products;

  return (
    <Container>
      <SidebarWrapper>
        <SidebarCategories
          categories={allCategories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
        />
      </SidebarWrapper>

      <CardsContainer>
        {loading ? (
          <p>Cargando productos...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No hay productos para las categorías seleccionadas.</p>
        ) : (
          filteredProducts.map((product) => (
            <CardProduct
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.images[0]?.url || ""}
              category={product.category.name}
              onClick={() => handleOpenModal(product)}
            />
          ))
        )}
      </CardsContainer>

      {modalProduct && (
        <ProductModal product={modalProduct} onClose={handleCloseModal} />
      )}
    </Container>
  );
};

export default ProductView;

