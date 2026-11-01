import { useState } from 'react';
import { Coffee, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Page } from '../App';

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Menu', page: 'menu' },
  { label: 'About', page: 'about' },
  { label: 'My Orders', page: 'orders' },
  { label: 'Contact', page: 'contact' },
];

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

export default function Navbar({ currentPage, navigate }: NavbarProps) {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: Page) => {
    navigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full transition-colors" style={{ background: 'oklch(30% 0.05 50)' }}>
            <Coffee size={18} className="text-cream" />
          </span>
          <span className="font-display text-lg font-bold tracking-wide text-espresso">THE FIRST COFFEE</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(link => (
            <button
              key={link.page}
              onClick={() => handleNav(link.page)}
              className={`text-sm font-medium transition-colors hover:text-espresso ${
                currentPage === link.page ? 'text-espresso font-semibold' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNav('cart')}
            className="relative rounded-full p-2 hover:bg-secondary transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={20} className="text-espresso" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'oklch(55% 0.2 27)' }}>
                {count}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="rounded-full p-2 hover:bg-secondary md:hidden transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? 'text-cream font-semibold'
                    : 'text-muted-foreground hover:text-espresso hover:bg-muted'
                }`}
                style={currentPage === link.page ? { background: 'oklch(30% 0.05 50)' } : {}}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
