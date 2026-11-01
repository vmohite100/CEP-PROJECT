import { useState } from 'react';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Settings, TrendingUp } from 'lucide-react';
import { formatINR } from '../lib/utils';

type AdminTab = 'dashboard' | 'orders' | 'menu' | 'settings';

const DEMO_ORDERS = [
  { id: '1', order_number: 'TFC-1042', status: 'preparing', order_type: 'dine_in', total: 540, items: ['Cappuccino x2', 'Paneer Tikka Sandwich'], created_at: '2026-10-30T07:30:00Z', payment_method: 'upi' },
  { id: '2', order_number: 'TFC-1041', status: 'received', order_type: 'takeaway', total: 220, items: ['Mocha Frappuccino'], created_at: '2026-10-30T07:28:00Z', payment_method: 'cash' },
  { id: '3', order_number: 'TFC-1040', status: 'ready', order_type: 'dine_in', total: 360, items: ['Cold Brew', 'Oreo Shake'], created_at: '2026-10-30T07:20:00Z', payment_method: 'upi' },
  { id: '4', order_number: 'TFC-1039', status: 'completed', order_type: 'dine_in', total: 170, items: ['Nutella Shake'], created_at: '2026-10-30T07:05:00Z', payment_method: 'cash' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; next?: string }> = {
  received:   { label: 'Received',  color: 'oklch(45% 0.18 240)', bg: 'oklch(93% 0.05 240)', next: 'accepted' },
  accepted:   { label: 'Accepted',  color: 'oklch(45% 0.18 270)', bg: 'oklch(93% 0.05 270)', next: 'preparing' },
  preparing:  { label: 'Preparing', color: 'oklch(55% 0.18 60)',  bg: 'oklch(95% 0.05 60)',  next: 'ready' },
  ready:      { label: 'Ready ✓',   color: 'oklch(50% 0.18 145)', bg: 'oklch(93% 0.05 145)', next: 'completed' },
  completed:  { label: 'Done',      color: 'oklch(50% 0.04 60)',  bg: 'oklch(94% 0.02 75)',  next: undefined },
  cancelled:  { label: 'Cancelled', color: 'oklch(50% 0.2 27)',   bg: 'oklch(95% 0.05 27)',  next: undefined },
};

export default function AdminPage({ onBack }: { onBack?: () => void } = {}) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [orders, setOrders] = useState(DEMO_ORDERS);

  const updateStatus = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next = STATUS_CONFIG[o.status]?.next;
      return next ? { ...o, status: next } : o;
    }));
  };

  const todayRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length;

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { id: 'menu', label: 'Menu', icon: <UtensilsCrossed size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Bar */}
      <header className="text-cream px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, oklch(22% 0.04 50), oklch(30% 0.06 48))' }}>
        <div>
          <h1 className="font-display text-xl font-bold">Admin Panel</h1>
          <p className="text-cream/60 text-xs">The First Coffee — Staff View</p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs font-medium bg-white/10 hover:bg-white/20 text-cream px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            ← Back to Cafe
          </button>
        )}
      </header>

      {/* Tab Nav */}
      <nav className="bg-white border-b border-border sticky top-0 z-20">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap px-2 ${
                activeTab === tab.id
                  ? 'border-espresso text-espresso'
                  : 'border-transparent text-muted-foreground hover:text-espresso'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-5">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon="💰" label="Today's Revenue" value={formatINR(todayRevenue)} sub="from completed orders" />
              <StatCard icon="🔥" label="Active Orders" value={String(activeOrders)} sub="in progress right now" />
              <StatCard icon="📦" label="Total Orders" value={String(orders.length)} sub="today" />
              <StatCard icon="⭐" label="Popular Item" value="Cappuccino" sub="most ordered today" />
            </div>

            <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} style={{ color: 'oklch(30% 0.05 50)' }} />
                <h3 className="font-semibold text-espresso text-sm">Recent Orders</h3>
              </div>
              <div className="space-y-2">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-espresso text-sm">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{order.items[0]}{order.items.length > 1 ? ` +${order.items.length - 1}` : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-espresso">{formatINR(order.total)}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ color: STATUS_CONFIG[order.status]?.color, background: STATUS_CONFIG[order.status]?.bg }}>
                        {STATUS_CONFIG[order.status]?.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-espresso text-lg">Live Orders</h2>
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{orders.filter(o => o.status !== 'completed').length} active</span>
            </div>
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status];
              const hasNext = !!cfg?.next;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-espresso">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground capitalize">{order.order_type.replace('_', ' ')} · {order.payment_method?.toUpperCase()}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-semibold"
                      style={{ color: cfg?.color, background: cfg?.bg }}>
                      {cfg?.label}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {order.items.map((item, i) => <span key={i} className="mr-2">• {item}</span>)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-espresso">{formatINR(order.total)}</span>
                    {hasNext && (
                      <button
                        onClick={() => updateStatus(order.id)}
                        className="text-sm font-semibold text-cream px-4 py-1.5 rounded-full transition-all active:scale-95"
                        style={{ background: 'oklch(30% 0.05 50)' }}
                      >
                        Mark as {STATUS_CONFIG[cfg!.next!]?.label}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-espresso text-lg">Menu Items</h2>
              <button className="text-sm font-semibold text-cream px-4 py-2 rounded-full" style={{ background: 'oklch(30% 0.05 50)' }}>+ Add Item</button>
            </div>
            {['Coffee', 'Frappuccinos', 'Shakes', 'Mocktails', 'Sandwiches'].map(category => (
              <div key={category} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                <h3 className="font-semibold text-espresso mb-3 flex items-center gap-2">
                  <span>{category === 'Coffee' ? '☕' : category === 'Frappuccinos' ? '🧊' : category === 'Shakes' ? '🥤' : category === 'Mocktails' ? '🍹' : '🥪'}</span>
                  {category}
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {category === 'Coffee' ? 4 : category === 'Frappuccinos' ? 3 : category === 'Shakes' ? 3 : category === 'Mocktails' ? 3 : 3} items
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    ...(category === 'Coffee' ? ['Espresso — ₹120', 'Cappuccino — ₹160', 'Flat White — ₹180', 'Cold Brew — ₹200'] : []),
                    ...(category === 'Frappuccinos' ? ['Mocha Frappuccino — ₹220', 'Caramel Frappuccino — ₹220', 'Vanilla Bean — ₹210'] : []),
                    ...(category === 'Shakes' ? ['Oreo Shake — ₹200', 'Strawberry Shake — ₹190', 'Nutella Shake — ₹210'] : []),
                    ...(category === 'Mocktails' ? ['Blue Lagoon — ₹180', 'Virgin Mojito — ₹160', 'Watermelon Cooler — ₹170'] : []),
                    ...(category === 'Sandwiches' ? ['Classic Veg Grilled — ₹140', 'Paneer Tikka — ₹170', 'Club Sandwich — ₹190'] : []),
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm border-b border-border last:border-0">
                      <span className="text-espresso font-medium">{item.split(' — ')[0]}</span>
                      <span className="text-muted-foreground font-semibold">{item.split(' — ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-espresso text-lg">Cafe Settings</h2>
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
              {[
                { label: 'Cafe Name', value: 'The First Coffee' },
                { label: 'Address', value: 'Karve Road, Erandwane, Pune' },
                { label: 'Hours', value: '8:00 AM – 10:00 PM' },
              ].map(field => (
                <div key={field.label}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{field.label}</label>
                  <input
                    defaultValue={field.value}
                    className="w-full mt-1 border border-border rounded-xl px-3 py-2.5 text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-caramel/50"
                  />
                </div>
              ))}

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment Methods</p>
                <div className="space-y-2">
                  {['UPI Payments', 'Cash Payments', 'Takeaway Orders'].map(option => (
                    <label key={option} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-espresso">{option}</span>
                      <div className="relative">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 rounded-full peer-checked:bg-espresso bg-border transition-colors peer-checked:[&+div]:translate-x-5 cursor-pointer" style={{ background: 'oklch(89% 0.02 75)' }} />
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full py-3 rounded-2xl font-bold text-cream text-sm" style={{ background: 'oklch(30% 0.05 50)' }}>
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="font-bold text-espresso text-lg leading-tight">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground mt-0.5">{label}</p>
      <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>
    </div>
  );
}
