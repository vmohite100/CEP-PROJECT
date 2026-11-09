import { useState } from 'react';
import { Coffee, ShoppingCart, Menu, X, User, LogOut, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
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
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: Page) => {
    navigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 cursor-pointer text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Coffee className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-wide text-foreground">
            THE FIRST COFFEE
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(link => (
            <button
              key={link.page}
              onClick={() => handleNav(link.page)}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentPage === link.page
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('admin')}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
              currentPage === 'admin'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            Admin
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Cart Icon */}
          <button
            onClick={() => handleNav('cart')}
            className="relative rounded-full p-2 hover:bg-secondary cursor-pointer transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-destructive-foreground shadow-sm">
                {count}
              </span>
            )}
          </button>

          {/* User Auth Buttons */}
          {isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-2 pl-1 border-l border-border">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-foreground">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-secondary cursor-pointer transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="hidden rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 md:block cursor-pointer transition-colors"
            >
              Sign in
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="rounded-full p-2 hover:bg-secondary md:hidden cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden space-y-2">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-border text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">{user.name}</span>
                <span className="text-xs text-muted-foreground">({user.phone})</span>
              </div>
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="text-xs text-destructive flex items-center gap-1 font-medium hover:underline"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { openAuthModal(); setMobileOpen(false); }}
              className="w-full mb-3 rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Sign in / Create Account
            </button>
          )}

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('admin')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentPage === 'admin'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Portal
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
