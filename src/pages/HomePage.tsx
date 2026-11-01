import { ArrowRight, QrCode, MapPin, Star } from 'lucide-react';
import { MENU_DATA } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/utils';
import type { Page } from '../App';

const POPULAR_ITEMS = MENU_DATA.items.filter(i => i.is_popular).slice(0, 6);

const CAT_BG: Record<string, string> = {
  '1': 'from-amber-900/80 to-amber-700/80',
  '2': 'from-sky-900/80 to-sky-700/80',
  '3': 'from-pink-900/80 to-pink-700/80',
  '4': 'from-green-900/80 to-emerald-700/80',
  '5': 'from-orange-900/80 to-orange-700/80',
};

const TESTIMONIALS = [
  { name: 'Priya M.', text: 'Best cappuccino in Pune, hands down. The atmosphere is perfect for studying!', stars: 5 },
  { name: 'Rahul K.', text: 'Love the QR ordering system — so convenient. The Oreo shake is heavenly.', stars: 5 },
  { name: 'Sneha P.', text: 'The paneer tikka sandwich + cold brew combo is my daily ritual now!', stars: 5 },
];

export default function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  const { addItem } = useCart();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <div className="h-full w-full" style={{
            background: 'linear-gradient(135deg, oklch(18% 0.04 50) 0%, oklch(28% 0.06 48) 40%, oklch(25% 0.05 55) 100%)'
          }} />
          {/* Coffee steam / texture overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(ellipse at 30% 40%, oklch(72% 0.12 68) 0%, transparent 50%), radial-gradient(ellipse at 80% 60%, oklch(60% 0.09 55) 0%, transparent 50%)`
          }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-28 md:py-40">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-widest text-caramel border border-caramel/30 bg-caramel/10">
            ☕ Now Open · Karve Road, Pune
          </div>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-cream md:text-6xl mb-6">
            Your First Sip.<br />Your Favourite Ritual.
          </h1>
          <p className="max-w-xl text-lg text-cream/80 mb-8 leading-relaxed">
            Specialty coffee and fresh food in the heart of Erandwane, Pune. Scan, order, and relax — we'll bring it to your table.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('menu')}
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold shadow-lg transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'oklch(72% 0.12 68)', color: 'oklch(25% 0.04 50)' }}
            >
              Explore Our Menu <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('cart')}
              className="inline-flex items-center gap-2 rounded-xl border border-cream/50 bg-transparent px-8 py-3.5 text-sm font-bold text-cream hover:bg-cream/10 transition-all active:scale-95"
            >
              Order Now
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-14">
            {[['500+', 'Happy Customers Daily'], ['22', 'Menu Items'], ['4.9★', 'Average Rating']].map(([val, label]) => (
              <div key={label}>
                <p className="font-display text-2xl font-bold text-caramel">{val}</p>
                <p className="text-sm text-cream/60 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured & Bestsellers */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-1">Customer Favorites</p>
            <h2 className="font-display text-3xl font-bold text-espresso">Featured & Bestsellers</h2>
            <p className="mt-1 text-muted-foreground">A few favourites from our menu.</p>
          </div>
          <button onClick={() => navigate('menu')} className="hidden text-sm font-semibold text-espresso hover:text-caramel transition-colors md:flex items-center gap-1">
            View full menu <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_ITEMS.map(item => {
            const cat = MENU_DATA.categories.find(c => c.id === item.category_id);
            return (
              <div key={item.id} className="group bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all overflow-hidden">
                {/* Card image area */}
                <div className={`h-40 bg-gradient-to-br ${CAT_BG[item.category_id]} flex items-center justify-center relative`}>
                  <span className="text-6xl">{cat?.emoji}</span>
                  <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-caramel text-espresso">
                    Popular
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-espresso">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-espresso text-lg">{formatINR(item.price)}</span>
                    <button
                      onClick={() => addItem({ id: item.id, name: item.name, price: item.price, category: cat?.name })}
                      className="text-sm font-semibold text-cream px-4 py-1.5 rounded-full transition-all hover:opacity-90 active:scale-95"
                      style={{ background: 'oklch(30% 0.05 50)' }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-8 md:hidden">
          <button onClick={() => navigate('menu')} className="text-sm font-semibold text-espresso hover:text-caramel transition-colors">
            View full menu →
          </button>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16" style={{ background: 'oklch(95% 0.015 80)' }}>
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-1">What we serve</p>
          <h2 className="font-display text-3xl font-bold text-espresso mb-8">Browse by Category</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {MENU_DATA.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate('menu')}
                className="group bg-white rounded-2xl border border-border p-5 text-center hover:shadow-md hover:border-caramel/50 transition-all"
              >
                <span className="text-4xl">{cat.emoji}</span>
                <p className="font-semibold text-espresso mt-3 text-sm">{cat.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* QR Order Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-2">Dine-in Experience</p>
            <h2 className="font-display text-3xl font-bold text-espresso mb-4">Order from your table</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Dining in? Just scan the QR code on your table to open the menu with your table already selected — no waiting, no queues. Your order comes straight to you.
            </p>
            <ul className="space-y-3 mb-8">
              {['Scan QR code at your table', 'Browse & add items to cart', 'Choose payment method', 'We bring it to your table'].map((step, i) => (
                <li key={step} className="flex items-center gap-3 text-sm">
                  <span className="flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold text-cream flex-shrink-0" style={{ background: 'oklch(30% 0.05 50)' }}>{i + 1}</span>
                  <span className="text-espresso font-medium">{step}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('menu')} className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-cream transition-all hover:opacity-90" style={{ background: 'oklch(30% 0.05 50)' }}>
              Browse the Menu <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex justify-center">
            <div className="flex h-52 w-52 items-center justify-center rounded-3xl shadow-xl" style={{ background: 'oklch(93% 0.025 80)' }}>
              <QrCode size={100} style={{ color: 'oklch(30% 0.05 50)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16" style={{ background: 'oklch(97% 0.012 85)' }}>
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-1">What people say</p>
            <h2 className="font-display text-3xl font-bold text-espresso">Loved by Pune ❤️</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} size={14} fill="oklch(72% 0.12 68)" className="text-caramel" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-semibold text-espresso text-sm">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Us */}
      <section className="border-t py-16" style={{ background: 'oklch(96% 0.018 85)' }}>
        <div className="mx-auto max-w-6xl px-4 text-center">
          <MapPin size={32} className="mx-auto mb-3 text-caramel" style={{ color: 'oklch(72% 0.12 68)' }} />
          <h2 className="font-display text-3xl font-bold text-espresso mb-3">Find us in Erandwane</h2>
          <p className="text-muted-foreground mb-6">Karve Road, Opp. Ranka Jewellers, Erandwane, Pune, Maharashtra, India</p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Karve+Road+Opp+Ranka+Jewellers+Erandwane+Pune"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-espresso hover:bg-muted transition-colors shadow-sm"
          >
            <MapPin size={14} /> Open in Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}
