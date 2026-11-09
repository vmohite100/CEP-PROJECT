import { useEffect, useState } from 'react';
import { formatINR } from '../lib/utils';
import { ClipboardList, Clock, Receipt, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { getOrders, subscribeToOrders, type CafeOrder } from '../lib/orderService';
import ReceiptModal from '../components/ReceiptModal';

const STATUS_STEPS: Array<{ key: CafeOrder['status']; label: string; desc: string }> = [
  { key: 'received', label: 'Received', desc: 'Order sent to counter' },
  { key: 'accepted', label: 'Accepted', desc: 'Barista confirmed order' },
  { key: 'preparing', label: 'Preparing', desc: 'Crafting your brew' },
  { key: 'ready', label: 'Ready', desc: 'Ready for table / pickup' },
  { key: 'completed', label: 'Completed', desc: 'Order fulfilled' },
];

const STATUS_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  received:   { label: '🔔 Received',   color: 'oklch(40% 0.18 240)', bg: 'oklch(93% 0.05 240)' },
  accepted:   { label: '✅ Accepted',   color: 'oklch(40% 0.18 270)', bg: 'oklch(93% 0.05 270)' },
  preparing:  { label: '👨‍🍳 Preparing', color: 'oklch(50% 0.18 60)',  bg: 'oklch(95% 0.05 60)'  },
  ready:      { label: '🛎️ Ready',      color: 'oklch(45% 0.18 145)', bg: 'oklch(93% 0.05 145)' },
  completed:  { label: '✔️ Completed',  color: 'oklch(45% 0.04 60)',  bg: 'oklch(94% 0.02 75)'  },
  cancelled:  { label: '❌ Cancelled',  color: 'oklch(45% 0.2 27)',   bg: 'oklch(95% 0.05 27)'  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<CafeOrder[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<CafeOrder | null>(null);

  useEffect(() => {
    setOrders(getOrders());
    const unsubscribe = subscribeToOrders(latest => {
      setOrders(latest);
    });
    return unsubscribe;
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const getStepIndex = (status: CafeOrder['status']) => {
    return STATUS_STEPS.findIndex(s => s.key === status);
  };

  return (
    <div>
      {/* Header */}
      <div className="py-12 text-center" style={{ background: 'linear-gradient(135deg, oklch(22% 0.04 50), oklch(30% 0.06 48))' }}>
        <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-2">Live Order Status</p>
        <h1 className="font-display text-4xl font-bold text-cream mb-2">My Orders</h1>
        <p className="text-cream/60 text-sm">Track your live order preparation & download receipts</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <ClipboardList size={60} className="mx-auto mb-4 text-muted-foreground opacity-30" />
            <h2 className="font-display text-2xl font-bold text-espresso mb-2">No orders placed yet</h2>
            <p className="text-muted-foreground">When you order from the menu or scan a table QR, your order will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{orders.length} order{orders.length > 1 ? 's' : ''} on record</span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live updates active
              </span>
            </div>

            {orders.map(order => {
              const cfg = STATUS_BADGES[order.status] || STATUS_BADGES['received'];
              const isExpanded = expanded === order.id;
              const currentStep = getStepIndex(order.status);

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden transition-all">
                  {/* Order summary bar */}
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-espresso font-display text-lg">{order.order_number}</p>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold" style={{ color: cfg.color, background: cfg.bg }}>
                            {cfg.label}
                          </span>
                        </div>
                        {order.customer_name && (
                          <p className="text-xs text-muted-foreground mt-1">
                            👤 {order.customer_name} {order.table_no ? `· Table ${order.table_no}` : `· ${order.order_type.replace('_', ' ')}`}
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {formatDate(order.created_at)}
                        </p>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="font-bold text-espresso text-base">{formatINR(order.total)}</p>
                        <button
                          onClick={() => setSelectedReceipt(order)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-caramel/15 text-espresso hover:bg-caramel/30 transition-colors cursor-pointer"
                        >
                          <Receipt size={12} /> Receipt
                        </button>
                      </div>
                    </div>

                    {/* LIVE TRACKING STEPPER */}
                    {order.status !== 'cancelled' && (
                      <div className="mt-5 pt-4 border-t border-border/60">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Live Progress Tracker</p>
                        <div className="grid grid-cols-5 gap-1 relative">
                          {STATUS_STEPS.map((step, idx) => {
                            const isDone = currentStep >= idx;
                            const isCurrent = currentStep === idx;
                            return (
                              <div key={step.key} className="flex flex-col items-center text-center">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1 ${
                                    isCurrent
                                      ? 'ring-4 ring-caramel/30 text-cream font-bold scale-110'
                                      : isDone
                                      ? 'text-cream bg-emerald-600'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                  style={isCurrent ? { background: 'oklch(30% 0.05 50)' } : {}}
                                >
                                  {isDone ? <CheckCircle2 size={14} /> : idx + 1}
                                </div>
                                <span className={`text-[10px] font-semibold leading-tight ${isCurrent ? 'text-espresso font-bold' : isDone ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Expand/Collapse toggle */}
                    <button
                      onClick={() => setExpanded(isExpanded ? null : order.id)}
                      className="w-full mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground hover:text-espresso transition-colors cursor-pointer"
                    >
                      <span>{order.items.length} item{order.items.length > 1 ? 's' : ''} · Click to {isExpanded ? 'hide' : 'view'} items</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Expanded Item list */}
                  {isExpanded && (
                    <div className="border-t border-border px-5 py-4" style={{ background: 'oklch(97% 0.012 85)' }}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Order Items</p>
                      <div className="space-y-1.5 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-espresso font-medium">{item.name} × {item.qty}</span>
                            <span className="font-semibold text-espresso">{formatINR(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between font-bold text-xs text-espresso">
                        <span>Total Paid ({order.payment_method?.toUpperCase()})</span>
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

      {/* Global Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal order={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
}
