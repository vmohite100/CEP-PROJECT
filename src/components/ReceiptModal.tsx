import React from 'react';
import { formatINR } from '../lib/utils';
import { Printer, X, CheckCircle, Coffee } from 'lucide-react';
import type { CafeOrder } from '../lib/orderService';

interface ReceiptModalProps {
  order: CafeOrder | null;
  onClose: () => void;
}

export default function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.created_at).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Top actions bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-muted/40 border-b border-border print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-600" /> Official Cafe Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-espresso text-cream text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              title="Print Receipt"
            >
              <Printer size={13} /> Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-espresso transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 md:p-8 text-espresso font-mono text-sm leading-relaxed receipt-content">
          {/* Cafe Header */}
          <div className="text-center pb-4 border-b border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-espresso text-cream mb-2 mx-auto">
              <Coffee size={20} />
            </div>
            <h2 className="font-display font-bold text-xl tracking-wider text-espresso">THE FIRST COFFEE</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Specialty Brews & Fresh Bites</p>
            <p className="text-[11px] text-muted-foreground mt-1">Karve Road, Opp. Ranka Jewellers, Erandwane, Pune - 411004</p>
            <p className="text-[11px] text-muted-foreground">GSTIN: 27AABCT9876F1Z5 · Ph: +91 98765 43210</p>
          </div>

          {/* Order Details Header */}
          <div className="py-3 border-b border-dashed border-gray-300 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Receipt No:</span>
              <span className="font-bold text-espresso">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Type:</span>
              <span className="capitalize font-semibold">
                {order.order_type.replace('_', ' ')} {order.table_no ? `(Table ${order.table_no})` : ''}
              </span>
            </div>
            {order.customer_name && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{order.customer_name}</span>
              </div>
            )}
            {order.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact:</span>
                <span>{order.phone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Mode:</span>
              <span className="uppercase font-bold text-emerald-700">{order.payment_method} · PAID</span>
            </div>
          </div>

          {/* Itemized List */}
          <div className="py-4 border-b border-dashed border-gray-300">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase pb-2 mb-2 border-b border-gray-200">
              <span>Item</span>
              <span>Qty × Rate</span>
              <span>Amount</span>
            </div>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <span className="font-medium max-w-[170px] text-espresso">{item.name}</span>
                  <span className="text-muted-foreground">{item.qty} × {formatINR(item.price)}</span>
                  <span className="font-semibold text-espresso">{formatINR(item.qty * item.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="py-3 border-b border-dashed border-gray-300 space-y-1 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span>{formatINR(order.subtotal || Math.round(order.total / 1.05))}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST (5% CGST + SGST):</span>
              <span>{formatINR(order.gst || Math.round(order.total - order.total / 1.05))}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-espresso pt-2 border-t border-gray-200">
              <span>TOTAL PAID:</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-4 text-[11px] text-muted-foreground">
            <p className="font-semibold text-espresso">Thank you for visiting THE FIRST COFFEE!</p>
            <p className="mt-0.5">Please show this receipt or order number at the counter ☕</p>
          </div>
        </div>

        {/* Bottom Close Button (Screen only) */}
        <div className="p-4 bg-muted/20 border-t border-border flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-espresso text-cream text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer size={14} /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-espresso text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

