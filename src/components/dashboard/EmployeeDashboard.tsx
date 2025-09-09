import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart,
  Scan,
  DollarSign,
  Clock,
  RefreshCw,
  CreditCard,
  Receipt,
  Users,
  X
} from 'lucide-react';
import { mockTransactions, salesData } from '@/data/mockData';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [returnItem, setReturnItem] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  const todayTransactions = salesData[salesData.length - 1]?.transactions || 0;
  const todayRevenue = salesData[salesData.length - 1]?.sales || 0;
  const myTransactions = mockTransactions.filter(t => t.cashierId === user?.id);
  const myRevenue = myTransactions.reduce((sum, t) => sum + t.total, 0);

  const employeeStats = [
    {
      title: 'My Sales Today',
      value: `₱${myRevenue.toFixed(2)}`,
      description: 'Your sales contribution',
      icon: DollarSign,
      color: 'text-success'
    },
    {
      title: 'Transactions',
      value: myTransactions.length.toString(),
      description: 'Processed by you',
      icon: ShoppingCart,
      color: 'text-primary'
    },
    {
      title: 'Shift Status',
      value: 'Active',
      description: 'Current work status',
      icon: Clock,
      color: 'text-success'
    },
    {
      title: 'Customer Queue',
      value: '3',
      description: 'Customers waiting',
      icon: Users,
      color: 'text-warning'
    }
  ];

  const quickActions = [
    {
      name: 'New Sale',
      description: 'Start a new transaction',
      icon: ShoppingCart,
      color: 'bg-primary',
      action: () => {
        window.location.href = '/pos';
      }
    },
    {
      name: 'Scan Item',
      description: 'Quick barcode scan',
      icon: Scan,
      color: 'bg-success',
      action: () => {
        window.location.href = '/pos';
      }
    },
    {
      name: 'Process Return',
      description: 'Handle customer return',
      icon: RefreshCw,
      color: 'bg-warning',
      action: () => setIsReturnModalOpen(true)
    },
    {
      name: 'Payment Options',
      description: 'View payment methods',
      icon: CreditCard,
      color: 'bg-secondary',
      action: () => setIsPaymentModalOpen(true)
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employee Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {user?.name} • {user?.shift}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="px-3 py-1">
              {user?.employeeId}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-success border-success">
              On Duty
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {employeeStats.map((stat, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-strong transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common POS operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all duration-200"
                  onClick={action.action}
                >
                  <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{action.name}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Current Session */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span>My Recent Transactions</span>
              </CardTitle>
              <CardDescription>Your latest sales activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.items.length} items • {new Date(transaction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₱{transaction.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{transaction.paymentMethod}</p>
                    </div>
                  </div>
                ))}
                {myTransactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No transactions yet today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Shift Information</span>
              </CardTitle>
              <CardDescription>Current work session details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Shift Start</p>
                  <p className="font-medium">8:00 AM</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Shift End</p>
                  <p className="font-medium">4:00 PM</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Break Time</p>
                  <p className="font-medium">12:00 PM</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Hours Worked</p>
                  <p className="font-medium">6.5 hrs</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Performance Today</span>
                  <Badge variant="outline" className="text-success border-success">
                    Excellent
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sales Target</span>
                    <span>₱500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Sales</span>
                    <span className="font-medium text-success">₱{myRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Achievement</span>
                    <span className="font-medium">{((myRevenue / 500) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Return Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsReturnModalOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Process Return</h2>
            <div className="space-y-3">
              <Input
                placeholder="Item Name / ID"
                value={returnItem}
                onChange={(e) => setReturnItem(e.target.value)}
              />
              <Input
                placeholder="Refund Amount"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
              <Button className="w-full" onClick={() => {
                console.log(`Return processed: ${returnItem}, Refund: ₱${refundAmount}`);
                setReturnItem('');
                setRefundAmount('');
                setIsReturnModalOpen(false);
              }}>
                Confirm Return
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Options Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 relative">
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Payment Options</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full flex justify-between">
                Cash <DollarSign className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full flex justify-between">
                Credit/Debit Card <CreditCard className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full flex justify-between">
                E-Wallet <Scan className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
