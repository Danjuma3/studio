"use client";

import { useInventory } from '../lib/store';
import { PricingStrategy, Recipe } from '../lib/types';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, Percent, DollarSign, ArrowRight } from 'lucide-react';

export default function CostPercentagePage() {
  const { recipes, ingredients, updateRecipe } = useInventory();
  const [strategy] = useState<PricingStrategy>('bulk');

  const calculateRecipeCost = (recipe: Recipe) => {
    return recipe.items.reduce((sum, item) => {
      const ingredient = ingredients.find(ing => ing.id === item.ingredientId);
      if (!ingredient) return sum;
      const price = strategy === 'bulk' ? ingredient.bulkPrice : ingredient.retailPrice;
      return sum + (price * item.quantity);
    }, 0);
  };

  const handlePriceUpdate = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateRecipe(id, { sellingPrice: numValue });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Cost Percentage</h1>
        <p className="text-muted-foreground">Analyze your food costs relative to your selling prices.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
                    <p className="text-xs text-muted-foreground">Plate Cost Analysis</p>
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
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Plate Cost (₦)</p>
                    <div className="text-xl font-bold">₦{cost.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Based on bulk rates</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Selling Price (₦)</p>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">₦</span>
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
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Ingredient Breakdown</p>
                  {recipe.items.slice(0, 3).map((item, idx) => {
                    const ing = ingredients.find(i => i.id === item.ingredientId);
                    if (!ing) return null;
                    const itemCost = (strategy === 'bulk' ? ing.bulkPrice : ing.retailPrice) * item.quantity;
                    const itemPercentage = (itemCost / cost) * 100;
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{ing.name} ({item.quantity}{ing.unit})</span>
                        <div className="flex gap-4">
                          <span className="tabular-nums">₦{itemCost.toLocaleString()}</span>
                          <span className="font-bold text-primary w-10 text-right">{itemPercentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                  {recipe.items.length > 3 && (
                    <p className="text-center text-[10px] text-primary cursor-pointer hover:underline pt-2">
                      View all {recipe.items.length} ingredients
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 p-4 border-t flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <DollarSign size={14} className="text-primary" />
                  Profit per plate: <span className="font-bold text-foreground">₦{(recipe.sellingPrice - cost).toLocaleString()}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
                  Adjust Prices <ArrowRight size={14} className="ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
