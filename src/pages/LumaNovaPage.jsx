import React from 'react';
import ProductDetailPage from './ProductDetailPage';

export default function LumaNovaPage({ onOpenCart, onNavigateHome, onNavigateProduct }) {
  return (
    <ProductDetailPage
      slug="luma-nova"
      onOpenCart={onOpenCart}
      onNavigateHome={onNavigateHome}
      onNavigateProduct={onNavigateProduct}
    />
  );
}
