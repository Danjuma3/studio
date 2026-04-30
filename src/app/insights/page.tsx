"use client";

import { useState } from 'react';
import { useInventory } from '../lib/store';
import { analyzeProcurementStrategy, CostOptimizationInsightOutput } from '@/ai/flows/cost-optimization-insight-flow';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Lightbulb, 
  Sparkles, 
  Loader2, 
  TrendingDown, 
  ShoppingBag, 
  BarChart4,
  CheckCircle2,
  AlertTriangle,
  History
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function InsightsPage() {
  const { ingredients } = useInventory();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<CostOptimizationInsightOutput | null>(null);

  const getAIInsights = async () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    try {
      const data = {
        ingredients: ingredients.map(ing => ({
          name: ing.name,
          unit: ing.unit,
          bulkPrice: ing.bulkPrice,
          retailPrice: ing.retailPrice,
          weeklyUsage: ing.weeklyUsage
        }))
      };
      
      const result = await analyzeProcurementStrategy(data);
      setInsights(result);
    } catch (error) {
      console.error("Failed to fetch AI insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStrategyIcon = (strategy: string) => {
    switch(strategy) {
      case 'Buy in Bulk': return <ShoppingBag className="text-primary" size={20} />;
      case 'Reduce Waste': return <TrendingDown className="text-amber-500" size={20} />;
      case 'Negotiate Price': return <BarChart4 className="text-blue-500" size={20} />;
      default: return <Lightbulb className="text-accent-foreground" size={20} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Cost Optimization</h1>
          <p className="text-muted-foreground">AI-powered suggestions to maximize your procurement efficiency.</p>
        </div>
        <Button 
          onClick={getAIInsights} 
          disabled={loading || ingredients.length === 0}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 shadow-lg transition-all active:scale-95 group"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
          )}
          Generate New Insights
        </Button>
      </div>

      {!insights && !loading && (
        <Card className="border-dashed border-2 bg-transparent py-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-primary mb-6">
            <Lightbulb size={40} />
          </div>
          <h2 className="text-2xl font-headline font-bold mb-2">Ready to optimize?</h2>
          <p className="text-muted-foreground max-w-md px-4">
            Click the button above and our AI will analyze your inventory and usage patterns to suggest the best procurement strategies for your Lagos restaurant.
          </p>
        </Card>
      )}

      {loading && (
        <div className="space-y-6">
          <Card className="animate-pulse bg-muted h-32"></Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="animate-pulse bg-muted h-48"></Card>
            <Card className="animate-pulse bg-muted h-48"></Card>
            <Card className="animate-pulse bg-muted h-48"></Card>
            <Card className="animate-pulse bg-muted h-48"></Card>
          </div>
        </div>
      )}

      {insights && !loading && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <Card className="bg-primary text-primary-foreground overflow-hidden border-none shadow-xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles size={120} />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 size={24} />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed font-medium">
                {insights.overallSummary}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.recommendations.map((rec, idx) => (
              <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-all overflow-hidden bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      {getStrategyIcon(rec.strategy)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{rec.ingredientName}</CardTitle>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tight">
                        {rec.strategy}
                      </Badge>
                    </div>
                  </div>
                  {rec.potentialSavings && (
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Estimated Saving</p>
                      <p className="text-sm font-bold text-primary">{rec.potentialSavings}</p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="mt-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {rec.reason}
                  </p>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t py-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <History size={12} />
                    Suggested just now
                  </span>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 font-semibold">
                    Apply Strategy
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
            <AlertTriangle className="text-amber-500 shrink-0" size={24} />
            <div>
              <p className="text-sm font-bold text-amber-900 mb-1">Market Volatility Warning</p>
              <p className="text-sm text-amber-800">
                Lagos ingredient prices fluctuate frequently. These insights are based on your most recent market updates. Regularly update prices for maximum accuracy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}