import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/utils';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ChevronDown, CheckCircle, Receipt, Clock } from 'lucide-react';
import { createOrder, type CafeOrder } from '../lib/orderService';
import ReceiptModal from '../components/ReceiptModal';
import type { Page } from '../App';

type Step = 'cart' | 'details' | 'payment' | 'success';

export default function CartPage({ navigate }: { navigate: (page: Page) => void }) {
  const { items, updateQty, removeItem, clearCart, total, count } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [tableNo, setTableNo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash'>('upi');
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<CafeOrder | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const gst = Math.round(total * 0.05);
  const grandTotal = total + gst;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setPlacing(true);
    await new Promise(r => setTimeout(r, 900));

    const num = `TFC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = await createOrder({
      order_number: num,
      items: items.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
      subtotal: total,
      gst: gst,
      total: grandTotal,
      order_type: orderType,
      table_no: orderType === 'dine_in' ? (tableNo.trim() || '01') : undefined,
      payment_method: paymentMethod,
      status: 'received',
      customer_name: customerName.trim() || 'Guest Customer',
      phone: phone.trim() || undefined,
      note: note.trim() || undefined,
    });

    setPlacedOrder(newOrder);
    clearCart();
    setPlacing(false);
    setStep('success');
  };

  if (step === 'success' && placedOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'oklch(97% 0.012 85)' }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-border">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'oklch(93% 0.05 145)' }}>
              <CheckCircle size={42} style={{ color: 'oklch(50% 0.18 145)' }} />
            </div>
          </div>
          <h2 className="font-display font-bold text-3xl text-espresso mb-1">Order Confirmed! 🎉</h2>
          <p className="text-muted-foreground text-sm mb-6">Your order has been sent to our barista counter.</p>

          <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: 'oklch(95% 0.015 80)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Order Number</p>
                <p className="font-display font-bold text-espresso text-2xl mt-0.5">{placedOrder.order_number}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-100 text-blue-800">
                🔔 Received
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground space-y-1">
              <p><span className="font-medium text-espresso">Type:</span> <span className="capitalize">{placedOrder.order_type.replace('_', ' ')}</span> {placedOrder.table_no ? `· Table ${placedOrder.table_no}` : ''}</p>
              <p><span className="font-medium text-espresso">Payment:</span> <span className="uppercase">{placedOrder.payment_method} · {formatINR(placedOrder.total)}</span></p>
              {placedOrder.customer_name && <p><span className="font-medium text-espresso">Name:</span> {placedOrder.customer_name}</p>}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setShowReceipt(true)}
              className="w-full py-3.5 rounded-2xl font-bold text-cream text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity cursor-pointer"
              style={{ background: 'oklch(30% 0.05 50)' }}
            >
              <Receipt size={16} /> View & Print Official Receipt
            </button>
            <button
              onClick={() => { setStep('cart'); navigate('orders'); }}
              className="w-full py-3 rounded-2xl font-bold text-espresso bg-muted/60 hover:bg-muted text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Clock size={16} /> Track Live Order Status
            </button>
            <button
              onClick={() => { setStep('cart'); navigate('menu'); }}
              className="w-full py-2.5 text-xs text-muted-foreground hover:text-espresso font-semibold transition-colors cursor-pointer"
            >
              + Order More Items
            </button>
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceipt && (
          <ReceiptModal order={placedOrder} onClose={() => setShowReceipt(false)} />
        )}
      </div>
    );
  }

  return (
    <div style={{ background: 'oklch(97% 0.012 85)' }} className="min-h-screen">
      {/* Header */}
      <div className="py-10 text-center" style={{ background: 'linear-gradient(135deg, oklch(22% 0.04 50), oklch(30% 0.06 48))' }}>
        <h1 className="font-display text-3xl font-bold text-cream">Your Order</h1>
        <p className="text-cream/60 text-sm mt-1">{count > 0 ? `${count} item${count > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}</p>
      </div>

      {/* Step indicator */}
      {items.length > 0 && (
        <div className="bg-white border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 justify-center text-xs font-semibold">
            {(['cart', 'details', 'payment'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s || (i < ['cart', 'details', 'payment'].indexOf(step)) ? 'text-cream' : 'bg-muted text-muted-foreground'}`}
                  style={step === s || i < ['cart', 'details', 'payment'].indexOf(step) ? { background: 'oklch(30% 0.05 50)' } : {}}>
                  {i + 1}
                </span>
                <span className={step === s ? 'text-espresso' : 'text-muted-foreground capitalize'}>
                  {s === 'cart' ? 'Cart' : s === 'details' ? 'Details' : 'Payment'}
                </span>
                {i < 2 && <ChevronDown size={12} className="text-muted-foreground rotate-[-90deg]" />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag size={60} className="mx-auto mb-4 text-muted-foreground opacity-30" />
            <h2 className="font-display text-2xl font-bold text-espresso mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some delicious items from our menu!</p>
            <button onClick={() => navigate('menu')} className="px-6 py-3 rounded-2xl font-bold text-cream text-sm shadow cursor-pointer" style={{ background: 'oklch(30% 0.05 50)' }}>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left 2 cols */}
            <div className="md:col-span-2 space-y-4">
              {/* STEP 1: Items in Cart */}
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <h2 className="font-semibold text-espresso mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-cream" style={{ background: 'oklch(30% 0.05 50)' }}>1</span>
                  Items in Cart
                </h2>
                <div className="divide-y divide-border">
                  {items.map(item => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-espresso text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{formatINR(item.price)} each</p>
                      </div>
                      <div className="flex items-center gap-2 border border-border rounded-xl px-2 py-1">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="text-muted-foreground hover:text-espresso cursor-pointer"><Minus size={13} /></button>
                        <span className="text-xs font-bold w-4 text-center text-espresso">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="text-muted-foreground hover:text-espresso cursor-pointer"><Plus size={13} /></button>
                      </div>
                      <p className="font-bold text-espresso text-sm w-16 text-right">{formatINR(item.price * item.quantity)}</p>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors ml-1 cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 2: Order Details */}
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <h2 className="font-semibold text-espresso mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-cream" style={{ background: 'oklch(30% 0.05 50)' }}>2</span>
                  Order Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Order Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['dine_in', 'takeaway'] as const).map(type => (
                        <button key={type} onClick={() => setOrderType(type)}
                          className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${orderType === type ? 'border-transparent text-cream' : 'border-border text-muted-foreground hover:border-espresso/30'}`}
                          style={orderType === type ? { background: 'oklch(30% 0.05 50)' } : {}}>
                          {type === 'dine_in' ? '🪑 Dine In' : '🛍️ Takeaway'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Your Name</label>
                      <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Rahul" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-caramel/40" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Phone Number</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 XXXXX" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-caramel/40" />
                    </div>
                  </div>
                  {orderType === 'dine_in' && (
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Table Number</label>
                      <input value={tableNo} onChange={e => setTableNo(e.target.value)} placeholder="e.g. 01, 02, 05" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-caramel/40" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Special Instructions (optional)</label>
                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="No sugar, extra hot, oat milk, etc..." rows={2} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-caramel/40" />
                  </div>
                </div>
              </div>

              {/* STEP 3: Payment */}
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <h2 className="font-semibold text-espresso mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-cream" style={{ background: 'oklch(30% 0.05 50)' }}>3</span>
                  Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { id: 'upi', label: '📱 UPI / QR', sub: 'Google Pay, PhonePe, Paytm' },
                    { id: 'cash', label: '💵 Cash', sub: 'Pay at counter' },
                  ] as const).map(method => (
                    <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${paymentMethod === method.id ? 'border-caramel' : 'border-border hover:border-espresso/30'}`}
                      style={paymentMethod === method.id ? { background: 'oklch(96% 0.04 75)' } : {}}>
                      <p className="font-semibold text-sm text-espresso">{method.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{method.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Bill Summary */}
            <div className="md:sticky md:top-24 h-fit">
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <h2 className="font-semibold text-espresso mb-4">Bill Summary</h2>
                <div className="space-y-2 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                      <span className="text-espresso font-medium">{formatINR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>{formatINR(total)}</span></div>
                  <div className="flex justify-between text-sm text-muted-foreground"><span>GST (5%)</span><span>{formatINR(gst)}</span></div>
                  <div className="flex justify-between font-bold text-espresso text-base pt-1 border-t border-border mt-1"><span>Total</span><span>{formatINR(grandTotal)}</span></div>
                </div>

                <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'oklch(95% 0.015 80)' }}>
                  <div className="flex justify-between text-muted-foreground text-xs mb-1"><span>Order Type</span><span className="capitalize font-medium text-espresso">{orderType.replace('_', ' ')}</span></div>
                  <div className="flex justify-between text-muted-foreground text-xs"><span>Payment</span><span className="font-medium text-espresso uppercase">{paymentMethod}</span></div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full mt-5 py-4 rounded-2xl font-bold text-cream text-base flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all disabled:opacity-70 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, oklch(30% 0.05 50), oklch(36% 0.07 48))' }}
                >
                  {placing ? (
                    <><span className="animate-spin w-5 h-5 border-2 border-cream border-t-transparent rounded-full" /> Confirming Order...</>
                  ) : (
                    <>Place Order · {formatINR(grandTotal)} <ArrowRight size={16} /></>
                  )}
                </button>
                <p className="text-xs text-center text-muted-foreground mt-2">Instant receipt generated after confirmation</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
