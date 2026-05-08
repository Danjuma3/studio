
"use client";

import { useInventory } from '../lib/store';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight,
  ShoppingBag,
  Receipt,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function SalesHistoryPage() {
  const { sales, location } = useInventory();
  const [search, setSearch] = useState('');

  const safeSales = sales || [];

  const filteredSales = safeSales.filter(sale => 
    sale.items?.some(item => item.recipeName.toLowerCase().includes(search.toLowerCase())) ||
    new Date(sale.createdAt).toLocaleDateString().includes(search)
  );

  const totalRevenue = safeSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  const totalItemsSold = safeSales.reduce((sum, sale) => {
    const itemQty = (sale.items || []).reduce((iSum, item) => iSum + (item.quantity || 0), 0);
    return sum + itemQty;
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Sales History</h1>
          <p className="text-muted-foreground">Track your revenue and recipe performance in {location.city}.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="secondary" className="px-4 py-2 h-11 text-sm font-bold bg-primary/10 text-primary border-primary/20">
            Total Revenue: {location.currencySymbol}{totalRevenue.toLocaleString()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Sales</CardTitle>
            <History className="h-4 w-4 text-primary shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{safeSales.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold">Transactions recorded</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Items Sold</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalItemsSold}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold">Plates served</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-primary text-primary-foreground sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider opacity-80">Avg. Ticket</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-80 shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">
              {location.currencySymbol}{safeSales.length > 0 ? Math.round(totalRevenue / safeSales.length).toLocaleString() : 0}
            </div>
            <p className="text-[10px] opacity-70 mt-1 font-bold uppercase">Average value per sale</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="bg-muted/30 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt size={20} className="text-primary shrink-0" />
              Transaction Log
            </CardTitle>
            <CardDescription>A real-time list of all sales synced to the regional hub.</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search recipes or date..." 
              className="pl-9 h-10 rounded-xl bg-white border shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest min-w-[150px]">Date & Time</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest min-w-[200px]">Items</TableHead>
                  <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest min-w-[100px]">Total ({location.currencySymbol})</TableHead>
                  <TableHead className="text-right w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingBag size={48} className="opacity-10 mb-2" />
                        <p className="font-medium">{search ? "No sales match your search." : "No sales recorded yet."}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  [...filteredSales].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-accent/5 transition-colors group">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-muted-foreground shrink-0" />
                          <div className="text-sm font-medium">
                            {new Date(sale.createdAt).toLocaleDateString()}
                            <span className="text-[10px] text-muted-foreground ml-2">
                              {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(sale.items || []).map((item, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] font-bold bg-muted/30">
                              {item.quantity}x {item.recipeName}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-black tabular-nums">
                        {location.currencySymbol}{(sale.totalAmount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors cursor-pointer" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
