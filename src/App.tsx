import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';

export type Page = 'home' | 'menu' | 'about' | 'contact' | 'cart' | 'orders' | 'admin';

function getInitialPage(): Page {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const target = path || hash;
  if (target === 'admin') return 'admin';
  if (target === 'menu') return 'menu';
  if (target === 'about') return 'about';
  if (target === 'contact') return 'contact';
  if (target === 'cart' || target === 'checkout') return 'cart';
  if (target === 'orders') return 'orders';
  return 'home';
}

function getInitialCategory(): string | undefined {
  const params = new URLSearchParams(window.location.search);
  return params.get('category') || undefined;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(getInitialCategory);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
      setSelectedCategory(getInitialCategory());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (page: Page, categoryFilter?: string) => {
    setCurrentPage(page);
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    } else if (page !== 'menu') {
      setSelectedCategory(undefined);
    }

    let url = page === 'home' ? '/' : `/${page}`;
    if (page === 'menu' && categoryFilter) {
      url += `?category=${encodeURIComponent(categoryFilter)}`;
    }

    if (window.location.pathname + window.location.search !== url) {
      window.history.pushState(null, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          {currentPage !== 'admin' && <Navbar currentPage={currentPage} navigate={navigate} />}
          <main className="flex-1">
            {currentPage === 'home' && <HomePage navigate={navigate} />}
            {currentPage === 'menu' && <MenuPage initialCategory={selectedCategory} navigate={navigate} />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'contact' && <ContactPage />}
            {currentPage === 'cart' && <CartPage navigate={navigate} />}
            {currentPage === 'orders' && <OrdersPage />}
            {currentPage === 'admin' && <AdminPage onBack={() => navigate('home')} />}
          </main>
          {currentPage !== 'admin' && <Footer navigate={navigate} />}

          {/* Global Customer Auth Dialog */}
          <AuthModal />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
