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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  MoreVertical,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function InventoryPage() {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useInventory();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    unit: 'kg' as any,
    bulkPrice: 0,
    retailPrice: 0,
    weeklyUsage: 0
  });

  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (newIngredient.name && newIngredient.bulkPrice >= 0) {
      addIngredient(newIngredient);
      setNewIngredient({ name: '', unit: 'kg', bulkPrice: 0, retailPrice: 0, weeklyUsage: 0 });
      setIsAddOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Ingredient Inventory</h1>
          <p className="text-muted-foreground">Manage your pantry and track market pricing.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 shadow-md transition-all active:scale-95">
              <Plus size={18} className="mr-2" />
              Add Ingredient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Ingredient</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  placeholder="e.g. Basmati Rice" 
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value as any})}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="ml">ml</option>
                    <option value="piece">piece</option>
                    <option value="bag">bag</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weekly Usage</label>
                  <Input 
                    type="number"
                    value={newIngredient.weeklyUsage}
                    onChange={(e) => setNewIngredient({...newIngredient, weeklyUsage: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bulk Price (₦)</label>
                  <Input 
                    type="number"
                    value={newIngredient.bulkPrice}
                    onChange={(e) => setNewIngredient({...newIngredient, bulkPrice: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Retail Price (₦)</label>
                  <Input 
                    type="number"
                    value={newIngredient.retailPrice}
                    onChange={(e) => setNewIngredient({...newIngredient, retailPrice: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} className="bg-primary">Save Ingredient</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search ingredients..." 
              className="pl-10 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 rounded-xl border-dashed">
            <Filter size={18} className="mr-2" />
            Filter
          </Button>
        </div>

        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Ingredient</TableHead>
                <TableHead className="font-semibold text-center">Unit</TableHead>
                <TableHead className="font-semibold text-right">Bulk (₦)</TableHead>
                <TableHead className="font-semibold text-right">Retail (₦)</TableHead>
                <TableHead className="font-semibold text-right">Saving (₦)</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No ingredients found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredIngredients.map((ing) => {
                  const saving = ing.retailPrice - ing.bulkPrice;
                  return (
                    <TableRow key={ing.id} className="hover:bg-accent/5 transition-colors group">
                      <TableCell className="font-medium">{ing.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-normal">{ing.unit}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">₦{ing.bulkPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">₦{ing.retailPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span className={saving > 0 ? "text-primary font-medium" : "text-muted-foreground"}>
                          {saving > 0 ? `+₦${saving.toLocaleString()}` : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-primary cursor-pointer">
                              <Edit2 size={14} className="mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive cursor-pointer"
                              onClick={() => deleteIngredient(ing.id)}
                            >
                              <Trash2 size={14} className="mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}