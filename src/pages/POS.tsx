import React, { useState } from 'react';
import { usePOS } from '@/contexts/POSContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Scan,
  Search,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Receipt,
  User,
  ShoppingCart
} from 'lucide-react';

const POS: React.FC = () => {
  const {
    cart,
    currentCustomer,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSubtotal,
    getTax,
    getCartTotal,
    processTransaction,
    searchProduct,
    scanBarcode
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchProduct(searchQuery);
      setSearchResults(results);
    }
  };

  const handleBarcodeScan = () => {
    if (barcodeInput.trim()) {
      const product = scanBarcode(barcodeInput);
      if (product) {
        addToCart(product);
        setBarcodeInput('');
        toast({
          title: "Product Added",
          description: `${product.name} added to cart`,
        });
      } else {
        toast({
          title: "Product Not Found",
          description: "No product found with this barcode",
          variant: "destructive",
        });
      }
    }
  };

  const handlePayment = (method: string) => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before payment",
        variant: "destructive",
      });
      return;
    }

    const transaction = processTransaction(method);
    toast({
      title: "Payment Successful",
      description: `Transaction ${transaction.id} completed`,
    });
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Search and Scanner */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scanner */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scan className="h-5 w-5" />
                <span>Barcode Scanner</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Scan or enter barcode..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeScan()}
                  className="flex-1"
                />
                <Button onClick={handleBarcodeScan}>
                  <Scan className="h-4 w-4 mr-2" />
                  Scan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Search */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Product Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Search Results */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category} • ${product.price} • Stock: {product.stock}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shopping Cart */}
        <div className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart ({cart.length})</span>
                </span>
                {cart.length > 0 && (
                  <Button size="sm" variant="outline" onClick={clearCart}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Customer */}
              {currentCustomer && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{currentCustomer.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Loyalty Points: {currentCustomer.loyaltyPoints}
                  </p>
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {cart.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Cart is empty</p>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <Separator className="mb-4" />
                  
                  {/* Totals */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${getCartSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (8%):</span>
                      <span>${getTax().toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => handlePayment('Cash')}
                    >
                      <Banknote className="h-4 w-4 mr-2" />
                      Cash Payment
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handlePayment('Credit Card')}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Card Payment
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default POS;