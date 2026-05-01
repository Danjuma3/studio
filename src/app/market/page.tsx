
"use client";

import { useInventory } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { RefreshCw, Calendar, MapPin, ShoppingCart, Lock, Sparkles, LineChart as ChartIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "Jan", grains: 4500, meat: 8200, veg: 2100 },
  { month: "Feb", grains: 4800, meat: 8500, veg: 2300 },
  { month: "Mar", grains: 5200, meat: 9100, veg: 3200 },
  { month: "Apr", grains: 5100, meat: 9400, veg: 2800 },
  { month: "May", grains: 5600, meat: 9800, veg: 2600 },
];

const chartConfig = {
  grains: {
    label: "Grains",
    color: "hsl(var(--primary))",
  },
  meat: {
    label: "Meat/Beef",
    color: "hsl(var(--destructive))",
  },
  veg: {
    label: "Vegetables",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function MarketUpdatePage() {
  const { ingredients, updateIngredient, subscription } = useInventory();

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
    setTimeout(() => {
      toast({
        title: "Market Sync Complete",
        description: "Prices updated based on today's averages from Lagos and Abuja hubs.",
      });
    }, 1500);
  };

  const isPro = subscription.plan === 'pro';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Market Intelligence</h1>
          <p className="text-muted-foreground">Real-time regional market data to protect your profit margins.</p>
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
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChartIcon size={20} className="text-primary" />
                  Price Trend Analysis
                </CardTitle>
                <CardDescription>
                  {isPro ? "Full historical tracking for Lagos Hubs" : "Limited market trend updates"}
                </CardDescription>
              </div>
              {!isPro && <Badge variant="secondary" className="gap-1"><Lock size={12} /> Pro Only</Badge>}
            </CardHeader>
            <CardContent className="pt-6">
              {isPro ? (
                <div className="h-[300px] w-full">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                      <XAxis 
                        dataKey="month" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `₦${value/1000}k`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="grains" 
                        stroke="var(--color-grains)" 
                        strokeWidth={3} 
                        dot={false} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="meat" 
                        stroke="var(--color-meat)" 
                        strokeWidth={3} 
                        dot={false} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="veg" 
                        stroke="var(--color-veg)" 
                        strokeWidth={3} 
                        dot={false} 
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="relative h-[300px] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center p-6">
                    <Sparkles className="text-primary mb-2" size={32} />
                    <h3 className="text-lg font-bold">Unlock Market Analytics</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mb-4">
                      Pro members get full historical trend charts for Grains, Meat, and Vegetables across major Nigerian markets.
                    </p>
                    <Button asChild className="rounded-xl shadow-lg">
                      <Link href="/settings">Upgrade for ₦11,000/mo</Link>
                    </Button>
                  </div>
                  <div className="w-full opacity-20 grayscale">
                    <div className="h-64 bg-muted rounded-xl w-full"></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Price Update Hub</CardTitle>
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
              <Button className="bg-primary px-8 rounded-xl shadow-md">Commit Market Updates</Button>
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
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Critical Alerts</p>
                <div className="flex gap-2">
                  <ShoppingCart className="text-primary shrink-0" size={14} />
                  <p className="text-[11px] text-muted-foreground">
                    Beef prices at <strong>Oko-Oba</strong> are up 15%. Consider alternatives.
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
