
"use client";

import { useInventory } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { RefreshCw, Calendar, MapPin, ShoppingCart, Lock, Sparkles, LineChart as ChartIcon, Globe, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState } from 'react';
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
    label: "Proteins",
    color: "hsl(var(--destructive))",
  },
  veg: {
    label: "Produce",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function MarketUpdatePage() {
  const { ingredients, updateIngredient, subscription, location, updateLocation } = useInventory();
  const [detecting, setDetecting] = useState(false);

  const handlePriceUpdate = (id: string, type: 'bulk' | 'retail', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateIngredient(id, { [type === 'bulk' ? 'bulkUnitPrice' : 'retailUnitPrice']: numValue });
    }
  };

  const handleDetectLocation = () => {
    setDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setTimeout(() => {
          updateLocation({
            country: 'Nigeria',
            city: 'Lagos',
            currencySymbol: '₦',
            currency: 'NGN'
          });
          setDetecting(false);
          toast({
            title: "Regional Hub Detected",
            description: `Switched to NGN data stream for Lagos pricing nodes.`,
          });
        }, 1500);
      }, () => {
        setDetecting(false);
        toast({
          variant: "destructive",
          title: "Detection Failed",
          description: "Please enable location services in your browser settings.",
        });
      });
    }
  };

  const syncPrices = () => {
    toast({
      title: "Syncing Lagos Market Data",
      description: `Connecting to Mile 12 and Agege Abattoir nodes...`,
    });
    setTimeout(() => {
      toast({
        title: "Lagos Hub Sync Complete",
        description: `Prices updated based on today's hikes at Mile 12 and Agege.`,
      });
    }, 1500);
  };

  const isPro = subscription.plan === 'pro';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Market Intelligence Hub</h1>
          <p className="text-muted-foreground">Real-time data from {location.city} pricing nodes (Mile 12, Agege Abattoir).</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={handleDetectLocation}
            disabled={detecting}
            className="rounded-xl border-primary/20 text-primary h-12"
          >
            {detecting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Navigation className="mr-2 h-5 w-5" />}
            Detect Hub
          </Button>
          <Button 
            onClick={syncPrices}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 shadow-md"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Sync Lagos Markets
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChartIcon size={20} className="text-primary" />
                  Regional Price Trends
                </CardTitle>
                <CardDescription>
                  {isPro ? `Historical tracking for ${location.country} nodes` : "Limited regional updates"}
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
                        tickFormatter={(value) => `${location.currencySymbol}${value/1000}k`}
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
                    <h3 className="text-lg font-bold">Unlock Market Trends</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mb-4">
                      Pro members get full historical analysis for Grains, Proteins, and Produce across all Lagos hubs.
                    </p>
                    <Button asChild className="rounded-xl shadow-lg">
                      <Link href="/settings">Upgrade Subscription</Link>
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
                <CardTitle className="text-lg">Update Lagos Hub Prices</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Globe size={14} className="text-primary" />
                  Region: {location.country}
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
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Bulk ({location.currencySymbol})</label>
                        <Input 
                          type="number" 
                          className="h-9 text-sm"
                          value={ing.bulkUnitPrice || ing.bulkPrice || 0}
                          onChange={(e) => handlePriceUpdate(ing.id, 'bulk', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Retail ({location.currencySymbol})</label>
                        <Input 
                          type="number" 
                          className="h-9 text-sm"
                          value={ing.retailUnitPrice || ing.retailPrice || 0}
                          onChange={(e) => handlePriceUpdate(ing.id, 'retail', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 border-t flex justify-end">
              <Button className="bg-primary px-8 rounded-xl shadow-md">Apply Market Updates</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="text-primary" size={18} />
                Lagos Hub Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Mile 12 Market</span>
                    <Badge variant="outline" className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-200">Volatile</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Grains & Produce</span>
                    <span className="text-amber-600 font-bold">+15% Hike</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Agege Abattoir</span>
                  <Badge variant="outline" className="text-[10px] h-5 bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Proteins</span>
                  <span className="text-destructive font-bold">High Demand</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Supply Alerts</p>
                <div className="flex gap-2">
                  <AlertCircle className="text-destructive shrink-0" size={14} />
                  <p className="text-[11px] text-muted-foreground">
                    Price hikes detected across all major Lagos gateways. Sync your inventory to protect your margins.
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
