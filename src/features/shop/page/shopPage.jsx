import React, { useState } from 'react'
import ShopHero from '../components/ShopHero'
import ProductsSection from '../components/ProductsSection'
import { ShopLayout } from '../../shared/components/navigations'

function ShopPage() {
  const [heroSearchQuery, setHeroSearchQuery] = useState("");

  const handleHeroSearch = (searchTerm) => {
    setHeroSearchQuery(searchTerm);
  };

  return (
    <ShopLayout>
      <ShopHero onSearch={handleHeroSearch} />
      <ProductsSection initialSearch={heroSearchQuery} />
    </ShopLayout>
  )
}

export default ShopPage
