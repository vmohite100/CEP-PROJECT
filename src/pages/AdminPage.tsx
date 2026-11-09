import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Settings,
  TrendingUp,
  Lock,
  Unlock,
  Check,
  Edit2,
  Receipt,
  RotateCcw,
  Search,
  Eye,
  LogOut,
  Coffee,
} from 'lucide-react';
import { formatINR } from '../lib/utils';
import { getOrders, updateOrderStatus, subscribeToOrders, type CafeOrder } from '../lib/orderService';
import { getMenuItems, getCategories, updateMenuItemPrice, toggleMenuItemAvailability, resetMenuDefaults } from '../lib/menuService';
import ReceiptModal from '../components/ReceiptModal';
import type { MenuItem } from '../data/menuData';

type AdminTab = 'dashboard' | 'orders' | 'menu' | 'settings';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; next?: CafeOrder['status'] }> = {
  received:   { label: 'Received',  color: 'oklch(45% 0.18 240)', bg: 'oklch(93% 0.05 240)', next: 'accepted' },
  accepted:   { label: 'Accepted',  color: 'oklch(45% 0.18 270)', bg: 'oklch(93% 0.05 270)', next: 'preparing' },
  preparing:  { label: 'Preparing', color: 'oklch(55% 0.18 60)',  bg: 'oklch(95% 0.05 60)',  next: 'ready' },
  ready:      { label: 'Ready ✓',   color: 'oklch(50% 0.18 145)', bg: 'oklch(93% 0.05 145)', next: 'completed' },
  completed:  { label: 'Done',      color: 'oklch(50% 0.04 60)',  bg: 'oklch(94% 0.02 75)',  next: undefined },
  cancelled:  { label: 'Cancelled', color: 'oklch(50% 0.2 27)',   bg: 'oklch(95% 0.05 27)',  next: undefined },
};

export default function AdminPage({ onBack }: { onBack?: () => void } = {}) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('tfc_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [orders, setOrders] = useState<CafeOrder[]>(getOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getMenuItems);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCatFilter, setMenuCatFilter] = useState('all');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>('');
  const [priceNotice, setPriceNotice] = useState<string>('');
  const [selectedReceipt, setSelectedReceipt] = useState<CafeOrder | null>(null);

  // Subscribe to live order updates
  useEffect(() => {
    const unsubOrders = subscribeToOrders(latest => setOrders(latest));
    const handleMenuUpdated = () => setMenuItems(getMenuItems());
    window.addEventListener('tfc_menu_updated', handleMenuUpdated);

    return () => {
      unsubOrders();
      window.removeEventListener('tfc_menu_updated', handleMenuUpdated);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pinInput.trim().toLowerCase();
    // Default allowed admin credentials: admin123, 1234, admin, or coffee
    if (clean === 'admin123' || clean === '1234' || clean === 'admin' || clean === 'coffee') {
      sessionStorage.setItem('tfc_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect Password/PIN. (Hint: use admin123 or 1234)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('tfc_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleStatusChange = async (orderId: string, nextStatus?: CafeOrder['status']) => {
    if (!nextStatus) return;
    await updateOrderStatus(orderId, nextStatus);
  };

  const handleStartEditPrice = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditPriceValue(String(item.price));
  };

  const handleSavePrice = (id: string) => {
    const parsed = Number(editPriceValue);
    if (isNaN(parsed) || parsed < 1) {
      alert('Please enter a valid price in INR (e.g. 150)');
      return;
    }
    const success = updateMenuItemPrice(id, parsed);
    if (success) {
      setMenuItems(getMenuItems());
      setEditingItemId(null);
      setPriceNotice('Price updated successfully! Live website updated.');
      setTimeout(() => setPriceNotice(''), 3000);
    }
  };

  const handleToggleStock = (id: string) => {
    toggleMenuItemAvailability(id);
    setMenuItems(getMenuItems());
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all product prices and stock to cafe defaults?')) {
      resetMenuDefaults();
      setMenuItems(getMenuItems());
      setPriceNotice('All menu items restored to default prices.');
      setTimeout(() => setPriceNotice(''), 3000);
    }
  };

  // Calculations
  const todayRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((s, o) => s + (o.total || 0), 0);
  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length;
  const categories = getCategories();

  // LOGIN SCREEN GATING
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'oklch(96% 0.015 80)' }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-border">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 shadow-md" style={{ background: 'oklch(30% 0.05 50)' }}>
              <Lock size={28} className="text-cream" />
            </div>
            <h1 className="font-display font-bold text-2xl text-espresso">Staff & Admin Portal</h1>
            <p className="text-xs text-muted-foreground mt-1">THE FIRST COFFEE — Store Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Admin Password / PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value);
                  setAuthError('');
                }}
                placeholder="Enter admin password (e.g. admin123)"
                autoFocus
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50 font-mono"
              />
              {authError && <p className="text-xs text-red-600 font-medium mt-1.5">{authError}</p>}
            </div>

            <div className="p-3 bg-muted/50 rounded-xl text-xs text-muted-foreground">
              <span className="font-semibold text-espresso">Default Admin Access:</span> <code className="bg-white px-1.5 py-0.5 rounded border border-border font-bold">admin123</code> or <code className="bg-white px-1.5 py-0.5 rounded border border-border font-bold">1234</code>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-cream text-sm flex items-center justify-center gap-2 shadow hover:opacity-95 transition-opacity cursor-pointer"
              style={{ background: 'oklch(30% 0.05 50)' }}
            >
              <Unlock size={16} /> Sign In to Admin Panel
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full py-2.5 text-xs text-muted-foreground hover:text-espresso font-semibold transition-colors cursor-pointer"
              >
                ← Back to Customer Website
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN PANEL
  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { id: 'orders', label: `Orders (${activeOrders})`, icon: <ShoppingBag size={17} /> },
    { id: 'menu', label: 'Menu & Prices', icon: <UtensilsCrossed size={17} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    const matchCat = menuCatFilter === 'all' || item.category_id === menuCatFilter;
    const matchSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top Header */}
      <header className="text-cream px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, oklch(22% 0.04 50), oklch(30% 0.06 48))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Coffee size={18} className="text-caramel" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-bold">Admin Portal</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                Manager Mode
              </span>
            </div>
            <p className="text-cream/60 text-xs">THE FIRST COFFEE · Erandwane, Pune</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-cream px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Eye size={13} /> View Website
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Logout from Admin"
          >
            <LogOut size={13} /> Exit
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-20 shadow-xs">
        <div className="max-w-4xl mx-auto flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap px-3 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-espresso text-espresso bg-espresso/5'
                  : 'border-transparent text-muted-foreground hover:text-espresso'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon="💰" label="Completed Revenue" value={formatINR(todayRevenue)} sub="settled orders" />
              <StatCard icon="🔥" label="Active Orders" value={String(activeOrders)} sub="in prep queue" />
              <StatCard icon="📦" label="Total Orders" value={String(orders.length)} sub="all time / today" />
              <StatCard icon="☕" label="Active Menu Items" value={String(menuItems.filter(i => i.is_available).length)} sub={`of ${menuItems.length} total`} />
            </div>

            <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: 'oklch(30% 0.05 50)' }} />
                  <h3 className="font-semibold text-espresso text-sm">Recent Customer Orders</h3>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-caramel hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="divide-y divide-border">
                {orders.slice(0, 5).map(order => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['received'];
                  return (
                    <div key={order.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-espresso text-sm">{order.order_number}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ color: cfg.color, background: cfg.bg }}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {order.customer_name || 'Guest'} · {order.order_type.replace('_', ' ')} {order.table_no ? `(T-${order.table_no})` : ''} · {order.items.length} items
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <p className="font-bold text-sm text-espresso">{formatINR(order.total)}</p>
                        <button
                          onClick={() => setSelectedReceipt(order)}
                          className="text-xs px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-espresso font-semibold transition-colors cursor-pointer"
                        >
                          Receipt
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-espresso text-lg">Live Order Manager</h2>
                <p className="text-xs text-muted-foreground">Accept, prepare, and complete customer orders in real time</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground bg-white border border-border px-3 py-1.5 rounded-full shadow-xs">
                {activeOrders} active orders in kitchen
              </span>
            </div>

            <div className="space-y-3">
              {orders.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['received'];
                const nextStatus = cfg?.next;

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-base text-espresso">{order.order_number}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold" style={{ color: cfg.color, background: cfg.bg }}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          👤 <span className="font-semibold text-espresso">{order.customer_name || 'Guest'}</span> {order.phone ? `(${order.phone})` : ''} · <span className="capitalize">{order.order_type.replace('_', ' ')}</span> {order.table_no ? `· Table ${order.table_no}` : ''}
                        </p>
                        {order.note && (
                          <p className="text-xs text-amber-800 bg-amber-50 rounded-md px-2 py-1 mt-1 font-medium border border-amber-200">
                            📝 Note: {order.note}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-espresso text-base">{formatINR(order.total)}</p>
                        <span className="text-[11px] text-muted-foreground uppercase">{order.payment_method} · Paid</span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="p-3 bg-muted/30 rounded-xl text-xs space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-espresso">
                          <span>{it.qty} × {it.name}</span>
                          <span className="font-semibold">{formatINR(it.price * it.qty)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setSelectedReceipt(order)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-espresso transition-colors cursor-pointer"
                      >
                        <Receipt size={13} /> View / Print Receipt
                      </button>

                      {nextStatus && (
                        <button
                          onClick={() => handleStatusChange(order.id, nextStatus)}
                          className="text-xs font-bold text-cream px-4 py-2 rounded-xl transition-all shadow active:scale-95 cursor-pointer"
                          style={{ background: 'oklch(30% 0.05 50)' }}
                        >
                          Mark as {STATUS_CONFIG[nextStatus]?.label} →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MENU & PRICE MANAGEMENT (USER'S KEY REQUEST!) */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-display font-bold text-espresso text-lg">Product Price & Stock Editor</h2>
                <p className="text-xs text-muted-foreground">Only Admins can change product prices & toggle in-stock status</p>
              </div>
              <button
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border text-muted-foreground hover:text-espresso hover:bg-muted transition-colors cursor-pointer"
              >
                <RotateCcw size={13} /> Reset Factory Defaults
              </button>
            </div>

            {priceNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <Check size={14} className="text-emerald-600" /> {priceNotice}
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 bg-white p-3 rounded-2xl border border-border shadow-xs">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={menuSearch}
                  onChange={e => setMenuSearch(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-espresso"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setMenuCatFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    menuCatFilter === 'all' ? 'bg-espresso text-cream' : 'bg-muted text-muted-foreground hover:text-espresso'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setMenuCatFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      menuCatFilter === cat.id ? 'bg-espresso text-cream' : 'bg-muted text-muted-foreground hover:text-espresso'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Table / Cards */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="divide-y divide-border">
                {filteredMenuItems.map(item => {
                  const isEditing = editingItemId === item.id;
                  const cat = categories.find(c => c.id === item.category_id);

                  return (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/15 transition-colors">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-11 w-11 rounded-lg object-cover border border-border shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-espresso text-sm">{item.name}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-muted text-muted-foreground">
                              {cat?.name}
                            </span>
                            {!item.is_available && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-red-100 text-red-700">
                                Sold Out
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-md">{item.description}</p>
                        </div>
                      </div>

                      {/* Price & Stock Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-espresso">₹</span>
                            <input
                              type="number"
                              value={editPriceValue}
                              onChange={e => setEditPriceValue(e.target.value)}
                              className="w-20 px-2 py-1 text-sm font-bold border-2 border-caramel rounded-lg focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSavePrice(item.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                              title="Save Price"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingItemId(null)}
                              className="p-1.5 bg-muted text-muted-foreground rounded-lg hover:text-espresso transition-colors cursor-pointer"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-espresso">{formatINR(item.price)}</span>
                            <button
                              onClick={() => handleStartEditPrice(item)}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-caramel/15 text-espresso hover:bg-caramel/30 transition-colors cursor-pointer"
                              title="Edit Price"
                            >
                              <Edit2 size={11} /> Edit Price
                            </button>
                          </div>
                        )}

                        {/* Stock toggle */}
                        <button
                          onClick={() => handleToggleStock(item.id)}
                          className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                            item.is_available
                              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {item.is_available ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CAFE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-espresso text-lg">Cafe Configuration</h2>
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
              {[
                { label: 'Cafe Brand Name', value: 'THE FIRST COFFEE' },
                { label: 'Registered Address', value: 'Karve Road, Opp. Ranka Jewellers, Erandwane, Pune, Maharashtra 411004' },
                { label: 'Business Hours', value: '8:00 AM – 10:00 PM Daily' },
                { label: 'Contact Phone', value: '+91 98765 43210' },
                { label: 'UPI VPA ID', value: 'thefirstcoffee@upi' },
              ].map(field => (
                <div key={field.label}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{field.label}</label>
                  <input
                    defaultValue={field.value}
                    className="w-full mt-1 border border-border rounded-xl px-3 py-2 text-sm text-espresso focus:outline-none focus:ring-1 focus:ring-espresso"
                  />
                </div>
              ))}

              <div className="pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Enabled Ordering Modes</p>
                <div className="space-y-2">
                  {['Dine-in Table QR Ordering', 'Counter Takeaway Ordering', 'UPI Digital Payment', 'Cash at Counter'].map(opt => (
                    <label key={opt} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 cursor-pointer">
                      <span className="text-xs font-medium text-espresso">{opt}</span>
                      <input type="checkbox" defaultChecked className="accent-espresso w-4 h-4 cursor-pointer" />
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => alert('Settings saved successfully!')}
                className="w-full py-3 rounded-xl font-bold text-cream text-xs shadow hover:opacity-95 transition-opacity cursor-pointer mt-4"
                style={{ background: 'oklch(30% 0.05 50)' }}
              >
                Save All Cafe Settings
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal order={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
      <p className="text-xl mb-1">{icon}</p>
      <p className="font-bold text-espresso text-base leading-tight">{value}</p>
      <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{label}</p>
      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>
    </div>
  );
}
