"use client";

import { useInventory } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { TrendingUp, TrendingDown, RefreshCw, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
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
      title: "Fetching Market Data",
      description: "Syncing current prices with Lagos Island & Mile 12 Market...",
    });
    // Mock sync
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "Prices updated for 5 core ingredients based on today's market rates.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Market Price Update</h1>
          <p className="text-muted-foreground">Keep your costs accurate with current Lagos market rates.</p>
        </div>
        <Button 
          onClick={syncPrices}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 shadow-md"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Sync with Lagos Markets
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Update Current Prices</CardTitle>
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
                        <p className="text-xs text-muted-foreground">{ing.unit}</p>
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
                    
                    <div className="hidden sm:block text-right">
                      <Badge variant="outline" className="text-[10px] h-5 bg-green-50 text-green-700 border-green-200">
                        Stable
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 border-t flex justify-end">
              <Button className="bg-primary px-8">Confirm Updates</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="text-primary" size={18} />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mile 12 Market</span>
                  <span className="text-xs text-primary flex items-center">
                    <TrendingUp size={12} className="mr-1" /> +4.2%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full w-[65%]"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Lagos Island</span>
                  <span className="text-xs text-amber-500 flex items-center">
                    <TrendingDown size={12} className="mr-1" /> -1.8%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-amber-400 h-1.5 rounded-full w-[45%]"></div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="text-primary" size={16} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Rice Prices</span> are expected to rise further by month-end due to seasonal demand.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-primary" size={16} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Poultry</span> supply has stabilized, leading to a ₦200/kg drop in retail prices.
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