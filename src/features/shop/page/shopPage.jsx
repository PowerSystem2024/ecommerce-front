import React, { useState } from 'react'
import ShopHero from '../components/ShopHero'
import ProductsSection from '../components/ProductsSection'
import { ShopLayout } from '../../shared/components/navigations'

function ShopPage() {
  const [heroSearchQuery, setHeroSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleHeroSearch = (searchTerm) => {
    setHeroSearchQuery(searchTerm);
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setHeroSearchQuery(""); // Limpiar búsqueda cuando se selecciona una categoría
  };

  return (
    <ShopLayout>
      <ShopHero onCategoryClick={handleCategoryClick} selectedCategory={selectedCategory} />
      <ProductsSection initialSearch={heroSearchQuery} initialCategory={selectedCategory} />
    </ShopLayout>
  )
}

export default ShopPage
