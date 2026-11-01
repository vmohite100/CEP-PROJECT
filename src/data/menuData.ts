export const MENU_DATA = {
  categories: [
    { id: '1', name: 'Coffee', emoji: '☕', description: 'Freshly brewed specialty coffee' },
    { id: '2', name: 'Frappuccinos', emoji: '🧊', description: 'Blended iced coffee drinks' },
    { id: '3', name: 'Shakes', emoji: '🥤', description: 'Thick & creamy milkshakes' },
    { id: '4', name: 'Mocktails', emoji: '🍹', description: 'Refreshing non-alcoholic drinks' },
    { id: '5', name: 'Sandwiches', emoji: '🥪', description: 'Grilled & toasted sandwiches' },
  ],
  items: [
    { id: 'c1', category_id: '1', name: 'Espresso', price: 120, description: 'Rich & bold single shot of pure coffee bliss', is_popular: false, is_available: true },
    { id: 'c2', category_id: '1', name: 'Cappuccino', price: 160, description: 'Espresso with perfectly steamed milk foam', is_popular: true, is_available: true },
    { id: 'c3', category_id: '1', name: 'Flat White', price: 180, description: 'Velvety micro-foam over a double ristretto', is_popular: true, is_available: true },
    { id: 'c4', category_id: '1', name: 'Cold Brew', price: 200, description: '12-hour slow-steeped cold drip coffee', is_popular: false, is_available: true },
    { id: 'c5', category_id: '1', name: 'Latte', price: 170, description: 'Smooth espresso with steamed whole milk', is_popular: true, is_available: true },
    { id: 'c6', category_id: '1', name: 'Americano', price: 140, description: 'Espresso diluted with hot water', is_popular: false, is_available: true },
    { id: 'f1', category_id: '2', name: 'Mocha Frappuccino', price: 220, description: 'Chocolate & coffee blended with ice cream', is_popular: true, is_available: true },
    { id: 'f2', category_id: '2', name: 'Caramel Frappuccino', price: 220, description: 'Sweet caramel blended coffee with cream', is_popular: false, is_available: true },
    { id: 'f3', category_id: '2', name: 'Vanilla Bean', price: 210, description: 'Creamy vanilla bean blended delight', is_popular: false, is_available: true },
    { id: 'f4', category_id: '2', name: 'Hazelnut Frappuccino', price: 230, description: 'Rich hazelnut & espresso blended cold', is_popular: true, is_available: true },
    { id: 's1', category_id: '3', name: 'Oreo Shake', price: 200, description: 'Blended Oreo cookies with vanilla ice cream', is_popular: true, is_available: true },
    { id: 's2', category_id: '3', name: 'Strawberry Shake', price: 190, description: 'Fresh strawberries blended with cold milk', is_popular: false, is_available: true },
    { id: 's3', category_id: '3', name: 'Nutella Shake', price: 210, description: 'Rich Nutella hazelnut chocolate shake', is_popular: true, is_available: true },
    { id: 's4', category_id: '3', name: 'Mango Shake', price: 180, description: 'Alphonso mango blended with fresh cream', is_popular: false, is_available: true },
    { id: 'm1', category_id: '4', name: 'Blue Lagoon', price: 180, description: 'Blue curacao syrup with lemon & soda', is_popular: false, is_available: true },
    { id: 'm2', category_id: '4', name: 'Virgin Mojito', price: 160, description: 'Fresh mint, lime, sugar & sparkling soda', is_popular: true, is_available: true },
    { id: 'm3', category_id: '4', name: 'Watermelon Cooler', price: 170, description: 'Fresh watermelon with mint & basil seeds', is_popular: false, is_available: true },
    { id: 'm4', category_id: '4', name: 'Passion Fruit Fizz', price: 190, description: 'Passion fruit syrup with sparkling water', is_popular: true, is_available: true },
    { id: 'g1', category_id: '5', name: 'Classic Veg Grilled', price: 140, description: 'Cheese, fresh veggies on toasted sourdough', is_popular: false, is_available: true },
    { id: 'g2', category_id: '5', name: 'Paneer Tikka Sandwich', price: 170, description: 'Smoky paneer tikka with mint chutney', is_popular: true, is_available: true },
    { id: 'g3', category_id: '5', name: 'Club Sandwich', price: 190, description: 'Triple-layered veggie club with mustard', is_popular: false, is_available: true },
    { id: 'g4', category_id: '5', name: 'Corn & Cheese Toast', price: 150, description: 'Sweet corn with cheddar on thick toast', is_popular: true, is_available: true },
  ]
};

export type MenuItem = typeof MENU_DATA.items[0];
export type Category = typeof MENU_DATA.categories[0];
