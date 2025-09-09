import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Building2,
  BarChart3,
  Settings
} from 'lucide-react';
import { mockProducts, mockTransactions, mockUsers, salesData } from '@/data/mockData';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const totalRevenue = mockTransactions.reduce((sum, tx) => sum + tx.total, 0);
  const lowStockProducts = mockProducts.filter(p => p.stock <= p.lowStockThreshold);
  const todaySales = salesData[salesData.length - 1]?.sales || 0;

  const adminStats = [
    {
      title: 'Total Revenue',
      value: `₱${totalRevenue.toFixed(2)}`,
      description: 'All time revenue',
      icon: DollarSign,
      trend: '+12.5%'
    },
    {
      title: 'Active Employees',
      value: mockUsers.length.toString(),
      description: 'System users',
      icon: Users,
      trend: '+2'
    },
    {
      title: 'Products in Stock',
      value: mockProducts.length.toString(),
      description: 'Total inventory items',
      icon: Package,
      trend: `${lowStockProducts.length} low stock`
    },
    {
      title: "Today's Sales",
      value: `₱${todaySales.toFixed(2)}`,
      description: 'Current day revenue',
      icon: TrendingUp,
      trend: '+8.2%'
    }
  ];

  const adminMenuItems = [
    { name: 'System Settings', icon: Settings, count: null },
    { name: 'Employee Management', icon: Users, count: mockUsers.length },
    { name: 'Inventory Overview', icon: Package, count: mockProducts.length },
    { name: 'Financial Reports', icon: BarChart3, count: null },
    { name: 'Store Management', icon: Building2, count: 1 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            Administrator
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-strong transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-success font-medium">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Admin Functions</span>
              </CardTitle>
              <CardDescription>
                System administration and management tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {adminMenuItems.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    {item.count && (
                      <Badge variant="outline" className="text-xs">
                        {item.count}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>System Alerts</span>
              </CardTitle>
              <CardDescription>
                Important notifications and warnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Low Stock Alert</p>
                    <p className="text-xs text-muted-foreground">
                      {lowStockProducts.length} products below threshold
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-success/10 border border-success/20">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sales Performance</p>
                    <p className="text-xs text-muted-foreground">
                      Revenue up 12.5% this month
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 border">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Staff Status</p>
                    <p className="text-xs text-muted-foreground">
                      All employees checked in
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;