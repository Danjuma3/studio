"use client";

import { useInventory } from './lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  AlertCircle, 
  PackageSearch,
  Calculator,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { ingredients, recipes } = useInventory();

  const lowStockCount = ingredients.filter(ing => ing.currentStock <= ing.minStock).length;
  const highCostRecipes = recipes.filter(r => {
    const cost = r.items.reduce((sum, item) => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      return sum + (ing ? ing.bulkPrice * item.quantity : 0);
    }, 0);
    return r.sellingPrice > 0 && (cost / r.sellingPrice) > 0.35;
  }).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">Welcome back, Kitchen Prof!</h1>
          <p className="text-muted-foreground">Monitor your margins and pantry health in real-time.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-primary uppercase tracking-widest">System Status</p>
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            LIVE & PROFITABLE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/stock" className="group">
          <Card className="border-none shadow-md hover:shadow-xl transition-all h-full bg-white group-hover:translate-y-[-4px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-tight">1. Stock Taking</CardTitle>
              <PackageSearch className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ingredients.length - lowStockCount} / {ingredients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Items in healthy stock levels</p>
              {lowStockCount > 0 && (
                <div className="mt-4 flex items-center gap-1 text-xs text-destructive font-bold">
                  <AlertCircle size={14} /> {lowStockCount} items need restocking
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/costing" className="group">
          <Card className="border-none shadow-md hover:shadow-xl transition-all h-full bg-white group-hover:translate-y-[-4px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-tight">2. Cost Percentage</CardTitle>
              <Calculator className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{recipes.length - highCostRecipes} / {recipes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Recipes within target margins</p>
              {highCostRecipes > 0 && (
                <div className="mt-4 flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <TrendingUp size={14} /> {highCostRecipes} recipes need price review
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/profit" className="group">
          <Card className="border-none shadow-md hover:shadow-xl transition-all h-full bg-primary text-primary-foreground group-hover:translate-y-[-4px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold opacity-80 uppercase tracking-tight">3. Profit Calculator</CardTitle>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₦{((recipes[0]?.sellingPrice || 0) * 0.65).toLocaleString()}</div>
              <p className="text-xs opacity-70 mt-1">Est. Profit per standard batch</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-accent-foreground">
                <TrendingDown size={14} /> AI optimization suggestions ready
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="p-8 rounded-3xl bg-white border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-primary">
          <Calculator size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-bold">The Golden Rule of Restaurant Profit</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-2">
            Keep your <b>Cost Percentage</b> below 35% and your <b>Stock</b> lean. Kitchen Prof's <b>Auto Profit Calculator</b> uses AI to find hidden savings in Mile 12 market fluctuations.
          </p>
        </div>
        <Button asChild className="rounded-xl h-12 px-8 shadow-lg hover:shadow-xl transition-all">
          <Link href="/profit" className="flex items-center">Run AI Performance Audit <ArrowRight size={18} className="ml-2" /></Link>
        </Button>
      </div>
    </div>
  );
}
