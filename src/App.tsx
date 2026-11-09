import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    const url = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== url) {
      window.history.pushState(null, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        {currentPage !== 'admin' && <Navbar currentPage={currentPage} navigate={navigate} />}
        <main className="flex-1">
          {currentPage === 'home' && <HomePage navigate={navigate} />}
          {currentPage === 'menu' && <MenuPage />}
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'contact' && <ContactPage />}
          {currentPage === 'cart' && <CartPage navigate={navigate} />}
          {currentPage === 'orders' && <OrdersPage />}
          {currentPage === 'admin' && <AdminPage onBack={() => navigate('home')} />}
        </main>
        {currentPage !== 'admin' && <Footer navigate={navigate} />}
      </div>
    </CartProvider>
  );
}
