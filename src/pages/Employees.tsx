import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  UserCheck,
  Clock,
  DollarSign,
  Search,
  Plus,
  Edit3
} from 'lucide-react';
import { mockUsers, mockTransactions, salesData } from '@/data/mockData';

const Employees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEmployees = mockUsers.length;
  const activeEmployees = mockUsers.filter(u => u.role !== 'admin').length;
  const todayRevenue = salesData[salesData.length - 1]?.sales || 0;
  const avgSalesPerEmployee = todayRevenue / activeEmployees;

  const employeeStats = [
    {
      title: 'Total Employees',
      value: totalEmployees.toString(),
      description: 'All system users',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Active Today',
      value: activeEmployees.toString(),
      description: 'Currently on duty',
      icon: UserCheck,
      color: 'text-success'
    },
    {
      title: 'Average Performance',
      value: `₱${avgSalesPerEmployee.toFixed(0)}`,
      description: 'Sales per employee',
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      title: 'Total Hours Today',
      value: `${activeEmployees * 8}h`,
      description: 'Combined work hours',
      icon: Clock,
      color: 'text-muted-foreground'
    }
  ];

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getUserSales = (userId: string) => {
    const userTransactions = mockTransactions.filter(t => t.cashierId === userId);
    return userTransactions.reduce((sum, t) => sum + t.total, 0);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'employee':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employee Management</h1>
            <p className="text-muted-foreground">
              Manage staff and track performance
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
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

        {/* Search */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Employees</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Today's Sales</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => {
                  const todaySales = getUserSales(employee.id);
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getUserInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{employee.employeeId}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleColor(employee.role)} className="capitalize">
                          {employee.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.shift}</TableCell>
                      <TableCell>${todaySales.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-success border-success">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Top Performers Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers
                  .filter(u => u.role === 'employee')
                  .sort((a, b) => getUserSales(b.id) - getUserSales(a.id))
                  .slice(0, 3)
                  .map((employee, index) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          'bg-amber-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₱{getUserSales(employee.id).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">sales today</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-success">{activeEmployees}</p>
                    <p className="text-sm text-muted-foreground">Present</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Absent</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Morning Shift (8AM-4PM)</span>
                    <span className="font-medium">2 employees</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Evening Shift (4PM-12AM)</span>
                    <span className="font-medium">1 employee</span>
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

export default Employees;