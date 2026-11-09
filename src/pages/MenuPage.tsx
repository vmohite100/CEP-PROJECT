import { useState, useEffect } from 'react';
import { getMenuItems, getCategories } from '../lib/menuService';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/utils';
import { Search } from 'lucide-react';
import type { MenuItem } from '../data/menuData';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<MenuItem[]>(getMenuItems);
  const categories = getCategories();
  const { addItem, items: cartItems } = useCart();

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

  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'all' || item.category_id === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchCat && matchSearch && item.is_available;
  });

  const getCartQty = (id: string) => cartItems.find(i => i.id === id)?.quantity ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="py-12 text-center" style={{ background: 'linear-gradient(135deg, oklch(22% 0.04 50), oklch(30% 0.06 48))' }}>
        <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-2">What we serve</p>
        <h1 className="font-display text-4xl font-bold text-cream mb-3">Our Menu</h1>
        <p className="text-cream/70 max-w-md mx-auto">Handcrafted drinks & fresh food made with love, right here in Erandwane.</p>
      </div>

      {/* Search + Filter */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-center">
          {/* Search */}
          <div className="relative flex-shrink-0 w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/40 bg-white"
            />
          </div>
          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto w-full pb-0.5">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'all' ? 'text-cream shadow' : 'text-muted-foreground hover:text-espresso hover:bg-muted'
              }`}
              style={activeCategory === 'all' ? { background: 'oklch(30% 0.05 50)' } : {}}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat.id ? 'text-cream shadow' : 'text-muted-foreground hover:text-espresso hover:bg-muted'
                }`}
                style={activeCategory === cat.id ? { background: 'oklch(30% 0.05 50)' } : {}}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-5xl mb-3">🔍</p>
            <p className="font-medium">No items found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <>
            {activeCategory === 'all' && !search ? (
              categories.map(cat => {
                const catItems = filtered.filter(i => i.category_id === cat.id);
                if (!catItems.length) return null;
                return (
                  <div key={cat.id} className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{cat.emoji}</span>
                      <h2 className="font-display text-2xl font-bold text-espresso">{cat.name}</h2>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{catItems.length} items</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {catItems.map(item => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          qty={getCartQty(item.id)}
                          onAdd={() => addItem({ id: item.id, name: item.name, price: item.price })}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(item => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    qty={getCartQty(item.id)}
                    onAdd={() => addItem({ id: item.id, name: item.name, price: item.price })}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const CAT_GRADIENT: Record<string, string> = {
  '1': 'from-amber-950 to-amber-800',
  '2': 'from-sky-950 to-sky-800',
  '3': 'from-pink-950 to-pink-800',
  '4': 'from-emerald-950 to-emerald-800',
  '5': 'from-orange-950 to-orange-800',
};

function MenuCard({ item, qty, onAdd }: { item: MenuItem; qty: number; onAdd: () => void }) {
  const categories = getCategories();
  const cat = categories.find(c => c.id === item.category_id);
  const [flash, setFlash] = useState(false);

  const handleAdd = () => {
    onAdd();
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden group">
      <div className={`h-36 bg-gradient-to-br ${CAT_GRADIENT[item.category_id] || 'from-amber-950 to-amber-800'} flex items-center justify-center relative`}>
        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{cat?.emoji || '☕'}</span>
        {item.is_popular && (
          <span className="absolute top-2.5 right-2.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-caramel text-espresso">Popular</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-espresso">{item.name}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-espresso text-lg">{formatINR(item.price)}</span>
          {qty > 0 ? (
            <div className="flex items-center gap-2 bg-muted rounded-full px-1 py-0.5">
              <button onClick={onAdd} className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-espresso hover:bg-white transition-colors text-sm cursor-pointer">+</button>
              <span className="font-bold text-sm text-espresso w-4 text-center">{qty}</span>
              <span className="text-xs text-muted-foreground">in cart</span>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer ${flash ? 'bg-green-500 text-white' : 'text-cream'}`}
              style={!flash ? { background: 'oklch(30% 0.05 50)' } : {}}
            >
              {flash ? '✓ Added' : '+ Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
