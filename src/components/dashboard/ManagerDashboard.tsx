import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart,
  Clock,
  BarChart3
} from 'lucide-react';
import { mockProducts, mockTransactions, mockUsers, salesData } from '@/data/mockData';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();

  const todayRevenue = salesData[salesData.length - 1]?.sales || 0;
  const todayTransactions = salesData[salesData.length - 1]?.transactions || 0;
  const employees = mockUsers.filter(u => u.role === 'employee');
  const lowStockCount = mockProducts.filter(p => p.stock <= p.lowStockThreshold).length;

  const managerStats = [
    {
      title: "Today's Revenue",
      value: `₱${todayRevenue.toFixed(2)}`,
      description: 'Current day sales',
      icon: DollarSign,
      trend: '+8.2%'
    },
    {
      title: 'Transactions',
      value: todayTransactions.toString(),
      description: 'Today\'s transactions',
      icon: ShoppingCart,
      trend: '+15 from yesterday'
    },
    {
      title: 'Staff on Duty',
      value: employees.length.toString(),
      description: 'Active employees',
      icon: Users,
      trend: 'All present'
    },
    {
      title: 'Inventory Alerts',
      value: lowStockCount.toString(),
      description: 'Items need restocking',
      icon: Package,
      trend: lowStockCount > 0 ? 'Action needed' : 'All good'
    }
  ];

  const managerTasks = [
    { task: 'Review daily sales report', priority: 'High', time: '2 hours ago' },
    { task: 'Approve purchase orders', priority: 'Medium', time: '4 hours ago' },
    { task: 'Schedule staff shifts', priority: 'Low', time: '1 day ago' },
    { task: 'Update product prices', priority: 'Medium', time: '2 days ago' }
  ];

  // 🔹 Functions for buttons
  const exportSalesSummaryPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Summary Report', 14, 16);
    (doc as any).autoTable({
      head: [['Date', 'Sales', 'Transactions']],
      body: salesData.map(d => [d.date, `₱${d.sales.toFixed(2)}`, d.transactions]),
    });
    doc.save('sales_summary.pdf');
  };

  const exportInventoryCSV = () => {
    const headers = ['Product', 'Stock', 'Threshold'];
    const rows = mockProducts.map(p => [p.name, p.stock, p.lowStockThreshold]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'inventory_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showStaffPerformance = () => {
    alert('Staff performance report feature coming soon!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            Store Manager
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {managerStats.map((stat, index) => (
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

        {/* Manager Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Quick Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div onClick={exportSalesSummaryPDF} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <span className="text-sm font-medium">Sales Summary</span>
                <Badge variant="outline">Today</Badge>
              </div>
              <div onClick={exportInventoryCSV} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <span className="text-sm font-medium">Inventory Report</span>
                <Badge variant="outline">Live</Badge>
              </div>
              <div onClick={showStaffPerformance} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <span className="text-sm font-medium">Staff Performance</span>
                <Badge variant="outline">Weekly</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Inventory Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <span className="text-sm font-medium">Stock Adjustments</span>
                <Badge variant="outline" className="text-warning">
                  {lowStockCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <span className="text-sm font-medium">Purchase Orders</span>
                <Badge variant="outline">3</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <span className="text-sm font-medium">Receiving</span>
                <Badge variant="outline">2</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pending Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {managerTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.time}</p>
                  </div>
                  <Badge 
                    variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest sales activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Transaction {transaction.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.items.length} items • {transaction.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₱{transaction.total.toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;