import { useState, useEffect, useMemo } from 'react';
import { getMenuItems, getCategories } from '../lib/menuService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../lib/utils';
import { Coffee, Search, Sparkles, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import type { MenuItem } from '../data/menuData';
import type { Page } from '../App';

interface MenuPageProps {
  initialCategory?: string;
  navigate?: (page: Page) => void;
}

export default function MenuPage({ initialCategory, navigate }: MenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(getMenuItems);
  const categories = getCategories();
  const { addItem, updateQty, items: cartItems, count: cartCount, total: cartTotal } = useCart();
  const { requireAuth } = useAuth();

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getMenuItems());
    };
    window.addEventListener('tfc_menu_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('tfc_menu_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Compute item count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(it => {
      counts[it.category] = (counts[it.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (availableOnly && !item.is_available) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = item.name.toLowerCase().includes(q);
        const inDesc = item.description?.toLowerCase().includes(q) ?? false;
        const inCat = item.category.toLowerCase().includes(q);
        if (!inName && !inDesc && !inCat) return false;
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery, availableOnly]);

  const handleAddItem = (item: MenuItem) => {
    requireAuth(() => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        category: item.category
      });
    });
  };

  const getItemQty = (id: string) => {
    const found = cartItems.find(c => c.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-28">
      {/* Top Header */}
      <div className="border-b border-border/40 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Coffee className="h-4 w-4" />
              </span>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Our Menu</h1>
            </div>
            <p className="mt-2 text-muted-foreground">
              Handcrafted coffee, artisan frappes, decadent shakes, and freshly grilled sandwiches in Erandwane, Pune.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, shake, sandwich, tea…"
              aria-label="Search menu"
              className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9 bg-card text-foreground"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="h-4 w-4 rounded accent-primary cursor-pointer"
            />
            <span>Available only</span>
          </label>
        </div>

        {/* Horizontal Category Selector */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium cursor-pointer transition-colors h-8 px-3.5 text-xs rounded-full shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow'
                : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground'
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map(cat => {
            const count = categoryCounts[cat.name] || 0;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium cursor-pointer transition-colors h-8 px-3.5 text-xs rounded-full shrink-0 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow font-semibold'
                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="mt-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border p-8">
            <Coffee className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-display text-lg font-semibold text-foreground">No menu items found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search terms or category filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setAvailableOnly(false); }}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map(item => {
              const qty = getItemQty(item.id);
              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                >
                  {/* Image container */}
                  <div className="relative h-48 w-full overflow-hidden bg-secondary">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {item.is_bestseller && (
                        <div className="inline-flex items-center rounded-md border border-transparent bg-amber-500 hover:bg-amber-600 text-white shadow-sm px-2.5 py-0.5 text-xs font-semibold gap-1">
                          <Sparkles className="h-3 w-3" /> Bestseller
                        </div>
                      )}
                    </div>

                    {item.is_veg && (
                      <div
                        className="absolute top-3 right-3 rounded bg-background/90 p-1 shadow-sm backdrop-blur-sm"
                        title="Vegetarian"
                      >
                        <span className="flex h-3.5 w-3.5 items-center justify-center border border-emerald-600 p-0.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                          {item.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border/40 bg-secondary/20 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider block">Price</span>
                        <span className="font-display text-xl font-bold text-foreground">
                          {formatINR(item.price)}
                        </span>
                      </div>

                      {!item.is_available ? (
                        <span className="rounded bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          Sold Out
                        </span>
                      ) : qty > 0 ? (
                        <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-1">
                          <button
                            onClick={() => updateQty(item.id, qty - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-primary shadow-sm hover:bg-primary/20 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-primary">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, qty + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddItem(item)}
                          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3.5 text-xs shadow-sm"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating View Cart Pill when items are added */}
      {cartCount > 0 && navigate && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md animate-in slide-in-from-bottom-6">
          <button
            onClick={() => navigate('cart')}
            className="w-full flex items-center justify-between rounded-full bg-primary px-6 py-3.5 text-primary-foreground shadow-2xl hover:bg-primary/90 transition-transform active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-caramel text-espresso text-xs font-bold">
                {cartCount}
              </span>
              <span className="text-sm font-semibold tracking-wide">View Order</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base">{formatINR(cartTotal)}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
