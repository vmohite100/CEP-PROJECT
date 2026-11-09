import { supabase } from './supabase';

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface CafeOrder {
  id: string;
  order_number: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  total: number;
  order_type: 'dine_in' | 'takeaway';
  table_no?: string;
  payment_method: 'upi' | 'cash';
  status: 'received' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  customer_name: string;
  phone?: string;
  note?: string;
  created_at: string;
}

const ORDERS_STORAGE_KEY = 'tfc_orders';

const INITIAL_ORDERS: CafeOrder[] = [
  {
    id: 'TFC-1042',
    order_number: 'TFC-1042',
    items: [
      { name: 'Cappuccino', qty: 2, price: 160 },
      { name: 'Paneer Tikka Sandwich', qty: 1, price: 170 },
    ],
    subtotal: 490,
    gst: 25,
    total: 515,
    order_type: 'dine_in',
    table_no: '03',
    payment_method: 'upi',
    status: 'preparing',
    customer_name: 'Priya Sharma',
    phone: '+91 98765 12345',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'TFC-1041',
    order_number: 'TFC-1041',
    items: [{ name: 'Mocha Frappuccino', qty: 1, price: 220 }],
    subtotal: 220,
    gst: 11,
    total: 231,
    order_type: 'takeaway',
    payment_method: 'cash',
    status: 'received',
    customer_name: 'Rahul Joshi',
    phone: '+91 98220 54321',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'TFC-1040',
    order_number: 'TFC-1040',
    items: [
      { name: 'Cold Brew', qty: 1, price: 200 },
      { name: 'Oreo Shake', qty: 1, price: 200 },
    ],
    subtotal: 400,
    gst: 20,
    total: 420,
    order_type: 'dine_in',
    table_no: '01',
    payment_method: 'upi',
    status: 'ready',
    customer_name: 'Amit Deshmukh',
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'TFC-1039',
    order_number: 'TFC-1039',
    items: [{ name: 'Nutella Shake', qty: 1, price: 210 }],
    subtotal: 210,
    gst: 11,
    total: 221,
    order_type: 'dine_in',
    table_no: '05',
    payment_method: 'cash',
    status: 'completed',
    customer_name: 'Sneha Kulkarni',
    created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
  },
];

export function getOrders(): CafeOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get orders from localStorage:', e);
    return INITIAL_ORDERS;
  }
}

export async function createOrder(order: Omit<CafeOrder, 'id' | 'created_at'>): Promise<CafeOrder> {
  const newOrder: CafeOrder = {
    ...order,
    id: order.order_number,
    created_at: new Date().toISOString(),
  };

  const current = getOrders();
  const updated = [newOrder, ...current];
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('tfc_orders_updated'));

  // Attempt Supabase sync asynchronously
  try {
    await supabase.from('orders').insert({
      order_number: newOrder.order_number,
      order_type: newOrder.order_type,
      status: newOrder.status,
      payment_method: newOrder.payment_method,
      payment_status: 'paid',
      subtotal: newOrder.subtotal,
      total: newOrder.total,
      customer_note: newOrder.note || null,
    });
  } catch (err) {
    // Non-blocking fallback
    console.warn('Supabase order sync warning (local order preserved):', err);
  }

  return newOrder;
}

export async function updateOrderStatus(orderId: string, nextStatus: CafeOrder['status']): Promise<boolean> {
  const current = getOrders();
  const updated = current.map(o => (o.id === orderId ? { ...o, status: nextStatus } : o));
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('tfc_orders_updated'));

  // Sync with Supabase if possible
  try {
    await supabase
      .from('orders')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('order_number', orderId);
  } catch (err) {
    console.warn('Supabase status update warning:', err);
  }

  return true;
}

export function subscribeToOrders(callback: (orders: CafeOrder[]) => void): () => void {
  const handler = () => {
    callback(getOrders());
  };
  window.addEventListener('tfc_orders_updated', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('tfc_orders_updated', handler);
    window.removeEventListener('storage', handler);
  };
}
