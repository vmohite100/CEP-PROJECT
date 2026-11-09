import { MENU_DATA, type MenuItem, type Category } from '../data/menuData';

const MENU_STORAGE_KEY = 'tfc_menu_items_override';

export function getCategories(): Category[] {
  return MENU_DATA.categories;
}

export function getMenuItems(): MenuItem[] {
  try {
    const stored = localStorage.getItem(MENU_STORAGE_KEY);
    if (!stored) return MENU_DATA.items;
    const overrides: Record<string, Partial<MenuItem>> = JSON.parse(stored);
    return MENU_DATA.items.map(item => {
      if (overrides[item.id]) {
        return { ...item, ...overrides[item.id] };
      }
      return item;
    });
  } catch (e) {
    console.error('Failed to parse menu items overrides:', e);
    return MENU_DATA.items;
  }
}

export function updateMenuItemPrice(id: string, newPrice: number): boolean {
  try {
    if (isNaN(newPrice) || newPrice < 0) return false;
    const stored = localStorage.getItem(MENU_STORAGE_KEY);
    const overrides: Record<string, Partial<MenuItem>> = stored ? JSON.parse(stored) : {};
    overrides[id] = { ...(overrides[id] || {}), price: Math.round(newPrice) };
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new Event('tfc_menu_updated'));
    return true;
  } catch (e) {
    console.error('Failed to update menu item price:', e);
    return false;
  }
}

export function toggleMenuItemAvailability(id: string): boolean {
  try {
    const items = getMenuItems();
    const item = items.find(i => i.id === id);
    if (!item) return false;
    const nextAvailability = !item.is_available;
    const stored = localStorage.getItem(MENU_STORAGE_KEY);
    const overrides: Record<string, Partial<MenuItem>> = stored ? JSON.parse(stored) : {};
    overrides[id] = { ...(overrides[id] || {}), is_available: nextAvailability };
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new Event('tfc_menu_updated'));
    return true;
  } catch (e) {
    console.error('Failed to toggle menu item availability:', e);
    return false;
  }
}

export function resetMenuDefaults(): void {
  localStorage.removeItem(MENU_STORAGE_KEY);
  window.dispatchEvent(new Event('tfc_menu_updated'));
}

