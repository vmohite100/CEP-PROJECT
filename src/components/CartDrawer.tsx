import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/utils';
import { X, Minus, Plus, ShoppingBag, ChevronRight } from 'lucide-react';
import OrderSuccessModal from './OrderSuccessModal';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQty, removeItem, clearCart, total, count } = useCart();
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('upi');
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setPlacing(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    const num = `TFC-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderNumber(num);
    clearCart();
    setPlacing(false);
    setSuccess(true);
    onClose();
  };

  if (success) {
    return <OrderSuccessModal orderNumber={orderNumber} onClose={() => setSuccess(false)} />;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${open ? 'bg-black/50 backdrop-blur-sm' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} style={{ color: 'oklch(30% 0.05 50)' }} />
              <h2 className="font-display font-bold text-espresso text-lg">Your Order</h2>
              {count > 0 && <span className="bg-caramel/20 text-caramel text-xs px-2 py-0.5 rounded-full font-semibold">{count} items</span>}
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-5xl mb-3">🛒</p>
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm mt-1">Add items from the menu</p>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                      <div className="flex-1">
                        <p className="font-semibold text-espresso text-sm">{item.name}</p>
                        <p className="text-muted-foreground text-xs">{formatINR(item.price)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full text-cream flex items-center justify-center hover:opacity-90 transition-opacity" style={{ background: 'oklch(30% 0.05 50)' }}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-bold text-espresso text-sm w-16 text-right">{formatINR(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Order Type */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Order Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['dine_in', 'takeaway'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          orderType === type ? 'border-transparent text-cream' : 'border-border text-muted-foreground hover:border-espresso/30'
                        }`}
                        style={orderType === type ? { background: 'oklch(30% 0.05 50)' } : {}}
                      >
                        {type === 'dine_in' ? '🪑 Dine In' : '🛍️ Takeaway'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Payment</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['upi', 'cash'] as const).map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          paymentMethod === method ? 'border-transparent text-cream' : 'border-border text-muted-foreground hover:border-espresso/30'
                        }`}
                        style={paymentMethod === method ? { background: 'oklch(72% 0.12 68)', color: 'oklch(25% 0.04 50)' } : {}}
                      >
                        {method === 'upi' ? '📱 UPI' : '💵 Cash'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Note (optional)</p>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Any special instructions..."
                    rows={2}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-caramel/50 text-espresso placeholder:text-muted-foreground"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-5 py-4 border-t border-border bg-white rounded-b-3xl">
              <div className="flex justify-between mb-3">
                <span className="text-muted-foreground font-medium">Total</span>
                <span className="font-bold text-espresso text-lg">{formatINR(total)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full py-4 rounded-2xl font-bold text-cream text-base flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, oklch(30% 0.05 50), oklch(36% 0.07 48))' }}
              >
                {placing ? (
                  <span className="animate-spin w-5 h-5 border-2 border-cream border-t-transparent rounded-full" />
                ) : (
                  <>Place Order <ChevronRight size={18} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
