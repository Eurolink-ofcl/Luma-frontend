import React from 'react';
import ProductsHero from '../components/products/ProductsHero';
import ProductsCatalogSection from '../components/products/ProductsCatalogSection';

export default function ProductsPage({ onNavigateHome, onOpenCart, onNavigate }) {
  return (
    <div className="w-full bg-[#FFFFFF] text-[#000000]">
      {/* 1st Section: LUMA Products Banner (PSD 'Images Banner', y=0..850) */}
      <ProductsHero />

      {/* 2nd Section: Breadcrumb, Filter Pills & 7 Alternating Product Rows (PSD y=955..8954) */}
      <ProductsCatalogSection
        onNavigateHome={onNavigateHome}
        onOpenCart={onOpenCart}
        onNavigate={onNavigate}
      />
    </div>
  );
}
