import { useState, useEffect } from 'react';
import { ArrowRight, QrCode, MapPin, Star, Plus, Check } from 'lucide-react';
import { getMenuItems, getCategories } from '../lib/menuService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../lib/utils';
import type { Page } from '../App';
import type { MenuItem } from '../data/menuData';

interface HomePageProps {
  navigate: (page: Page, categoryFilter?: string) => void;
}

export default function HomePage({ navigate }: HomePageProps) {
  const { addItem, items: cartItems } = useCart();
  const { requireAuth } = useAuth();
  const categories = getCategories();
  const [bestsellers, setBestsellers] = useState<MenuItem[]>([]);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  useEffect(() => {
    const loadBestsellers = () => {
      const all = getMenuItems();
      // Look for the specific bestsellers or fallback to items with is_bestseller
      const filtered = all.filter(i => i.is_bestseller).slice(0, 6);
      setBestsellers(filtered.length > 0 ? filtered : all.slice(0, 6));
    };
    loadBestsellers();

    const handleUpdate = () => loadBestsellers();
    window.addEventListener('tfc_menu_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('tfc_menu_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    requireAuth(() => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        category: item.category
      });
      setAddedNotice(item.name);
      setTimeout(() => setAddedNotice(null), 2500);
    });
  };

  return (
    <div>
      {/* Toast Notification when item added */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-emerald-800 text-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-5">
          <Check className="h-4 w-4 text-emerald-300" />
          <span className="text-sm font-medium">Added &ldquo;{addedNotice}&rdquo; to your order!</span>
        </div>
      )}

      {/* SECTION 1: HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="/hero-cafe.jpg"
            alt="Inside THE FIRST COFFEE"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-espresso/70"></div>
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-28 md:py-40">
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-cream md:text-6xl text-balance">
            Your First Sip. Your Favourite Ritual.
          </h1>
          <p className="max-w-xl text-lg text-cream/85">
            Specialty coffee and fresh food in the heart of Erandwane, Pune. Scan, order, and relax — we&apos;ll bring it to your table.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('menu')}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed shadow h-10 rounded-md px-8 bg-caramel text-espresso hover:bg-caramel/90 font-semibold"
            >
              Explore Our Menu <ArrowRight className="ml-1 h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('menu')}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed border shadow-sm h-10 rounded-md px-8 border-cream/60 bg-transparent text-cream hover:bg-cream/10 hover:text-cream font-semibold"
            >
              Order Now
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED & BESTSELLERS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Featured &amp; Bestsellers</h2>
            <p className="mt-1 text-muted-foreground">A few favourites from our menu.</p>
          </div>
          <button
            onClick={() => navigate('menu')}
            className="hidden text-sm font-medium text-primary hover:underline md:block cursor-pointer"
          >
            View full menu &rarr;
          </button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bestsellers.map(item => {
            const inCart = cartItems.find(c => c.id === item.id);
            return (
              <div
                key={item.id}
                className="rounded-xl border border-border/60 bg-card text-card-foreground shadow overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="h-44 w-full overflow-hidden bg-secondary">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
                    <div className="inline-flex items-center rounded-md border border-transparent px-2.5 py-0.5 text-xs font-semibold bg-amber-500 text-white shadow-sm shrink-0">
                      <Star className="mr-1 h-3 w-3 fill-current" /> Bestseller
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">
                      {formatINR(item.price)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs shadow-sm ${
                        inCart
                          ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                          : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Added ({inCart.quantity})
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" /> Add to cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: BROWSE BY CATEGORY */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl font-bold">Browse by category</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate('menu', cat.name)}
                className="text-left cursor-pointer group"
              >
                <div className="rounded-xl border border-border/70 bg-card text-card-foreground shadow h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary/50 group-hover:-translate-y-0.5">
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: ORDER FROM YOUR TABLE */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Order from your table</h2>
            <p className="mt-3 text-muted-foreground">
              Dining in? Just scan the QR code on your table to open the menu with your table already selected — no waiting, no queues.
            </p>
            <button
              onClick={() => navigate('menu')}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-6"
            >
              Browse the menu
            </button>
          </div>
          <div className="flex justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-secondary shadow-inner">
              <QrCode className="h-24 w-24 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FIND US IN ERANDWANE */}
      <section className="border-t border-border bg-cream/70 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <MapPin className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground">Find us in Erandwane</h2>
          <p className="mt-3 text-muted-foreground">
            Karve Road, Opp. Ranka Jewellers, Erandwane, Pune, Maharashtra, India
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Karve+Road+Opp+Ranka+Jewellers+Erandwane+Pune"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 mt-6 text-foreground"
          >
            Open in Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}
