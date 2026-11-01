import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/utils';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ChevronDown, CheckCircle } from 'lucide-react';
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
  const [orderNumber, setOrderNumber] = useState('');

  const gst = Math.round(total * 0.05);
  const grandTotal = total + gst;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1500));
    const num = `TFC-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderNumber(num);
    // Save to localStorage for Orders page
    const savedOrders = JSON.parse(localStorage.getItem('tfc_orders') || '[]');
    savedOrders.unshift({
      id: num,
      order_number: num,
      items: items.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
      total: grandTotal,
      order_type: orderType,
      payment_method: paymentMethod,
      status: 'received',
      customer_name: customerName,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('tfc_orders', JSON.stringify(savedOrders));
    clearCart();
    setPlacing(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'oklch(97% 0.012 85)' }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-border">
          <div className="flex justify-center mb-5">
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'oklch(93% 0.05 145)' }}>
              <CheckCircle size={48} style={{ color: 'oklch(50% 0.18 145)' }} />
            </div>
          </div>
          <h2 className="font-display font-bold text-3xl text-espresso mb-2">Order Placed! 🎉</h2>
          <p className="text-muted-foreground mb-6">Your order has been received. We'll start preparing it shortly.</p>
          <div className="rounded-2xl p-5 mb-6" style={{ background: 'oklch(95% 0.015 80)' }}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Order Number</p>
            <p className="font-display font-bold text-espresso text-3xl mt-1">{orderNumber}</p>
            <p className="text-xs text-muted-foreground mt-2 capitalize">{orderType.replace('_', ' ')} · {paymentMethod.toUpperCase()} · {formatINR(grandTotal)}</p>
          </div>

          {/* Bill Summary */}
          <div className="text-left mb-6 space-y-2">
            <p className="font-semibold text-espresso text-sm mb-3">Bill Summary</p>
            <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>{formatINR(total)}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>GST (5%)</span><span>{formatINR(gst)}</span></div>
            <div className="flex justify-between font-bold text-espresso border-t border-border pt-2"><span>Total Paid</span><span>{formatINR(grandTotal)}</span></div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">Show this order number at the counter or wait at your table ☕</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => { setStep('cart'); navigate('orders'); }} className="w-full py-3 rounded-2xl font-bold text-cream" style={{ background: 'oklch(30% 0.05 50)' }}>
              View My Orders
            </button>
            <button onClick={() => { setStep('cart'); navigate('menu'); }} className="w-full py-3 rounded-2xl font-semibold text-espresso border border-border hover:bg-muted transition-colors">
              Order More
            </button>
          </div>
        </div>
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
            <button onClick={() => navigate('menu')} className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-cream" style={{ background: 'oklch(30% 0.05 50)' }}>
              Explore Menu <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_340px]">
            {/* Left: Steps */}
            <div className="space-y-4">
              {/* STEP 1: Cart Items */}
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <h2 className="font-semibold text-espresso mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-cream" style={{ background: 'oklch(30% 0.05 50)' }}>1</span>
                  Review Items
                </h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                      <div className="flex-1">
                        <p className="font-semibold text-espresso text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{formatINR(item.price)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full flex items-center justify-center text-cream hover:opacity-90 transition-opacity" style={{ background: 'oklch(30% 0.05 50)' }}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-bold text-espresso text-sm w-16 text-right">{formatINR(item.price * item.quantity)}</p>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors ml-1">
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
                          className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${orderType === type ? 'border-transparent text-cream' : 'border-border text-muted-foreground hover:border-espresso/30'}`}
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
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Phone</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-caramel/40" />
                    </div>
                  </div>
                  {orderType === 'dine_in' && (
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Table Number</label>
                      <input value={tableNo} onChange={e => setTableNo(e.target.value)} placeholder="e.g. T-05" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-caramel/40" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Special Instructions (optional)</label>
                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="No sugar, extra hot, etc..." rows={2} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-caramel/40" />
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
                    { id: 'cash', label: '💵 Cash', sub: 'Pay at counter / delivery' },
                  ] as const).map(method => (
                    <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === method.id ? 'border-caramel' : 'border-border hover:border-espresso/30'}`}
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
                  className="w-full mt-5 py-4 rounded-2xl font-bold text-cream text-base flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, oklch(30% 0.05 50), oklch(36% 0.07 48))' }}
                >
                  {placing ? (
                    <><span className="animate-spin w-5 h-5 border-2 border-cream border-t-transparent rounded-full" /> Processing...</>
                  ) : (
                    <>Place Order · {formatINR(grandTotal)} <ArrowRight size={16} /></>
                  )}
                </button>
                <p className="text-xs text-center text-muted-foreground mt-2">Your order will be confirmed instantly</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
