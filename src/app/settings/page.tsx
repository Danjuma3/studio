"use client";

import { useState, useEffect, useMemo } from 'react';
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
  Zap,
  Crown,
  ChevronRight,
  Sparkles,
  Info,
  Calculator,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  FileCode
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { usePaystackPayment } from 'react-paystack';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * Isolated Paystack button component to prevent SSR "window is not defined" errors.
 */
function PaystackActivateButton({ config, onSuccess, onClose }: { config: any, onSuccess: any, onClose: any }) {
  const initializePayment = usePaystackPayment(config);
  
  return (
    <Button 
      className="w-full h-12 gap-2 text-white bg-sky-600 hover:bg-sky-700 shadow-md"
      onClick={() => initializePayment({onSuccess, onClose})}
    >
      <ExternalLink size={18} />
      Pay Securely with Paystack
    </Button>
  );
}

export default function SettingsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { paymentMethods, addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, subscription, upgradePlan } = useInventory();
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');

  useEffect(() => {
    setMounted(true);
  }, []);

  const [newMethod, setNewMethod] = useState({
    type: 'bank_transfer' as const,
    provider: '',
    accountName: '',
    lastFour: '',
    isDefault: false
  });

  const OFFICIAL_PAYMENT_INFO = {
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: "Kitchen Prof Enterprise",
    reference: `KP-${user?.uid?.substring(0, 6).toUpperCase() || 'USER'}`,
    amount: 11000 * 100,
    publicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  };

  // Memoize config to ensure stability and prevent hydration mismatch on reference
  const paystackConfig = useMemo(() => {
    if (!mounted || !user) return null;
    return {
      reference: OFFICIAL_PAYMENT_INFO.reference + '-' + Date.now(),
      email: user?.email || "customer@kitchenprof.ng",
      amount: OFFICIAL_PAYMENT_INFO.amount,
      publicKey: OFFICIAL_PAYMENT_INFO.publicKey,
    };
  }, [mounted, user]);

  const onSuccess = (reference: any) => {
    upgradePlan('pro');
    setIsUpgradeOpen(false);
    toast({
      title: "Payment Successful!",
      description: "Your Pro features have been unlocked. Reference: " + reference.reference,
    });
  };

  const onClose = () => {
    toast({
      variant: "destructive",
      title: "Payment Cancelled",
      description: "You closed the payment window. Your plan was not upgraded.",
    });
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

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

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings & Billing</h1>
        <p className="text-muted-foreground">Manage your business profile, subscription, and branding.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Branding Section */}
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <ImageIcon className="text-primary" size={24} />
                App Branding
              </CardTitle>
              <CardDescription>Customize the visual identity of Kitchen Prof.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-muted shadow-inner bg-muted/20">
                  {logo && (
                    <Image 
                      src={logo.imageUrl} 
                      alt="Current Logo" 
                      fill 
                      className="object-cover"
                      data-ai-hint={logo.imageHint}
                    />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg">App Logo</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      To update your logo across the entire app (Sidebar, Favicon, and Mobile Home Screen), please edit the following configuration file:
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-muted/50 border flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <FileCode className="text-primary" size={20} />
                      <code className="text-xs font-mono font-bold text-primary">src/app/lib/placeholder-images.json</code>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopy('src/app/lib/placeholder-images.json', 'File path')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy size={14} className="mr-2" /> Copy Path
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-xs text-amber-800 flex items-center gap-2">
                      <Info size={14} className="shrink-0" />
                      Tip: Upload your image to the <strong>public/</strong> folder and then update the <strong>imageUrl</strong> in the JSON file to point to your new file (e.g. "/my-logo.png").
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Section */}
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Crown className="text-primary" size={24} />
                    Current Plan
                  </CardTitle>
                  <CardDescription>Control your restaurant's access level.</CardDescription>
                </div>
                <Badge className={subscription.plan === 'pro' ? 'bg-primary' : 'bg-muted text-muted-foreground'}>
                  {subscription.plan.toUpperCase()} PLAN
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                <div className="space-y-4 flex-1">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg capitalize">{subscription.plan} Member</h3>
                    <p className="text-sm text-muted-foreground">
                      Next billing date: <span className="font-medium text-foreground">{new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-lg border bg-muted/5">
                      <p className="text-[10px] font-bold uppercase text-primary mb-2 flex items-center gap-1">
                        <Info size={10} /> Free Tier Includes
                      </p>
                      <ul className="space-y-1.5">
                        <li className="text-[11px] flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-primary" /> Basic Stock Taking
                        </li>
                        <li className="text-[11px] flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-primary" /> 3 AI Audits / Month
                        </li>
                        <li className="text-[11px] flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-primary" /> Market Trend Updates
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg border bg-primary/5 border-primary/10">
                      <p className="text-[10px] font-bold uppercase text-primary mb-2 flex items-center gap-1">
                        <Zap size={10} /> Pro Benefits
                      </p>
                      <ul className="space-y-1.5">
                        <li className="text-[11px] flex items-center gap-2 font-bold text-primary">
                          <Calculator size={12} /> Full Plate Costing Tool
                        </li>
                        <li className="text-[11px] flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-primary" /> Unlimited AI Audits
                        </li>
                        <li className="text-[11px] flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-primary" /> Advanced Procurement
                        </li>
                        <li className="text-[11px] flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-primary" /> Multi-Staff Access
                        </li>
                        <li className="text-[11px] flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-primary" /> Priority Market Sync
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {subscription.plan === 'free' && (
                  <div className="shrink-0 pt-2">
                    <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 rounded-xl h-14 px-8 shadow-lg group flex flex-col items-center gap-0 leading-tight">
                          <span className="flex items-center gap-2 text-lg">
                            <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            Upgrade to Pro
                          </span>
                          <span className="text-[10px] opacity-90 font-bold uppercase tracking-widest mt-1">₦11,000 / month</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                            <Sparkles className="text-primary" />
                            Activate Pro Account
                          </DialogTitle>
                          <DialogDescription>
                            Complete your payment to unlock professional margin analysis.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                          <div className="space-y-4">
                            {paystackConfig && (
                              <PaystackActivateButton 
                                config={paystackConfig} 
                                onSuccess={onSuccess} 
                                onClose={onClose} 
                              />
                            )}
                            
                            <div className="relative w-full py-2">
                              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                              <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white px-2 text-muted-foreground">Or Pay via Bank Transfer</span></div>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-2xl border-2 border-primary/10 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Bank Name</span>
                                <span className="text-sm font-bold">{OFFICIAL_PAYMENT_INFO.bankName}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Account Number</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-mono font-bold">{OFFICIAL_PAYMENT_INFO.accountNumber}</span>
                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(OFFICIAL_PAYMENT_INFO.accountNumber, "Account Number")}>
                                    <Copy size={12} />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Account Name</span>
                                <span className="text-sm font-bold">{OFFICIAL_PAYMENT_INFO.accountName}</span>
                              </div>
                            </div>

                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-1">
                              <p className="text-[10px] font-bold text-primary uppercase">Payment Reference</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-mono font-black text-primary">{OFFICIAL_PAYMENT_INFO.reference}</span>
                                <Button variant="outline" size="sm" className="h-8 border-primary/20 text-primary" onClick={() => handleCopy(OFFICIAL_PAYMENT_INFO.reference, "Reference")}>
                                  <Copy size={14} className="mr-2" /> Copy
                                </Button>
                              </div>
                            </div>

                            <Button variant="outline" className="w-full h-12 text-muted-foreground" onClick={() => {
                              upgradePlan('pro');
                              setIsUpgradeOpen(false);
                              toast({ title: "Transfer Notification Sent", description: "Our team will verify your transfer and activate your Pro status within 24 hours." });
                            }}>
                              I've already transferred ₦11,000
                            </Button>
                          </div>
                        </div>
                        <DialogFooter className="text-[10px] text-center text-muted-foreground flex flex-col items-center">
                          <div className="flex items-center gap-1 mb-1">
                            <ShieldCheck size={10} /> Secure Platform Billing
                          </div>
                          Questions? Email legal@kitchenprof.ng
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Saved Payment Methods</CardTitle>
                <CardDescription>Your personal methods for market procurement.</CardDescription>
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
                Payments are processed through Paystack, a PCI DSS Level 1 certified processor. Kitchen Prof does not store your card details.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell size={18} />
                Monetization Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="bg-accent/10 p-4 rounded-xl space-y-2">
                <p className="text-xs font-bold text-primary">REVENUE OPPORTUNITY</p>
                <p className="text-sm">Partner with suppliers to offer 1-click replenishment and earn 2-5% commission per order.</p>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary font-bold">
                  Learn how <ChevronRight size={12} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
