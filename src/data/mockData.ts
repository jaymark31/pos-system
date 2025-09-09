// Mock data for Group 1 Supermarket POS System

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  employeeId: string;
  shift: string;
  permissions: string[];
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  supplier: string;
  description: string;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  totalPurchases: number;
  lastVisit: string;
}

export interface Transaction {
  id: string;
  customerId?: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  cashierId: string;
  timestamp: string;
  status: 'completed' | 'refunded' | 'voided';
}

export interface TransactionItem {
  productId: string;
  quantity: number;
  price: number;
  discount?: number;
}

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@gmail.com',
    password: 'admin@gmail.com',
    name: 'System Administrator',
    role: 'admin',
    employeeId: 'ADM001',
    shift: 'Full-time',
    permissions: ['all']
  },
  {
    id: '2',
    email: 'manager@group1.com',
    password: 'manager123',
    name: 'Store Manager',
    role: 'manager',
    employeeId: 'MGR001',
    shift: 'Day Shift',
    permissions: ['inventory', 'employees', 'reports', 'sales']
  },
  {
    id: '3',
    email: 'cashier@group1.com',
    password: 'cashier123',
    name: 'John Cashier',
    role: 'employee',
    employeeId: 'EMP001',
    shift: 'Morning Shift',
    permissions: ['sales', 'returns']
  }
];

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: '1',
    barcode: '1234567890123',
    name: 'Bread - Whole Wheat',
    category: 'Bakery',
    price: 2.99,
    stock: 45,
    lowStockThreshold: 10,
    supplier: 'Fresh Bakery Co.',
    description: 'Fresh whole wheat bread'
  },
  {
    id: '2',
    barcode: '2345678901234',
    name: 'Milk - 2% 1 Gallon',
    category: 'Dairy',
    price: 3.49,
    stock: 23,
    lowStockThreshold: 15,
    supplier: 'Dairy Farm Ltd.',
    description: '2% reduced fat milk, 1 gallon'
  },
  {
    id: '3',
    barcode: '3456789012345',
    name: 'Bananas - Organic',
    category: 'Produce',
    price: 1.29,
    stock: 67,
    lowStockThreshold: 20,
    supplier: 'Fresh Fruits Inc.',
    description: 'Organic bananas per pound'
  },
  {
    id: '4',
    barcode: '4567890123456',
    name: 'Ground Beef - 80/20',
    category: 'Meat',
    price: 5.99,
    stock: 12,
    lowStockThreshold: 8,
    supplier: 'Premium Meats Co.',
    description: '80/20 ground beef per pound'
  },
  {
    id: '5',
    barcode: '5678901234567',
    name: 'Coca Cola - 12 Pack',
    category: 'Beverages',
    price: 4.99,
    stock: 34,
    lowStockThreshold: 12,
    supplier: 'Beverage Distributors',
    description: '12 pack of Coca Cola cans'
  },
  {
    id: '6',
    barcode: '6789012345678',
    name: 'Tide Detergent - 50oz',
    category: 'Household',
    price: 12.99,
    stock: 18,
    lowStockThreshold: 5,
    supplier: 'Home Goods Supply',
    description: 'Tide liquid laundry detergent 50oz'
  },
  {
    id: '7',
    barcode: '7890123456789',
    name: 'Apple iPhone Charger',
    category: 'Electronics',
    price: 19.99,
    stock: 8,
    lowStockThreshold: 3,
    supplier: 'Tech Accessories Ltd.',
    description: 'Lightning to USB cable for iPhone'
  },
  {
    id: '8',
    barcode: '8901234567890',
    name: 'Frozen Pizza - Pepperoni',
    category: 'Frozen',
    price: 6.49,
    stock: 25,
    lowStockThreshold: 10,
    supplier: 'Frozen Foods Co.',
    description: 'Frozen pepperoni pizza'
  }
];

// Mock Customers Data
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    loyaltyPoints: 2450,
    totalPurchases: 1245.67,
    lastVisit: '2024-01-15'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '(555) 234-5678',
    loyaltyPoints: 890,
    totalPurchases: 567.89,
    lastVisit: '2024-01-14'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 345-6789',
    loyaltyPoints: 1340,
    totalPurchases: 890.45,
    lastVisit: '2024-01-13'
  }
];

// Mock Transactions Data
export const mockTransactions: Transaction[] = [
  {
    id: 'TXN001',
    customerId: '1',
    items: [
      { productId: '1', quantity: 2, price: 2.99 },
      { productId: '2', quantity: 1, price: 3.49 }
    ],
    subtotal: 9.47,
    tax: 0.76,
    discount: 0,
    total: 10.23,
    paymentMethod: 'Credit Card',
    cashierId: '3',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'completed'
  },
  {
    id: 'TXN002',
    customerId: '2',
    items: [
      { productId: '5', quantity: 3, price: 4.99 },
      { productId: '3', quantity: 2, price: 1.29 }
    ],
    subtotal: 17.55,
    tax: 1.40,
    discount: 1.50,
    total: 17.45,
    paymentMethod: 'Cash',
    cashierId: '3',
    timestamp: '2024-01-15T11:15:00Z',
    status: 'completed'
  }
];

// Categories
export const categories = [
  'Bakery',
  'Dairy',
  'Produce',
  'Meat',
  'Beverages', 
  'Household',
  'Electronics',
  'Frozen',
  'Snacks',
  'Health & Beauty'
];

// Sales data for analytics
export const salesData = [
  { date: '2024-01-01', sales: 2400, transactions: 45 },
  { date: '2024-01-02', sales: 1398, transactions: 32 },
  { date: '2024-01-03', sales: 9800, transactions: 67 },
  { date: '2024-01-04', sales: 3908, transactions: 54 },
  { date: '2024-01-05', sales: 4800, transactions: 61 },
  { date: '2024-01-06', sales: 3800, transactions: 48 },
  { date: '2024-01-07', sales: 4300, transactions: 52 }
];