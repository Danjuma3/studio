"use client";

import { useState } from 'react';
import { useInventory } from '../lib/store';
import { PricingStrategy, RecipeItem } from '../lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Trash2, 
  CookingPot, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Scale
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';

export default function RecipesPage() {
  const { ingredients, recipes, addRecipe, deleteRecipe } = useInventory();
  const [strategy, setStrategy] = useState<PricingStrategy>('bulk');
  const [isAdding, setIsAdding] = useState(false);
  
  // Create Recipe Form State
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    description: '',
    items: [] as RecipeItem[]
  });

  const calculateRecipeCost = (items: RecipeItem[], currentStrategy: PricingStrategy) => {
    return items.reduce((sum, item) => {
      const ingredient = ingredients.find(ing => ing.id === item.ingredientId);
      if (!ingredient) return sum;
      const price = currentStrategy === 'bulk' ? ingredient.bulkPrice : ingredient.retailPrice;
      return sum + (price * item.quantity);
    }, 0);
  };

  const addItemToForm = () => {
    if (ingredients.length > 0) {
      setNewRecipe({
        ...newRecipe,
        items: [...newRecipe.items, { ingredientId: ingredients[0].id, quantity: 1 }]
      });
    }
  };

  const removeItemFromForm = (index: number) => {
    const newItems = [...newRecipe.items];
    newItems.splice(index, 1);
    setNewRecipe({ ...newRecipe, items: newItems });
  };

  const updateItemInForm = (index: number, updates: Partial<RecipeItem>) => {
    const newItems = [...newRecipe.items];
    newItems[index] = { ...newItems[index], ...updates };
    setNewRecipe({ ...newRecipe, items: newItems });
  };

  const handleSaveRecipe = () => {
    if (newRecipe.name && newRecipe.items.length > 0) {
      addRecipe(newRecipe);
      setNewRecipe({ name: '', description: '', items: [] });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Recipe Composer</h1>
          <p className="text-muted-foreground">Calculate plate costs and compare procurement strategies.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border shadow-sm">
          <Label htmlFor="pricing-strategy" className="text-sm font-medium cursor-pointer">
            {strategy === 'bulk' ? 'Bulk Pricing' : 'Retail Pricing'}
          </Label>
          <Switch 
            id="pricing-strategy"
            checked={strategy === 'retail'}
            onCheckedChange={(checked) => setStrategy(checked ? 'retail' : 'bulk')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Card className="border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer flex flex-col items-center justify-center p-12 group h-full min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
                <Plus size={32} />
              </div>
              <h3 className="font-headline font-semibold text-lg">Create New Recipe</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">Start combining ingredients to calculate costs.</p>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Recipe Composer</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Recipe Name</Label>
                  <Input 
                    placeholder="e.g. Signature Party Jollof" 
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    placeholder="A brief note about this recipe" 
                    value={newRecipe.description}
                    onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Ingredients & Quantities</h4>
                  <Button variant="ghost" size="sm" onClick={addItemToForm} className="text-primary hover:bg-primary/5">
                    <Plus size={16} className="mr-1" /> Add Item
                  </Button>
                </div>
                
                {newRecipe.items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Select Ingredient</Label>
                      <select 
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={item.ingredientId}
                        onChange={(e) => updateItemInForm(index, { ingredientId: e.target.value })}
                      >
                        {ingredients.map(ing => (
                          <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs">Qty</Label>
                      <Input 
                        type="number" 
                        min="0.01" 
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItemInForm(index, { quantity: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive h-10" onClick={() => removeItemFromForm(index)}>
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}

                {newRecipe.items.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2">
                    No ingredients added yet.
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="bg-muted/50 p-4 -mx-6 -mb-6 sticky bottom-0">
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Est. Batch Cost</p>
                  <p className="text-lg font-bold text-primary">₦{calculateRecipeCost(newRecipe.items, 'bulk').toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsAdding(false)}>Discard</Button>
                  <Button onClick={handleSaveRecipe} className="bg-primary">Save Recipe</Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {recipes.map((recipe) => {
          const bulkCost = calculateRecipeCost(recipe.items, 'bulk');
          const retailCost = calculateRecipeCost(recipe.items, 'retail');
          const currentCost = strategy === 'bulk' ? bulkCost : retailCost;
          const saving = retailCost - bulkCost;

          return (
            <Card key={recipe.id} className="border-none shadow-md overflow-hidden hover:shadow-lg transition-all group">
              <CardHeader className="bg-white">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-primary">
                    <CookingPot size={24} />
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => deleteRecipe(recipe.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
                <CardTitle className="mt-4">{recipe.name}</CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-1">{recipe.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Cost</span>
                    <span className="text-xl font-bold text-primary">₦{currentCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Ingredients</span>
                    <span className="font-medium">{recipe.items.length} items</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    <span>Breakdown</span>
                    <span>Cost (₦)</span>
                  </div>
                  <div className="max-h-[100px] overflow-y-auto pr-1 space-y-1">
                    {recipe.items.map((item, idx) => {
                      const ing = ingredients.find(i => i.id === item.ingredientId);
                      if (!ing) return null;
                      const itemCost = (strategy === 'bulk' ? ing.bulkPrice : ing.retailPrice) * item.quantity;
                      return (
                        <div key={idx} className="flex justify-between text-xs py-1 border-b border-dashed">
                          <span className="truncate max-w-[140px]">{ing.name}</span>
                          <span className="tabular-nums">₦{itemCost.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-primary/5 pt-4">
                <div className="w-full flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-1 text-primary">
                    <TrendingDown size={14} />
                    <span>Potential Savings: ₦{saving.toLocaleString()}</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}