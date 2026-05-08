
"use client";

import { useState, useEffect } from 'react';
import { useInventory } from '../lib/store';
import { Recipe, SaleItem } from '../lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  WifiOff, 
  Printer, 
  Calculator,
  CookingPot
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function POSTerminalPage() {
  const { recipes, addSale, location } = useInventory();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (recipe: Recipe) => {
    setCart(prev => {
      const existing = prev.find(item => item.recipeId === recipe.id);
      if (existing) {
        return prev.map(item => 
          item.recipeId === recipe.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, {
        recipeId: recipe.id,
        recipeName: recipe.name,
        quantity: 1,
        price: recipe.sellingPrice
      }];
    });
  };

  const updateQuantity = (recipeId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.recipeId === recipeId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (recipeId: string) => {
    setCart(prev => prev.filter(item => item.recipeId !== recipeId));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    addSale(cart);
    setCart([]);
    toast({
      title: "Sale Recorded!",
      description: isOffline 
        ? "Stored locally. Will sync when online." 
        : `Transaction of ${location.currencySymbol}${total.toLocaleString()} completed.`,
    });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-[calc(100vh-8rem)]">
      {/* Menu Side */}
      <div className="flex-1 space-y-6 overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">POS Terminal</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              Fast-lane recipe sales.
              {isOffline && (
                <Badge variant="destructive" className="h-5 text-[10px] gap-1">
                  <WifiOff size={10} /> OFFLINE MODE
                </Badge>
              )}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search recipes..." 
              className="pl-9 h-10 rounded-xl bg-white shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 pr-2 custom-scrollbar pb-10">
          {filteredRecipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="group cursor-pointer hover:border-primary/50 transition-all active:scale-95 flex flex-col justify-between"
              onClick={() => addToCart(recipe)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <CookingPot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">{recipe.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{location.currencySymbol}{recipe.sellingPrice.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredRecipes.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No recipes found.
            </div>
          )}
        </div>
      </div>

      {/* Cart Side */}
      <Card className="w-full xl:w-[400px] border-none shadow-2xl bg-white flex flex-col overflow-hidden">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-primary" size={20} />
            <CardTitle className="text-lg">Checkout</CardTitle>
          </div>
          <Badge variant="secondary" className="font-bold">{cart.length} Items</Badge>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <ShoppingCart size={48} />
              <p className="text-sm font-medium">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.recipeId} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border group">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{item.recipeName}</p>
                  <p className="text-xs text-muted-foreground">{location.currencySymbol}{item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full bg-white shadow-sm"
                    onClick={() => updateQuantity(item.recipeId, -1)}
                  >
                    <Minus size={12} />
                  </Button>
                  <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full bg-white shadow-sm"
                    onClick={() => updateQuantity(item.recipeId, 1)}
                  >
                    <Plus size={12} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive hover:bg-destructive/10 ml-1"
                    onClick={() => removeFromCart(item.recipeId)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>

        <CardFooter className="bg-muted/10 border-t p-6 flex flex-col gap-4">
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground font-medium">
              <span>Subtotal</span>
              <span>{location.currencySymbol}{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-black pt-2 border-t border-dashed">
              <span>Total Due</span>
              <span className="text-primary">{location.currencySymbol}{total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button variant="outline" className="h-12 rounded-xl">
              <Printer size={18} className="mr-2" /> Receipt
            </Button>
            <Button 
              className="h-12 rounded-xl bg-primary shadow-lg"
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              <CheckCircle2 size={18} className="mr-2" /> Checkout
            </Button>
          </div>
          
          <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest flex items-center justify-center gap-2">
            <Calculator size={10} />
            Stock Deduction Active
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
