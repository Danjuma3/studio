
"use client";

import { useInventory } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { TrendingUp, TrendingDown, RefreshCw, Calendar, MapPin, CheckCircle2, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function MarketUpdatePage() {
  const { ingredients, updateIngredient } = useInventory();

  const handlePriceUpdate = (id: string, type: 'bulk' | 'retail', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateIngredient(id, { [type === 'bulk' ? 'bulkPrice' : 'retailPrice']: numValue });
    }
  };

  const syncPrices = () => {
    toast({
      title: "Syncing Market Data",
      description: "Connecting to Mile 12, Oyingbo, Makoko, Oko-Oba, and Dei-Dei databases...",
    });
    // Mock sync
    setTimeout(() => {
      toast({
        title: "Market Sync Complete",
        description: "Prices updated based on today's averages from Lagos and Abuja hubs.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Market Price Update</h1>
          <p className="text-muted-foreground">Keep your costs accurate with real-time regional market intelligence.</p>
        </div>
        <Button 
          onClick={syncPrices}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 shadow-md"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Sync All Markets
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Price Input Center</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Calendar size={14} />
                  Week of {new Date().toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {ingredients.map((ing) => (
                  <div key={ing.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-primary font-bold">
                        {ing.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{ing.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{ing.unitOfMeasure?.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-1 max-w-sm">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Bulk (₦)</label>
                        <Input 
                          type="number" 
                          className="h-9 text-sm"
                          value={ing.bulkPrice}
                          onChange={(e) => handlePriceUpdate(ing.id, 'bulk', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Retail (₦)</label>
                        <Input 
                          type="number" 
                          className="h-9 text-sm"
                          value={ing.retailPrice}
                          onChange={(e) => handlePriceUpdate(ing.id, 'retail', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 border-t flex justify-end">
              <Button className="bg-primary px-8">Commit Market Updates</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="text-primary" size={18} />
                Market Hub Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Mile 12 (Grains/Veg)</span>
                    <Badge variant="outline" className="text-[10px] h-5 bg-red-50 text-red-700 border-red-200">Volatile</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Avg Increase</span>
                    <span className="text-red-500">+8.5%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Oyingbo Market</span>
                  <Badge variant="outline" className="text-[10px] h-5 bg-green-50 text-green-700 border-green-200">Stable</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Makoko (Seafood)</span>
                  <Badge variant="outline" className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-200">High Supply</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Oko-Oba (Beef/Meat)</span>
                  <Badge variant="outline" className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-200">Rising</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Dei-Dei (Abuja Hub)</span>
                  <Badge variant="outline" className="text-[10px] h-5 bg-green-50 text-green-700 border-green-200">Steady</Badge>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Critical Alerts</p>
                <div className="flex gap-2">
                  <ShoppingCart className="text-primary shrink-0" size={14} />
                  <p className="text-[11px] text-muted-foreground">
                    Beef prices at <strong>Oko-Oba</strong> are up 15% due to haulage costs. Consider frozen alternatives.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
