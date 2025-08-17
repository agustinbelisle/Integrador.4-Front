import {
  SidebarContainer,
  CheckboxInput,
  CategoriesWrapper,
  Title,
  CategoryLabelWrapper,
} from "./SidebarCategoriesStyles";

const SidebarCategories = ({ categories, selectedCategories, onCategoryChange }) => {
  return (
    <SidebarContainer>
      <Title>Categorías</Title>
      <CategoriesWrapper>
        {categories.map((category) => {
          // Asegurarse de que category sea una string
          const categoryName = typeof category === "string" ? category : category.name;

          return (
            <label key={categoryName}>
              <CheckboxInput
                type="checkbox"
                checked={selectedCategories.includes(categoryName)}
                onChange={() => onCategoryChange(categoryName)}
              />
              <CategoryLabelWrapper>{categoryName}</CategoryLabelWrapper>
            </label>
          );
        })}
      </CategoriesWrapper>
    </SidebarContainer>
  );
};

export default SidebarCategories;
