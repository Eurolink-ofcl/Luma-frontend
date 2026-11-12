import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import TopBanner from './components/TopBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import AboutSection from './components/AboutSection';
import ClinicalTech from './components/ClinicalTech';
import BenefitsOverview from './components/BenefitsOverview';
import ProductRange from './components/ProductRange';
import AssessmentQuiz from './components/AssessmentQuiz';
import BeforeAfter from './components/BeforeAfter';
import FaqSection from './components/FaqSection';
import CommunitySection from './components/CommunitySection';
import ExpertTestimonials from './components/ExpertTestimonials';
import TrustGuarantees from './components/TrustGuarantees';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import MobileDrawer from './components/MobileDrawer';
import CustomerAuthModal from './components/CustomerAuthModal';
import CheckoutModal from './components/CheckoutModal';
import CustomerAccountPage from './pages/CustomerAccountPage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import CommunityPage from './pages/CommunityPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import LumaGlowPage from './pages/LumaGlowPage';
import LumaGoPage from './pages/LumaGoPage';
import LumaNovaPage from './pages/LumaNovaPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Set to false to keep Products catalog page hidden from public routing, true to show
export const ENABLE_PRODUCTS_PAGE = true;

const KNOWN_PRODUCT_SLUGS = [
  'luma-glow',
  'luma-go',
  'luma-nova',
  'luma-surge',
  'luma-apex',
  'luma-ultra',
  'luma-max',
  'mask',
];

function parseRoute(pathname) {
  if (!pathname) return { page: 'home', slug: 'luma-nova' };
  const lower = pathname.toLowerCase();
  if (lower.startsWith('/admin')) {
    return { page: 'admin', slug: null };
  }
  if (lower.startsWith('/about')) {
    return { page: 'about', slug: null };
  }
  if (lower.startsWith('/community')) {
    return { page: 'community', slug: null };
  }
  if (lower.startsWith('/reviews') || lower.startsWith('/review')) {
    return { page: 'reviews', slug: null };
  }
  if (lower.startsWith('/contact')) {
    return { page: 'contact', slug: null };
  }
  if (lower.startsWith('/cart') || lower.startsWith('/bag')) {
    return { page: 'cart', slug: null };
  }
  if (lower.startsWith('/account') || lower.startsWith('/my-account')) {
    return { page: 'account', slug: null };
  }

  // Matches /products/:slug or /product/:slug (where slug is not empty or "our-products")
  const productMatch = lower.match(/^\/(?:products|product)\/([^/?#]+)/);
  if (productMatch && productMatch[1]) {
    const slug = productMatch[1];
    return { page: 'product-detail', slug };
  }

  // Matches direct product slug URLs e.g. /luma-nova, /luma-surge, etc.
  for (const s of KNOWN_PRODUCT_SLUGS) {
    if (lower.startsWith(`/${s}`)) {
      return { page: 'product-detail', slug: s };
    }
  }

  if (ENABLE_PRODUCTS_PAGE && (lower.startsWith('/products') || lower.startsWith('/our-products'))) {
    return { page: 'products', slug: null };
  }
  return { page: 'home', slug: null };
}

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [homeContent, setHomeContent] = useState(null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('luma_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Customer Authentication state from centralized AuthContext
  const {
    customerUser,
    isAuthModalOpen,
    authReason,
    openAuthModal,
    closeAuthModal,
    loginCustomer,
    logoutCustomer,
    requireAuth,
  } = useAuth();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutCartItems, setCheckoutCartItems] = useState([]);

  const handleOpenCheckout = (items = null) => {
    requireAuth(() => {
      setIsCartOpen(false);
      if (Array.isArray(items) && items.length > 0) {
        setCheckoutCartItems(items);
      } else {
        setCheckoutCartItems([]);
      }
      setIsCheckoutOpen(true);
    }, 'Please sign in or create an account to proceed to checkout.');
  };
  const [routeState, setRouteState] = useState(() =>
    parseRoute(window.location.pathname)
  );

  const currentPage = routeState.page;
  const currentProductSlug = routeState.slug || 'luma-nova';

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/pages/home');
        const data = await res.json();
        if (res.ok && data?.success && data?.data) {
          setHomeContent(data.data);
        }
      } catch (err) {
        console.error('Error fetching dynamic home page content:', err);
      }
    };
    fetchHomeContent();
  }, []);

  const handleAdminLogin = (userData) => {
    setAdminUser(userData);
    localStorage.setItem('luma_admin_user', JSON.stringify(userData));
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('luma_admin_user');
  };

  const handleCustomerLogin = loginCustomer;
  const handleCustomerLogout = logoutCustomer;

  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page, hash = '') => {
    if (!ENABLE_PRODUCTS_PAGE && page === 'products') {
      page = 'home';
      hash = '#products';
    }

    let targetPath = '/';
    let newRoute = { page: 'home', slug: null };

    if (page === 'admin') {
      targetPath = '/admin';
      newRoute = { page: 'admin', slug: null };
    } else if (page === 'about') {
      targetPath = '/about';
      newRoute = { page: 'about', slug: null };
    } else if (page === 'community') {
      targetPath = '/community';
      newRoute = { page: 'community', slug: null };
    } else if (page === 'reviews') {
      targetPath = '/reviews';
      newRoute = { page: 'reviews', slug: null };
    } else if (page === 'contact') {
      targetPath = '/contact';
      newRoute = { page: 'contact', slug: null };
    } else if (page === 'cart' || page === 'bag') {
      targetPath = '/cart';
      newRoute = { page: 'cart', slug: null };
    } else if (page === 'account' || page === 'my-account') {
      targetPath = '/account';
      newRoute = { page: 'account', slug: null };
    } else if (page === 'products') {
      targetPath = '/products';
      newRoute = { page: 'products', slug: null };
    } else if (page === 'home') {
      targetPath = '/';
      newRoute = { page: 'home', slug: null };
    } else {
      // It's a product slug or 'product-detail'
      const targetSlug = page === 'product-detail' ? (hash || 'luma-nova') : page;
      targetPath = `/products/${targetSlug}`;
      newRoute = { page: 'product-detail', slug: targetSlug };
      hash = '';
    }

    if (window.location.pathname !== targetPath || window.location.hash !== hash) {
      window.history.pushState({}, '', `${targetPath}${hash}`);
    }
    setRouteState(newRoute);

    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (currentPage === 'admin') {
    if (adminUser) {
      return (
        <AdminDashboardPage
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          onNavigateHome={(hash = '') => handleNavigate('home', hash)}
          onNavigatePage={(page) => handleNavigate(page)}
        />
      );
    }
    return (
      <AdminLoginPage
        onLoginSuccess={handleAdminLogin}
        onNavigateHome={(hash = '') => handleNavigate('home', hash)}
      />
    );
  }

  const whatsappNumber = homeContent?.footerConnect?.phone || '+971 50 123 4567';
  const whatsappCleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappLink =
    homeContent?.footerConnect?.socialWhatsapp ||
    (whatsappCleanNumber ? `https://wa.me/${whatsappCleanNumber}` : 'https://wa.me/971501234567');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-['Manrope'] selection:bg-[#EC2024] selection:text-white antialiased">
      {/* Shared TopBanner & Navbar */}
      <div id="hero-wrapper" className="relative w-full">
        <TopBanner />
        <Navbar
          onOpenCart={() => handleNavigate('cart')}
          onOpenMobile={() => setIsMobileOpen(true)}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          enableProductsPage={ENABLE_PRODUCTS_PAGE}
          customerUser={customerUser}
          onOpenCustomerModal={() => openAuthModal('Please sign in or register to access your account.')}
          onOpenCustomerAccount={(tab = 'profile') => handleNavigate('account', `#${tab}`)}
          onCustomerLogout={logoutCustomer}
          whatsappLink={whatsappLink}
        />
        {currentPage === 'home' && <Hero data={homeContent?.hero} />}
      </div>

      {currentPage === 'about' ? (
        <AboutPage onNavigateHome={(hash = '') => handleNavigate('home', hash)} />
      ) : currentPage === 'cart' || currentPage === 'bag' ? (
        <CartPage
          onNavigate={handleNavigate}
          onOpenCheckout={handleOpenCheckout}
        />
      ) : currentPage === 'account' ? (
        <CustomerAccountPage
          customerUser={customerUser}
          onUpdateCustomer={handleCustomerLogin}
          onLogout={handleCustomerLogout}
          onNavigate={handleNavigate}
          onOpenLoginModal={() => setIsCustomerModalOpen(true)}
          onOpenCheckout={handleOpenCheckout}
        />
      ) : currentPage === 'community' ? (
        <CommunityPage onNavigateHome={(hash = '') => handleNavigate('home', hash)} />
      ) : currentPage === 'reviews' ? (
        <ReviewsPage onNavigateHome={(hash = '') => handleNavigate('home', hash)} />
      ) : currentPage === 'contact' ? (
        <ContactPage onNavigateHome={(hash = '') => handleNavigate('home', hash)} />
      ) : (currentPage === 'product-detail' && currentProductSlug === 'luma-glow') || currentPage === 'luma-glow' ? (
        <LumaGlowPage
          onOpenCart={() => handleNavigate('cart')}
          onOpenCheckout={handleOpenCheckout}
          onNavigateHome={(hash = '') => handleNavigate('home', hash)}
          onNavigateProduct={(prodSlug) => handleNavigate(prodSlug)}
        />
      ) : (currentPage === 'product-detail' && currentProductSlug === 'luma-go') || currentPage === 'luma-go' ? (
        <LumaGoPage
          onOpenCart={() => handleNavigate('cart')}
          onOpenCheckout={handleOpenCheckout}
          onNavigateHome={(hash = '') => handleNavigate('home', hash)}
          onNavigateProduct={(prodSlug) => handleNavigate(prodSlug)}
        />
      ) : currentPage === 'product-detail' || currentPage === 'luma-nova' ? (
        <ProductDetailPage
          slug={currentProductSlug || 'luma-nova'}
          onOpenCart={() => handleNavigate('cart')}
          onOpenCheckout={handleOpenCheckout}
          onNavigateHome={(hash = '') => handleNavigate('home', hash)}
          onNavigateProduct={(prodSlug) => handleNavigate(prodSlug)}
        />
      ) : currentPage === 'products' && ENABLE_PRODUCTS_PAGE ? (
        <ProductsPage
          onNavigateHome={(hash = '') => handleNavigate('home', hash)}
          onOpenCart={() => handleNavigate('cart')}
          onOpenCheckout={handleOpenCheckout}
          onNavigate={handleNavigate}
        />
      ) : (
        <>
          {/* Running Trust & Certification Strip (Layer 6) */}
          <TrustStrip data={homeContent?.trustStrip} />

          {/* About LUMA Section (Layer 7) */}
          <AboutSection onNavigate={handleNavigate} data={homeContent?.aboutSection} />

          {/* Clinical Technology & Wavelength Penetration (Layer 8) */}
          <ClinicalTech data={homeContent?.clinicalTech} />

          {/* Evidence-Based Benefits Overview (Layer 9) */}
          <BenefitsOverview data={homeContent?.benefitsOverview} />

          {/* Product Range Showcase (Layer 10) */}
          <ProductRange onAddToCart={() => setIsCartOpen(true)} onNavigate={handleNavigate} data={homeContent?.productRange} />

          {/* 1-Minute Assessment Quiz (Layer 12) */}
          <AssessmentQuiz data={homeContent?.assessmentQuiz} />

          {/* Contiguous White Sections Wrapper (prevents subpixel dark seam on scaled viewports) */}
          <div className="w-full bg-[#FFFFFF]">
            {/* Before & After Real Sessions (Layer 13) */}
            <BeforeAfter data={homeContent?.beforeAfter} />

            {/* FAQs (Layer 15) */}
            <FaqSection data={homeContent?.faqsSection} />

            {/* Join the LUMA Community (Layer 16) */}
            <CommunitySection data={homeContent?.communitySection} />

            {/* What Experts Say (Layer 17) */}
            <ExpertTestimonials data={homeContent?.expertTestimonials} />
          </div>

          {/* Trust & Guarantee Strip (Layer 18) */}
          <TrustGuarantees data={homeContent?.trustGuarantees} />
        </>
      )}

      {/* Shared Footer & Connect */}
      <Footer onOpenCart={() => setIsCartOpen(true)} onNavigate={handleNavigate} data={homeContent?.footerConnect} />

      {/* Shopping Bag Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={handleOpenCheckout}
        onNavigate={handleNavigate}
      />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        onNavigate={handleNavigate}
        enableProductsPage={ENABLE_PRODUCTS_PAGE}
        customerUser={customerUser}
        onOpenCustomerModal={() => openAuthModal('Please sign in or register to access your account.')}
        onOpenCustomerAccount={(tab = 'profile') => handleNavigate('account', `#${tab}`)}
        onCustomerLogout={logoutCustomer}
        whatsappLink={whatsappLink}
      />

      {/* Customer Account & Authentication Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        authReason={authReason}
        customerUser={customerUser}
        onLoginSuccess={loginCustomer}
        onLogout={logoutCustomer}
      />

      {/* Checkout & Dummy Order Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        customerUser={customerUser}
        cartItems={checkoutCartItems}
        onOrderPlaced={() => {
          // If on account page, switching tabs or re-render will fetch fresh orders
        }}
        onNavigateOrders={() => {
          setIsCheckoutOpen(false);
          handleNavigate('account', '#orders');
        }}
      />
    </div>
  );
}
