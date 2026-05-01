"use client";

import { useState } from 'react';
import { useInventory } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, PackageSearch, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export default function StockTakingPage() {
  const { ingredients, updateIngredient } = useInventory();
  const [search, setSearch] = useState('');

  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleStockUpdate = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateIngredient(id, { currentStock: numValue });
    }
  };

  const lowStockCount = ingredients.filter(ing => ing.currentStock <= ing.minStock).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Stock Taking</h1>
          <p className="text-muted-foreground">Monitor current pantry levels and identify shortages.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast({ title: "Inventory Report", description: "Exporting stock report to PDF..." })}>
            Export Report
          </Button>
          <Button className="bg-primary">
            <RefreshCw size={18} className="mr-2" />
            Full Audit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Items
              <PackageSearch size={18} className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingredients.length}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Low Stock Alerts
              <AlertTriangle size={18} className="text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Below minimum threshold</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center justify-between">
              Inventory Status
              <CheckCircle2 size={18} className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Math.round(((ingredients.length - lowStockCount) / ingredients.length) * 100)}%
            </div>
            <p className="text-xs text-primary/70 mt-1">Healthy stock ratio</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search for ingredient to update stock..." 
            className="pl-10 h-11 rounded-xl bg-muted/30 border-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead className="text-center">Min Threshold</TableHead>
                <TableHead className="text-center">Unit</TableHead>
                <TableHead className="text-right w-[150px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.map((ing) => {
                const isLow = ing.currentStock <= ing.minStock;
                return (
                  <TableRow key={ing.id} className="hover:bg-accent/5 transition-colors">
                    <TableCell className="font-medium">{ing.name}</TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="number"
                        className="w-20 mx-auto h-8 text-center"
                        value={ing.currentStock}
                        onChange={(e) => handleStockUpdate(ing.id, e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{ing.minStock}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{ing.unit}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isLow ? (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">LOW STOCK</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">IN STOCK</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
