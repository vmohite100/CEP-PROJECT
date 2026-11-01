import { useEffect, useState } from 'react';
import { formatINR } from '../lib/utils';
import { ClipboardList, Clock } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  order_type: string;
  payment_method: string;
  status: string;
  customer_name: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  received:   { label: '🔔 Received',   color: 'oklch(40% 0.18 240)', bg: 'oklch(93% 0.05 240)' },
  accepted:   { label: '✅ Accepted',   color: 'oklch(40% 0.18 270)', bg: 'oklch(93% 0.05 270)' },
  preparing:  { label: '👨‍🍳 Preparing', color: 'oklch(50% 0.18 60)',  bg: 'oklch(95% 0.05 60)'  },
  ready:      { label: '🛎️ Ready',      color: 'oklch(45% 0.18 145)', bg: 'oklch(93% 0.05 145)' },
  completed:  { label: '✔️ Completed',  color: 'oklch(45% 0.04 60)',  bg: 'oklch(94% 0.02 75)'  },
  cancelled:  { label: '❌ Cancelled',  color: 'oklch(45% 0.2 27)',   bg: 'oklch(95% 0.05 27)'  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tfc_orders') || '[]');
    setOrders(saved);
  }, []);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="py-12 text-center" style={{ background: 'linear-gradient(135deg, oklch(22% 0.04 50), oklch(30% 0.06 48))' }}>
        <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-2">Track your orders</p>
        <h1 className="font-display text-4xl font-bold text-cream mb-2">My Orders</h1>
        <p className="text-cream/60 text-sm">View your order history and status</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <ClipboardList size={60} className="mx-auto mb-4 text-muted-foreground opacity-30" />
            <h2 className="font-display text-2xl font-bold text-espresso mb-2">No orders yet</h2>
            <p className="text-muted-foreground">Your orders will appear here after you place them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['received'];
              const isExpanded = expanded === order.id;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                    className="w-full p-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-espresso font-display text-lg">{order.order_number}</p>
                        {order.customer_name && <p className="text-sm text-muted-foreground mt-0.5">👤 {order.customer_name}</p>}
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock size={11} /> {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ color: cfg.color, background: cfg.bg }}>
                          {cfg.label}
                        </span>
                        <p className="font-bold text-espresso">{formatINR(order.total)}</p>
                        <p className="text-xs text-muted-foreground capitalize">{order.order_type?.replace('_', ' ')} · {order.payment_method?.toUpperCase()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 text-left">
                      {order.items.map(i => i.name).join(' · ')}
                    </p>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border px-5 py-4" style={{ background: 'oklch(97% 0.012 85)' }}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Order Details</p>
                      <div className="space-y-1.5 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                            <span className="font-medium text-espresso">{formatINR(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between font-bold text-espresso">
                        <span>Total Paid</span>
                        <span>{formatINR(order.total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
