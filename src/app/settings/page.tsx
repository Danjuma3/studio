"use client";

import { useState } from 'react';
import { useInventory } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Building2, 
  Smartphone, 
  Wallet,
  MoreVertical,
  ShieldCheck,
  Bell,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function SettingsPage() {
  const { paymentMethods, addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } = useInventory();
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'bank_transfer' as const,
    provider: '',
    accountName: '',
    lastFour: '',
    isDefault: false
  });

  const handleAdd = () => {
    if (newMethod.provider || newMethod.type === 'paystack') {
      const finalProvider = newMethod.type === 'paystack' ? 'Paystack' : newMethod.provider;
      addPaymentMethod({ ...newMethod, provider: finalProvider });
      setNewMethod({ type: 'bank_transfer', provider: '', accountName: '', lastFour: '', isDefault: false });
      setIsAddingOpen(false);
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="text-primary" />;
      case 'bank_transfer': return <Building2 className="text-primary" />;
      case 'pos': return <Smartphone className="text-primary" />;
      case 'paystack': return <Zap className="text-sky-500" />;
      default: return <Wallet className="text-primary" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings & Billing</h1>
        <p className="text-muted-foreground">Manage your business profile and payment preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Payment Methods</CardTitle>
                <CardDescription>How you pay for supplies and market deliveries.</CardDescription>
              </div>
              <Dialog open={isAddingOpen} onOpenChange={setIsAddingOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-xl">
                    <Plus size={16} className="mr-2" /> Add New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <select 
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={newMethod.type}
                        onChange={(e) => setNewMethod({...newMethod, type: e.target.value as any})}
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="card">Card</option>
                        <option value="paystack">Paystack</option>
                        <option value="pos">POS Terminal</option>
                        <option value="cash">Cash / Wallet</option>
                      </select>
                    </div>
                    {newMethod.type !== 'paystack' && (
                      <div className="space-y-2">
                        <Label>Provider / Bank Name</Label>
                        <Input 
                          placeholder="e.g. GTBank, Visa, Moniepoint" 
                          value={newMethod.provider}
                          onChange={(e) => setNewMethod({...newMethod, provider: e.target.value})}
                        />
                      </div>
                    )}
                    {newMethod.type === 'bank_transfer' ? (
                      <div className="space-y-2">
                        <Label>Account Name</Label>
                        <Input 
                          placeholder="e.g. Buchi's Kitchen Ent." 
                          value={newMethod.accountName}
                          onChange={(e) => setNewMethod({...newMethod, accountName: e.target.value})}
                        />
                      </div>
                    ) : newMethod.type === 'card' ? (
                      <div className="space-y-2">
                        <Label>Last 4 Digits (Optional)</Label>
                        <Input 
                          placeholder="e.g. 4242" 
                          value={newMethod.lastFour}
                          onChange={(e) => setNewMethod({...newMethod, lastFour: e.target.value})}
                        />
                      </div>
                    ) : null}
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="isDefault" 
                        className="rounded border-gray-300"
                        checked={newMethod.isDefault}
                        onChange={(e) => setNewMethod({...newMethod, isDefault: e.target.checked})}
                      />
                      <Label htmlFor="isDefault">Set as default payment method</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdd} className="bg-primary">Add Method</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                  No payment methods added yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      className={`p-4 rounded-2xl border-2 transition-all relative group ${method.isDefault ? 'border-primary/40 bg-primary/5' : 'border-transparent bg-muted/30 hover:bg-muted/50'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                            {getMethodIcon(method.type)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{method.provider}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                              {method.type.replace('_', ' ')} {method.lastFour ? `•••• ${method.lastFour}` : ''}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!method.isDefault && (
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => setDefaultPaymentMethod(method.id)}
                              >
                                Set as Default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive cursor-pointer"
                              onClick={() => deletePaymentMethod(method.id)}
                            >
                              <Trash2 size={14} className="mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {method.accountName && (
                        <p className="mt-3 text-xs font-medium text-muted-foreground px-1">
                          Account: {method.accountName}
                        </p>
                      )}

                      {method.isDefault && (
                        <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                          <CheckCircle2 size={12} /> Default
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Business Profile</CardTitle>
              <CardDescription>Update your restaurant details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Restaurant Name</Label>
                  <Input defaultValue="Buchi's Kitchen" />
                </div>
                <div className="space-y-2">
                  <Label>Owner Handle</Label>
                  <Input defaultValue="@buchi_kitchen_lagos" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Address</Label>
                <Input defaultValue="12 Admiralty Way, Lekki Phase 1, Lagos" />
              </div>
              <Button className="bg-primary w-fit px-8">Update Profile</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck size={20} />
                Billing Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90 leading-relaxed">
                Your payment information is stored locally and securely within Kitchen Prof. We never share your banking details with 3rd party vendors.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell size={18} />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Market Price Alerts</p>
                    <p className="text-xs text-muted-foreground">Notify when Mile 12 prices fluctuate.</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Cost Overruns</p>
                    <p className="text-xs text-muted-foreground">Alert when recipe margins drop below 20%.</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
