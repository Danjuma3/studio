
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
  FileCode,
  Save
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
  const { 
    paymentMethods, 
    addPaymentMethod, 
    deletePaymentMethod, 
    setDefaultPaymentMethod, 
    subscription, 
    upgradePlan,
    systemPayment,
    updateSystemPaymentConfig
  } = useInventory();
  
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Admin Edit State
  const [adminConfig, setAdminConfig] = useState(systemPayment);
  
  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');
  const isAdmin = user?.email === 'chefdtanju@gmail.com';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (systemPayment) {
      setAdminConfig(systemPayment);
    }
  }, [systemPayment]);

  const [newMethod, setNewMethod] = useState({
    type: 'bank_transfer' as const,
    provider: '',
    accountName: '',
    lastFour: '',
    isDefault: false
  });

  const paymentReference = useMemo(() => {
    return `KP-${user?.uid?.substring(0, 6).toUpperCase() || 'USER'}-${Date.now()}`;
  }, [user]);

  // Paystack Config
  const paystackConfig = useMemo(() => {
    if (!mounted || !user || !systemPayment?.paystackPublicKey) return null;
    return {
      reference: paymentReference,
      email: user?.email || "customer@kitchenprof.ng",
      amount: systemPayment.proPrice * 100,
      publicKey: systemPayment.paystackPublicKey,
    };
  }, [mounted, user, systemPayment, paymentReference]);

  const handleAdminSave = () => {
    updateSystemPaymentConfig(adminConfig);
    toast({
      title: "Settings Updated",
      description: "Global payment details have been updated successfully.",
    });
  };

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
          
          {/* Admin Payment Settings (Only for Admin) */}
          {isAdmin && (
            <Card className="border-2 border-primary/20 shadow-xl overflow-hidden bg-white animate-in slide-in-from-top duration-500">
              <CardHeader className="bg-primary/10 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldCheck className="text-primary" size={24} />
                  Platform Admin: Payment Config
                </CardTitle>
                <CardDescription>Update the global account details end-users see when upgrading.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input 
                      value={adminConfig.bankName} 
                      onChange={(e) => setAdminConfig({...adminConfig, bankName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input 
                      value={adminConfig.accountNumber} 
                      onChange={(e) => setAdminConfig({...adminConfig, accountNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input 
                      value={adminConfig.accountName} 
                      onChange={(e) => setAdminConfig({...adminConfig, accountName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Pro Price (₦)</Label>
                    <Input 
                      type="number"
                      value={adminConfig.proPrice} 
                      onChange={(e) => setAdminConfig({...adminConfig, proPrice: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Paystack Public Key</Label>
                  <Input 
                    value={adminConfig.paystackPublicKey} 
                    onChange={(e) => setAdminConfig({...adminConfig, paystackPublicKey: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-4 border-t flex justify-end">
                <Button onClick={handleAdminSave} className="bg-primary gap-2">
                  <Save size={18} />
                  Save Global Settings
                </Button>
              </CardFooter>
            </Card>
          )}

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
                      To update your logo across the entire app, please edit:
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
                  <h3 className="font-bold text-lg capitalize">{subscription.plan} Member</h3>
                  <p className="text-sm text-muted-foreground">
                    Next billing: <span className="font-medium text-foreground">{new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                  </p>
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
                          <span className="text-[10px] opacity-90 font-bold uppercase tracking-widest mt-1">₦{systemPayment.proPrice.toLocaleString()} / month</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                            <Sparkles className="text-primary" />
                            Activate Pro Account
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
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
                              <span className="text-sm font-bold">{systemPayment.bankName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Account Number</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono font-bold">{systemPayment.accountNumber}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(systemPayment.accountNumber, "Account Number")}>
                                  <Copy size={12} />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Account Name</span>
                              <span className="text-sm font-bold">{systemPayment.accountName}</span>
                            </div>
                          </div>

                          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-1">
                            <p className="text-[10px] font-bold text-primary uppercase">Payment Reference</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-mono font-black text-primary">{paymentReference.split('-')[1]}</span>
                              <Button variant="outline" size="sm" className="h-8 border-primary/20 text-primary" onClick={() => handleCopy(paymentReference.split('-')[1], "Reference")}>
                                <Copy size={14} className="mr-2" /> Copy
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
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
                Payments are processed through Paystack. Kitchen Prof does not store your card details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
