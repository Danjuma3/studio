"use client";

import { useState } from 'react';
import { useInventory } from '../lib/store';
import { analyzeProcurementStrategy, CostOptimizationInsightOutput } from '@/ai/flows/cost-optimization-insight-flow';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Sparkles, 
  Loader2, 
  TrendingUp, 
  DollarSign, 
  Zap,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProfitCalculatorPage() {
  const { ingredients, recipes } = useInventory();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<CostOptimizationInsightOutput | null>(null);

  const calculateTotalProfit = () => {
    return recipes.reduce((sum, recipe) => {
      const cost = recipe.items.reduce((rSum, item) => {
        const ing = ingredients.find(i => i.id === item.ingredientId);
        return rSum + (ing ? ing.bulkPrice * item.quantity : 0);
      }, 0);
      return sum + (recipe.sellingPrice - cost);
    }, 0);
  };

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Auto Profit Calculator</h1>
          <p className="text-muted-foreground">Automated margin analysis and AI-driven growth strategies.</p>
        </div>
        <Button 
          onClick={getAIInsights} 
          disabled={loading || ingredients.length === 0}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 shadow-lg transition-all"
        >
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
          Run AI Profit Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-md bg-primary text-primary-foreground relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm font-medium opacity-80">Estimated Unit Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦{calculateTotalProfit().toLocaleString()}</div>
            <p className="text-xs mt-1 opacity-70">Average profit per standard recipe set</p>
          </CardContent>
          <DollarSign className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Profit Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">+12.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Available via bulk procurement</p>
          </CardContent>
          <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/5" />
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">Medium</div>
            <p className="text-xs text-muted-foreground mt-1">Volatility in grain prices (Lagos)</p>
          </CardContent>
          <BarChart3 className="absolute -bottom-4 -right-4 w-24 h-24 text-amber-500/5" />
        </Card>
      </div>

      {!insights && !loading && (
        <Card className="border-dashed border-2 bg-transparent py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <Zap size={32} />
          </div>
          <h2 className="text-xl font-bold">Optimize for Profit</h2>
          <p className="text-muted-foreground max-w-sm mt-2">
            Run the AI audit to find exactly where you're losing margin and get automated recommendations to fix it.
          </p>
        </Card>
      )}

      {insights && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-white border-none shadow-lg overflow-hidden">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
              <h3 className="font-bold flex items-center gap-2">
                <Lightbulb className="text-primary" size={20} />
                Strategic AI Recommendations
              </h3>
            </div>
            <div className="divide-y">
              {insights.recommendations.map((rec, idx) => (
                <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/5 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{rec.ingredientName}</span>
                      <Badge variant="secondary" className="text-[10px] uppercase">{rec.strategy}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-2xl">{rec.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">Est. Impact</p>
                    <p className="text-lg font-bold text-primary">{rec.potentialSavings}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
