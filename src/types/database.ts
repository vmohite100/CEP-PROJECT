export interface Category {
  id: string;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CafeTable {
  id: string;
  table_number: string;
  is_active: boolean;
  created_at: string;
}

export interface CafeSettings {
  cafe_name: string;
  address: string;
  hours: string;
  takeaway_enabled: boolean;
  upi_enabled: boolean;
  cash_enabled: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  table_id: string | null;
  order_type: 'dine_in' | 'takeaway';
  status: 'received' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  payment_method: 'cash' | 'upi' | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  total: number;
  customer_note: string | null;
  inventory_deducted: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  unit_price: number;
  quantity: number;
}
