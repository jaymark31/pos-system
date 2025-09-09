"use client"

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Package,
  Search,
  Plus,
  Edit3,
  AlertTriangle,
  TrendingUp,
  Filter
} from 'lucide-react';
import { mockProducts as initialProducts, categories } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

type Product = {
  id: string;
  name: string;
  barcode: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
};

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const { toast } = useToast();

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Product>>({});

  const handleChange = (field: keyof Product, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name as string,
      barcode: formData.barcode || Math.random().toString(36).substring(7),
      category: (formData.category as string) || "Uncategorized",
      description: formData.description || "",
      price: Number(formData.price),
      stock: Number(formData.stock),
      lowStockThreshold: Number(formData.lowStockThreshold) || 5,
    };

    setProducts([...products, newProduct]);
    setIsAddOpen(false);
    setFormData({});
    toast({ title: "Product Added", description: `${newProduct.name} added successfully` });
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    setProducts(products.map(p => (p.id === editingProduct.id ? { ...editingProduct, ...formData } as Product : p)));
    setIsEditOpen(false);
    setEditingProduct(null);
    setFormData({});
    toast({ title: "Product Updated", description: `Changes saved successfully` });
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    setProducts(products.map(p => p.id === productId ? { ...p, stock: newStock } : p));
    toast({
      title: "Stock Updated",
      description: `Stock level updated successfully`,
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'low' && product.stock <= product.lowStockThreshold) ||
                        (stockFilter === 'out' && product.stock === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const inventoryStats = [
    { title: 'Total Products', value: products.length.toString(), description: 'Items in catalog', icon: Package, color: 'text-primary' },
    { title: 'Low Stock Items', value: lowStockProducts.length.toString(), description: 'Need restocking', icon: AlertTriangle, color: 'text-warning' },
    { title: 'Out of Stock', value: outOfStockProducts.length.toString(), description: 'Items unavailable', icon: AlertTriangle, color: 'text-destructive' },
    { title: 'Inventory Value', value: `₱${totalValue.toFixed(0)}`, description: 'Total stock value', icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Manage products and stock levels</p>
          </div>

          {/* Add Product Button */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Name" onChange={(e) => handleChange("name", e.target.value)} />
                <Input placeholder="Barcode" onChange={(e) => handleChange("barcode", e.target.value)} />
                <Input placeholder="Category" onChange={(e) => handleChange("category", e.target.value)} />
                <Input placeholder="Description" onChange={(e) => handleChange("description", e.target.value)} />
                <Input type="number" placeholder="Price" onChange={(e) => handleChange("price", Number(e.target.value))} />
                <Input type="number" placeholder="Stock" onChange={(e) => handleChange("stock", Number(e.target.value))} />
                <Input type="number" placeholder="Low Stock Threshold" onChange={(e) => handleChange("lowStockThreshold", Number(e.target.value))} />
              </div>
              <DialogFooter>
                <Button onClick={handleAddProduct}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventoryStats.map((stat, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-strong transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Filter className="h-5 w-5" /><span>Filters</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products or barcode..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger><SelectValue placeholder="Stock status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Product Table */}
        <Card className="shadow-elegant">
          <CardHeader><CardTitle>Product Inventory</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.barcode}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₱{product.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Input type="number" value={product.stock} onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)} className="w-20" />
                        <span className="text-sm text-muted-foreground">/ {product.lowStockThreshold} min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock === 0 ? 'destructive' : product.stock <= product.lowStockThreshold ? 'secondary' : 'outline'}>
                        {product.stock === 0 ? 'Out of Stock' : product.stock <= product.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* Edit Product Button */}
                      <Dialog open={isEditOpen && editingProduct?.id === product.id} onOpenChange={(open) => {
                        setIsEditOpen(open);
                        if (open) {
                          setEditingProduct(product);
                          setFormData(product);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline"><Edit3 className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
                          <div className="space-y-3">
                            <Input defaultValue={product.name} onChange={(e) => handleChange("name", e.target.value)} />
                            <Input defaultValue={product.barcode} onChange={(e) => handleChange("barcode", e.target.value)} />
                            <Input defaultValue={product.category} onChange={(e) => handleChange("category", e.target.value)} />
                            <Input defaultValue={product.description} onChange={(e) => handleChange("description", e.target.value)} />
                            <Input type="number" defaultValue={product.price} onChange={(e) => handleChange("price", Number(e.target.value))} />
                            <Input type="number" defaultValue={product.stock} onChange={(e) => handleChange("stock", Number(e.target.value))} />
                            <Input type="number" defaultValue={product.lowStockThreshold} onChange={(e) => handleChange("lowStockThreshold", Number(e.target.value))} />
                          </div>
                          <DialogFooter><Button onClick={handleEditProduct}>Save Changes</Button></DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
