import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Edit3,
  Gift,
  X,
} from "lucide-react";
import { mockCustomers, mockTransactions } from "@/data/mockData";

const Customers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState(mockCustomers);

  // For editing
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // For gifting
  const [giftingCustomer, setGiftingCustomer] = useState<any | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftPoints, setGiftPoints] = useState(0);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const totalCustomers = customers.length;
  const totalLoyaltyPoints = customers.reduce(
    (sum, c) => sum + c.loyaltyPoints,
    0
  );
  const totalRevenue = customers.reduce(
    (sum, c) => sum + c.totalPurchases,
    0
  );
  const avgPurchase = totalRevenue / totalCustomers;

  const customerStats = [
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      description: "Registered customers",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Loyalty Points",
      value: totalLoyaltyPoints.toString(),
      description: "Total points issued",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Revenue Generated",
      value: `₱${totalRevenue.toFixed(0)}`,
      description: "Total customer purchases",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Average Purchase",
      value: `₱${avgPurchase.toFixed(0)}`,
      description: "Per customer value",
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  const getCustomerInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getCustomerTier = (totalPurchases: number) => {
    if (totalPurchases >= 1000)
      return { tier: "Platinum", color: "bg-purple-500" };
    if (totalPurchases >= 500)
      return { tier: "Gold", color: "bg-yellow-500" };
    if (totalPurchases >= 200)
      return { tier: "Silver", color: "bg-gray-400" };
    return { tier: "Bronze", color: "bg-amber-600" };
  };

  const getCustomerTransactions = (customerId: string) => {
    return mockTransactions.filter((t) => t.customerId === customerId);
  };

  // ---- ACTION HANDLERS ----

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setIsEditModalOpen(true);
  };

  const saveCustomerChanges = () => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === editingCustomer.id ? editingCustomer : c
      )
    );
    setIsEditModalOpen(false);
  };

  const handleGiftCustomer = (customer: any) => {
    setGiftingCustomer(customer);
    setGiftPoints(0);
    setIsGiftModalOpen(true);
  };

  const confirmGift = () => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === giftingCustomer.id
          ? { ...c, loyaltyPoints: c.loyaltyPoints + giftPoints }
          : c
      )
    );
    setIsGiftModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground">
              Manage customer relationships and loyalty program
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {customerStats.map((stat, index) => (
            <Card key={index}>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Customers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Loyalty Points</TableHead>
                  <TableHead>Total Purchases</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const customerTier = getCustomerTier(
                    customer.totalPurchases
                  );
                  const transactions = getCustomerTransactions(
                    customer.id
                  );
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getCustomerInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {customer.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {customer.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${customerTier.color}`}
                          ></div>
                          <span className="text-sm font-medium">
                            {customerTier.tier}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">
                            {customer.loyaltyPoints}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          ₱{customer.totalPurchases.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(
                          customer.lastVisit
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transactions.length}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGiftCustomer(customer)}
                          >
                            <Gift className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ---- EDIT MODAL ---- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Edit Customer</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={editingCustomer.name}
              onChange={(e) =>
                setEditingCustomer({
                  ...editingCustomer,
                  name: e.target.value,
                })
              }
              className="mb-2"
            />
            <Input
              value={editingCustomer.email}
              onChange={(e) =>
                setEditingCustomer({
                  ...editingCustomer,
                  email: e.target.value,
                })
              }
              className="mb-2"
            />
            <Input
              value={editingCustomer.phone}
              onChange={(e) =>
                setEditingCustomer({
                  ...editingCustomer,
                  phone: e.target.value,
                })
              }
              className="mb-4"
            />
            <Button onClick={saveCustomerChanges} className="w-full">
              Save Changes
            </Button>
          </Card>
        </div>
      )}

      {/* ---- GIFT MODAL ---- */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Gift Loyalty Points</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsGiftModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="mb-2">
              Customer: <strong>{giftingCustomer.name}</strong>
            </p>
            <Input
              type="number"
              value={giftPoints}
              onChange={(e) => setGiftPoints(Number(e.target.value))}
              className="mb-4"
              placeholder="Enter points to gift"
            />
            <Button onClick={confirmGift} className="w-full">
              Confirm Gift
            </Button>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Customers;
