"use client";

import { useInventory } from './lib/store';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Package,
  CookingPot,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { ingredients, recipes } = useInventory();

  const totalInventoryValue = ingredients.reduce((sum, ing) => sum + (ing.weeklyUsage * ing.bulkPrice), 0);
  const potentialSavings = ingredients.reduce((sum, ing) => sum + (ing.weeklyUsage * (ing.retailPrice - ing.bulkPrice)), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-foreground">Aba'ka, Welcome Back!</h1>
        <p className="text-muted-foreground">Here's what's happening in your kitchen today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Ingredients</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingredients.length}</div>
            <p className="text-xs text-muted-foreground mt-1">In your inventory</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Recipes</CardTitle>
            <CookingPot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Costed recipes</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Est. weekly usage</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Potential Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₦{potentialSavings.toLocaleString()}</div>
            <p className="text-xs text-primary/80 mt-1">By buying in bulk</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-headline font-semibold flex items-center gap-2">
            Recent Ingredients
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">New</span>
          </h2>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="divide-y">
              {ingredients.slice(0, 5).map((ing) => (
                <div key={ing.id} className="p-4 flex items-center justify-between hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {ing.name[0]}
                    </div>
                    <div>
                      <p className="font-medium">{ing.name}</p>
                      <p className="text-xs text-muted-foreground">{ing.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">₦{ing.bulkPrice.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">Bulk Price</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-muted/30">
              <Button asChild variant="link" className="p-0 h-auto text-primary">
                <Link href="/inventory" className="flex items-center gap-1">
                  Manage Inventory <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-headline font-semibold">Insights & Status</h2>
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <AlertCircle className="text-amber-500 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-medium">Market Price Alert</p>
                    <p className="text-xs text-muted-foreground">Onions prices increased by 15% in Lagos markets this week.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="text-primary shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-medium">Cost Audit Complete</p>
                    <p className="text-xs text-muted-foreground">All 5 active recipes are within their profit margin targets.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary/5 border-t">
                <p className="text-xs font-medium text-primary mb-2">Optimization Suggestion:</p>
                <p className="text-xs text-muted-foreground">Switching to bulk purchases for Tomato Paste could save you ₦6,000 this month.</p>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full border-primary/20 hover:bg-primary/10">
                  <Link href="/insights">View All Insights</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}