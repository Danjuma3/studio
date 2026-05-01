
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
  Activity,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { ingredients, recipes, systemAlert } = useInventory();
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
          <h1 className="text-3xl lg:text-4xl font-brand font-black text-foreground tracking-tighter uppercase">Kitchen Profit Professional</h1>
          <p className="text-muted-foreground text-lg">Managing margins for food business</p>
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
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                {systemAlert.type === 'market' ? 'Global Market Intelligence' : 'System Notice'}
              </div>
              <Badge variant="outline" className="text-[8px] h-4 py-0 font-bold">LATEST</Badge>
            </div>
            <div className="text-sm font-bold leading-tight">
              {systemAlert.message}
            </div>
          </div>
          {mounted && (
            <div className="hidden md:block text-right pr-4">
              <div className="text-[10px] text-muted-foreground font-medium">Updated</div>
              <div className="text-[10px] font-bold">{new Date(systemAlert.updatedAt).toLocaleTimeString()}</div>
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
              <div className="text-4xl font-black">₦{totalPotentialProfit.toLocaleString()}</div>
              <p className="text-xs opacity-70 mt-1 font-medium">Estimated total potential</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-accent-foreground bg-black/10 p-2 rounded-lg">
                <TrendingDown size={14} /> AI optimization suggestions ready
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* High-Tech Scrabble-Style Ad Card */}
      <div className="relative p-1 lg:p-4 group">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full min-h-[400px]">
          {/* Quadrant 1: Top Left */}
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-xl flex flex-col justify-end transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 duration-500">
            <Globe className="text-primary mb-4" size={40} />
            <h3 className="text-xl font-headline font-bold">Global Intelligence</h3>
            <p className="text-sm text-muted-foreground mt-2">Sync with international pricing nodes.</p>
          </div>
          {/* Quadrant 2: Top Right */}
          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 shadow-lg flex flex-col justify-start transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 duration-500">
            <div className="flex-1" />
            <Activity className="text-primary mb-4" size={40} />
            <h3 className="text-xl font-headline font-bold">Live Pulse</h3>
            <p className="text-sm text-muted-foreground mt-2">Real-time market volatility tracking.</p>
          </div>
          {/* Quadrant 3: Bottom Left */}
          <div className="bg-accent/5 rounded-3xl p-8 border border-accent/10 shadow-lg flex flex-col justify-end transition-transform group-hover:translate-y-1 group-hover:-translate-x-1 duration-500">
            <Layers className="text-primary mb-4" size={40} />
            <h3 className="text-xl font-headline font-bold">Margin Protection</h3>
            <p className="text-sm text-muted-foreground mt-2">AI-driven food cost containment.</p>
          </div>
          {/* Quadrant 4: Bottom Right (Main Action) */}
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center transition-transform group-hover:translate-y-1 group-hover:translate-x-1 duration-500">
            <h2 className="text-2xl font-headline font-black uppercase tracking-tighter leading-none mb-4">The Golden Rule</h2>
            <p className="text-xs opacity-90 mb-6 font-medium">Protect your cost percentage across any market.</p>
            <Button asChild size="lg" variant="secondary" className="w-full rounded-2xl h-12 shadow-xl hover:scale-105 transition-all">
              <Link href="/market" className="flex items-center">
                Detect Hub <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
