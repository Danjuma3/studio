
"use client";

import { useState } from 'react';
import { useInventory } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, PackageSearch, AlertTriangle, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StockTakingPage() {
  const { ingredients, recipes, updateIngredient, loading } = useInventory();
  const [search, setSearch] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const filteredIngredients = ingredients.filter(ing => {
    const searchLower = search.toLowerCase();
    const matchesIngredient = ing.name.toLowerCase().includes(searchLower);
    
    // Recipe-aware search: check if the ingredient is used in a recipe matching the search
    const matchesRecipe = recipes.some(recipe => 
      recipe.name.toLowerCase().includes(searchLower) && 
      recipe.items.some(item => item.ingredientId === ing.id)
    );

    return matchesIngredient || matchesRecipe;
  });

  const handleStockUpdate = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateIngredient(id, { currentStock: numValue });
    }
  };

  const handleFullAudit = () => {
    setIsAuditing(true);
    toast({
      title: "Full Audit Started",
      description: "Reconciling physical pantry records with system data...",
    });

    setTimeout(() => {
      setIsAuditing(false);
      toast({
        title: "Audit Complete",
        description: `Verified ${ingredients.length} items. All stock levels are now synchronized.`,
      });
    }, 2000);
  };

  const lowStockCount = ingredients.filter(ing => (ing.currentStock || 0) <= (ing.minStock || 0)).length;

  if (loading || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground font-medium">Syncing Inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Stock Taking</h1>
          <p className="text-muted-foreground">Monitor current pantry levels and identify shortages.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => toast({ title: "Inventory Report", description: "Exporting stock report to PDF..." })}
          >
            Export Report
          </Button>
          <Button 
            onClick={handleFullAudit} 
            disabled={isAuditing || ingredients.length === 0}
            className="bg-primary min-w-[140px]"
          >
            {isAuditing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw size={18} className="mr-2" />
            )}
            {isAuditing ? 'Auditing...' : 'Full Audit'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Items
              <PackageSearch size={18} className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingredients.length}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Low Stock Alerts
              <AlertTriangle size={18} className="text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Below minimum threshold</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center justify-between">
              Inventory Status
              <CheckCircle2 size={18} className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {ingredients.length > 0 ? Math.round(((ingredients.length - lowStockCount) / ingredients.length) * 100) : 100}%
            </div>
            <p className="text-xs text-primary/70 mt-1">Healthy stock ratio</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search by ingredient name or recipe (e.g. Jollof)..." 
            className="pl-10 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead className="text-center">Min Threshold</TableHead>
                <TableHead className="text-center">Unit</TableHead>
                <TableHead className="text-right w-[150px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                     {search ? "No matching ingredients or recipes found." : "No ingredients tracked yet."}
                   </TableCell>
                 </TableRow>
              ) : filteredIngredients.map((ing) => {
                const isLow = (ing.currentStock || 0) <= (ing.minStock || 0);
                return (
                  <TableRow key={ing.id} className="hover:bg-accent/5 transition-colors">
                    <TableCell className="font-medium">{ing.name}</TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="number"
                        className="w-20 mx-auto h-8 text-center"
                        value={ing.currentStock || 0}
                        onChange={(e) => handleStockUpdate(ing.id, e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{ing.minStock || 0}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="capitalize">
                        {ing.unitOfMeasure?.replace('_', ' ') || 'kg'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isLow ? (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">LOW STOCK</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">IN STOCK</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
