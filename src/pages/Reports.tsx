import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  BarChart3,
  Download,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Package
} from 'lucide-react';
import { salesData, mockProducts, mockTransactions, mockCustomers } from '@/data/mockData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Calculate metrics
  const totalRevenue = mockTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = mockTransactions.length;
  const avgTransaction = totalRevenue / totalTransactions;
  const topProducts = mockProducts
    .map(product => ({
      ...product,
      sold: mockTransactions.reduce((sum, t) =>
        sum + (t.items.find(item => item.productId === product.id)?.quantity || 0), 0
      )
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // Category sales data for pie chart
  const categoryData = mockProducts.reduce((acc, product) => {
    const sold = mockTransactions.reduce((sum, t) =>
      sum + (t.items.find(item => item.productId === product.id)?.quantity || 0), 0
    );
    acc[product.category] = (acc[product.category] || 0) + (sold * product.price);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, sales]) => ({
    name: category,
    value: sales
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  const reportStats = [
    {
      title: 'Total Revenue',
      value: `₱${totalRevenue.toFixed(2)}`,
      description: 'All time sales',
      icon: DollarSign,
      color: 'text-success'
    },
    {
      title: 'Transactions',
      value: totalTransactions.toString(),
      description: 'Total completed',
      icon: ShoppingCart,
      color: 'text-primary'
    },
    {
      title: 'Avg Transaction',
      value: `₱${avgTransaction.toFixed(2)}`,
      description: 'Per sale value',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      title: 'Active Customers',
      value: mockCustomers.length.toString(),
      description: 'Registered users',
      icon: Users,
      color: 'text-muted-foreground'
    }
  ];

  // Export PDF function
  const handleExportPDF = async () => {
    const element = document.querySelector("#report-content") as HTMLElement;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("report.pdf");
  };

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ["ID", "Items", "Payment", "Total"];
    const rows = mockTransactions.map(t => [
      t.id,
      t.items.length,
      t.paymentMethod,
      `₱${t.total.toFixed(2)}`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" id="report-content">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Business insights and performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportStats.map((stat, index) => (
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Sales Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₱${Number(value).toFixed(2)}`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Top Selling Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-amber-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.sold} sold</p>
                      <p className="text-sm text-muted-foreground">₱{(product.sold * product.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.slice(0, 8).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                      <TableCell>{transaction.items.length}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {transaction.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">₱{transaction.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-success">{salesData.length}</div>
                <p className="text-sm text-muted-foreground">Active Days</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {(salesData.reduce((sum, day) => sum + day.transactions, 0) / salesData.length).toFixed(0)}
                </div>
                <p className="text-sm text-muted-foreground">Avg Transactions/Day</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-warning">
                  ₱{(salesData.reduce((sum, day) => sum + day.sales, 0) / salesData.length).toFixed(0)}
                </div>
                <p className="text-sm text-muted-foreground">Avg Revenue/Day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
