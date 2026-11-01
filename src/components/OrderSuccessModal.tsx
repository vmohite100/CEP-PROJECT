import { CheckCircle } from 'lucide-react';

interface OrderSuccessModalProps {
  orderNumber: string;
  onClose: () => void;
}

export default function OrderSuccessModal({ orderNumber, onClose }: OrderSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'oklch(93% 0.05 145)' }}>
            <CheckCircle size={40} style={{ color: 'oklch(55% 0.15 145)' }} />
          </div>
        </div>
        <h2 className="font-display font-bold text-2xl text-espresso mb-2">Order Placed! 🎉</h2>
        <p className="text-muted-foreground mb-4">Your order has been received. We'll start preparing it shortly.</p>
        <div className="bg-muted rounded-2xl px-6 py-4 mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Order Number</p>
          <p className="font-bold text-espresso text-2xl font-display mt-1">{orderNumber}</p>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Show this number at the counter or wait at your table. ☕</p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-cream"
          style={{ background: 'oklch(30% 0.05 50)' }}
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
}
