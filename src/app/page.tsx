
"use client";

import { useInventory } from './lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  AlertCircle, 
  PackageSearch,
  Calculator,
  ArrowRight,
  TrendingDown,
  Megaphone,
  Globe,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { ingredients, recipes, systemAlert, location } = useInventory();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lowStockCount = ingredients.filter(ing => (ing.currentStock || 0) <= (ing.minStock || 0)).length;
  
  const totalPotentialProfit = recipes.reduce((acc, recipe) => {
    const cost = recipe.items.reduce((sum, item) => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      const price = ing ? (ing.bulkUnitPrice || ing.bulkPrice || 0) : 0;
      return sum + (price * item.quantity);
    }, 0);
    return acc + Math.max(0, recipe.sellingPrice - cost);
  }, 0);

  const highCostRecipes = recipes.filter(r => {
    const cost = r.items.reduce((sum, item) => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      return sum + (ing ? (ing.bulkUnitPrice || ing.bulkPrice || 0) * item.quantity : 0);
    }, 0);
    return r.sellingPrice > 0 && (cost / r.sellingPrice) > 0.35;
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-headline font-bold text-foreground">Kitchen Profit Professional</h1>
          <p className="text-muted-foreground text-lg">Managing margins for your food business in {location.city}, {location.country}.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Regional Hub Status</p>
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            SYNCHRONIZED & ACTIVE
          </div>
        </div>
      </div>

      {systemAlert?.active && (
        <div className={`p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top duration-1000 border-2 shadow-lg ${
          systemAlert.type === 'urgent' ? 'bg-destructive/10 border-destructive/20' : 
          systemAlert.type === 'market' ? 'bg-primary/10 border-primary/20' : 
          'bg-accent/10 border-accent/20'
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            systemAlert.type === 'urgent' ? 'bg-destructive text-white' : 
            systemAlert.type === 'market' ? 'bg-primary text-white' : 
            'bg-accent text-accent-foreground'
          }`}>
            <Megaphone size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                {systemAlert.type === 'market' ? 'Global Market Intelligence' : 'System Notice'}
              </p>
              <Badge variant="outline" className="text-[8px] h-4 py-0 font-bold">LATEST</Badge>
            </div>
            <p className="text-sm font-bold leading-tight">
              {systemAlert.message}
            </p>
          </div>
          {mounted && (
            <div className="hidden md:block text-right pr-4">
              <p className="text-[10px] text-muted-foreground font-medium">Updated</p>
              <p className="text-[10px] font-bold">{new Date(systemAlert.updatedAt).toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/stock" className="group">
          <Card className="border-none shadow-md hover:shadow-xl transition-all h-full bg-white group-hover:translate-y-[-4px] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/5">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Stock Efficiency</CardTitle>
              <PackageSearch className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-4xl font-black">{ingredients.length - lowStockCount} / {ingredients.length}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Optimal regional inventory levels</p>
              {lowStockCount > 0 && (
                <div className="mt-4 flex items-center gap-1 text-xs text-destructive font-bold bg-destructive/5 p-2 rounded-lg">
                  <AlertCircle size={14} /> {lowStockCount} items need restocking
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/costing" className="group">
          <Card className="border-none shadow-md hover:shadow-xl transition-all h-full bg-white group-hover:translate-y-[-4px] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/5">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Food Cost %</CardTitle>
              <Calculator className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-4xl font-black">{recipes.length - highCostRecipes} / {recipes.length}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Global target margin compliance</p>
              {highCostRecipes > 0 && (
                <div className="mt-4 flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 p-2 rounded-lg">
                  <TrendingUp size={14} /> {highCostRecipes} recipes need price review
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/profit" className="group">
          <Card className="border-none shadow-md hover:shadow-xl transition-all h-full bg-primary text-primary-foreground group-hover:translate-y-[-4px] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white/5">
              <CardTitle className="text-sm font-bold opacity-80 uppercase tracking-tight">Projected Profit</CardTitle>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-4xl font-black">{location.currencySymbol}{totalPotentialProfit.toLocaleString()}</div>
              <p className="text-xs opacity-70 mt-1 font-medium">Estimated total potential ({location.currency})</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-accent-foreground bg-black/10 p-2 rounded-lg">
                <TrendingDown size={14} /> AI optimization suggestions ready
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="p-10 rounded-[2rem] bg-white border-2 border-dashed border-muted flex flex-col items-center justify-center text-center space-y-6 shadow-sm hover:border-primary/20 transition-colors">
        <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary rotate-3">
          <Globe size={40} />
        </div>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-headline font-bold">The Golden Rule of Kitchen Profit</h2>
          <p className="text-muted-foreground text-lg mt-3 leading-relaxed">
            Protect your <b>Cost Percentage</b> across any market. Kitchen Profit's AI now scales to any regional pricing hub, identifying hidden savings in global commodity fluctuations.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-2xl h-14 px-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-primary">
          <Link href="/market" className="flex items-center text-lg">Detect Regional Market Hub <ArrowRight size={20} className="ml-2" /></Link>
        </Button>
      </div>
    </div>
  );
}
