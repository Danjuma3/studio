
"use client";

import { useInventory } from '../lib/store';
import { PricingStrategy, Recipe } from '../lib/types';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, ArrowRight, Lock, Sparkles, Crown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CostPercentagePage() {
  const { recipes, ingredients, updateRecipe, subscription, location } = useInventory();
  const [strategy] = useState<PricingStrategy>('bulk');

  const calculateRecipeCost = (recipe: Recipe) => {
    return recipe.items.reduce((sum, item) => {
      const ingredient = ingredients.find(ing => ing.id === item.ingredientId);
      if (!ingredient) return sum;
      const price = strategy === 'bulk' ? (ingredient.bulkUnitPrice || 0) : (ingredient.retailUnitPrice || 0);
      return sum + (price * item.quantity);
    }, 0);
  };

  const handlePriceUpdate = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateRecipe(id, { sellingPrice: numValue });
    }
  };

  if (subscription.plan === 'free') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary relative">
          <Calculator size={48} />
          <div className="absolute -top-1 -right-1 bg-destructive text-white p-1 rounded-full shadow-lg">
            <Lock size={16} />
          </div>
        </div>
        
        <div className="text-center space-y-4 max-w-lg mx-auto">
          <h1 className="text-3xl font-headline font-bold">Plate Costing is a Pro Feature</h1>
          <p className="text-muted-foreground text-lg">
            Unlock professional food cost percentage analysis and real-time margin tracking for your business.
          </p>
        </div>

        <Card className="w-full max-w-md border-primary/20 bg-primary/5 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Crown className="text-primary" size={24} />
              Kitchen Profit Pro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border">
              <CheckCircle2 size={20} className="text-primary" />
              <span className="text-sm font-medium">Automatic Cost % Calculations</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border">
              <CheckCircle2 size={20} className="text-primary" />
              <span className="text-sm font-medium">Regional Profit Analysis</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full h-12 text-lg bg-primary rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
              <Link href="/settings">
                <Sparkles className="mr-2 h-5 w-5" />
                Upgrade Subscription
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold text-black/60">Cost Percentage</h1>
        <p className="text-muted-foreground">Analyze costs relative to selling prices in {location.currency}.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {recipes.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Calculator size={32} />
            </div>
            <p className="text-muted-foreground">No recipes found. Create your first recipe in the Recipe Composer.</p>
            <Button asChild variant="outline">
              <Link href="/recipes">Go to Recipe Composer</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 col-span-full">
            {recipes.map((recipe) => {
              const cost = calculateRecipeCost(recipe);
              const costPercentage = recipe.sellingPrice > 0 ? (cost / recipe.sellingPrice) * 100 : 0;
              const isHealthy = costPercentage <= 35 && costPercentage > 0;

              return (
                <Card key={recipe.id} className="border-none shadow-md overflow-hidden bg-white">
                  <CardHeader className="flex flex-row items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Calculator size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{recipe.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">Regional Plate Analysis</p>
                      </div>
                    </div>
                    {isHealthy ? (
                      <Badge className="bg-green-500">HEALTHY MARGIN</Badge>
                    ) : (
                      <Badge variant="destructive">HIGH FOOD COST</Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Plate Cost ({location.currencySymbol})</p>
                        <div className="text-xl font-bold">{location.currencySymbol}{cost.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Regional bulk rates</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Selling Price ({location.currencySymbol})</p>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-bold">{location.currencySymbol}</span>
                          <Input 
                            type="number"
                            className="h-8 font-bold text-lg"
                            value={recipe.sellingPrice}
                            onChange={(e) => handlePriceUpdate(recipe.id, e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-muted/30">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Food Cost %</p>
                        <div className={`text-2xl font-black ${isHealthy ? 'text-green-600' : 'text-destructive'}`}>
                          {costPercentage.toFixed(1)}%
                        </div>
                        <p className="text-[10px] text-muted-foreground">Target: 25-35%</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t space-y-3">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Component Breakdown</p>
                      {recipe.items.slice(0, 3).map((item, idx) => {
                        const ing = ingredients.find(i => i.id === item.ingredientId);
                        if (!ing) return null;
                        const itemCost = (strategy === 'bulk' ? (ing.bulkUnitPrice || 0) : (ing.retailUnitPrice || 0)) * item.quantity;
                        const itemPercentage = (itemCost / (cost || 1)) * 100;
                        return (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{ing.name} ({item.quantity}{ing.unitOfMeasure})</span>
                            <div className="flex gap-4">
                              <span className="tabular-nums">{location.currencySymbol}{itemCost.toLocaleString()}</span>
                              <span className="font-bold text-primary w-10 text-right">{itemPercentage.toFixed(0)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 p-4 border-t flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <DollarSign size={14} className="text-primary" />
                      Profit per plate: <span className="font-bold text-foreground">{location.currencySymbol}{(recipe.sellingPrice - cost).toLocaleString()}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
                      Adjust Prices <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
