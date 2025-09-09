import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Transaction, TransactionItem, mockProducts, mockCustomers } from '@/data/mockData';

interface CartItem extends TransactionItem {
  product: Product;
}

interface POSContextType {
  cart: CartItem[];
  currentCustomer: Customer | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomer: (customer: Customer | null) => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getTax: () => number;
  processTransaction: (paymentMethod: string) => Transaction;
  searchProduct: (query: string) => Product[];
  scanBarcode: (barcode: string) => Product | null;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const usePOS = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, {
          productId: product.id,
          quantity,
          price: product.price,
          product
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCurrentCustomer(null);
  };

  const setCustomer = (customer: Customer | null) => {
    setCurrentCustomer(customer);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getCartSubtotal() * 0.08; // 8% tax
  };

  const getCartTotal = () => {
    return getCartSubtotal() + getTax();
  };

  const processTransaction = (paymentMethod: string): Transaction => {
    const subtotal = getCartSubtotal();
    const tax = getTax();
    const total = getCartTotal();

    const transaction: Transaction = {
      id: `TXN${Date.now()}`,
      customerId: currentCustomer?.id,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod,
      cashierId: '3', // Current user ID
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    // Update product stock
    cart.forEach(cartItem => {
      const productIndex = mockProducts.findIndex(p => p.id === cartItem.productId);
      if (productIndex !== -1) {
        mockProducts[productIndex].stock -= cartItem.quantity;
      }
    });

    clearCart();
    return transaction;
  };

  const searchProduct = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.barcode.includes(query) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const scanBarcode = (barcode: string): Product | null => {
    return mockProducts.find(product => product.barcode === barcode) || null;
  };

  const value = {
    cart,
    currentCustomer,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCustomer,
    getCartTotal,
    getCartSubtotal,
    getTax,
    processTransaction,
    searchProduct,
    scanBarcode
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
};