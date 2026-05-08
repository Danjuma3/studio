
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useInventory } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  ShieldCheck, 
  Crown,
  Sparkles,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Save,
  Megaphone,
  HelpCircle,
  UploadCloud,
  CreditCard,
  Globe,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { usePaystackPayment } from 'react-paystack';
import { Switch } from '@/components/ui/switch';
import { getSafeLogoUrl } from '@/app/lib/branding';
import { BrandedLogo } from '@/components/BrandedLogo';

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
    subscription, 
    upgradePlan,
    systemPayment,
    updateSystemPaymentConfig,
    systemAlert,
    updateSystemAlert,
    location
  } = useInventory();
  
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [adminConfig, setAdminConfig] = useState(systemPayment);
  const [adminAlert, setAdminAlert] = useState(systemAlert);
  
  const hasSyncedConfig = useRef(false);
  const hasSyncedAlert = useRef(false);

  const isAdmin = user?.email === 'chefdtanju@gmail.com';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (systemPayment && !hasSyncedConfig.current) {
      setAdminConfig(systemPayment);
      hasSyncedConfig.current = true;
    }
  }, [systemPayment]);

  useEffect(() => {
    if (systemAlert && !hasSyncedAlert.current) {
      setAdminAlert(systemAlert);
      hasSyncedAlert.current = true;
    }
  }, [systemAlert]);

  const paymentReference = useMemo(() => {
    return `KP-${user?.uid?.substring(0, 6).toUpperCase() || 'USER'}-${Date.now()}`;
  }, [user]);

  const paystackConfig = useMemo(() => {
    if (!mounted || !user || !systemPayment?.paystackPublicKey) return null;
    return {
      reference: paymentReference,
      email: user?.email || "customer@kitchenprof.ng",
      amount: (systemPayment?.proPrice || 0) * 100,
      publicKey: systemPayment.paystackPublicKey,
    };
  }, [mounted, user, systemPayment, paymentReference]);

  const handleAdminSave = () => {
    updateSystemPaymentConfig(adminConfig);
    toast({
      title: "Settings Updated",
      description: "Platform system configuration has been updated successfully.",
    });
  };

  const handleAlertSave = () => {
    updateSystemAlert(adminAlert);
    toast({
      title: "Alert Broadcasted",
      description: "The market alert has been updated for all users.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please choose an image smaller than 10MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminConfig({ ...adminConfig, appLogoUrl: reader.result as string });
        toast({
          title: "Photo Ready",
          description: "Your photo has been prepared. Click 'Save System Settings' to apply.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSuccess = (reference: any) => {
    upgradePlan('pro');
    setIsUpgradeOpen(false);
    toast({
      title: "Payment Successful!",
      description: "Your Pro features have been unlocked.",
    });
  };

  const handleGlobalCreditCard = () => {
    toast({
      title: "Processing Payment",
      description: "Connecting to secure payment hub...",
    });
    setTimeout(() => {
      upgradePlan('pro');
      setIsUpgradeOpen(false);
      toast({
        title: "Plan Active",
        description: "Your professional margins are now unlocked.",
      });
    }, 2000);
  };

  const onClose = () => {
    toast({
      variant: "destructive",
      title: "Payment Cancelled",
      description: "You closed the payment window.",
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

  const currentLogoUrl = getSafeLogoUrl(systemPayment?.appLogoUrl);
  const isAfricanRegion = location.currency === 'NGN';
  
  const proDisplayPrice = isAfricanRegion 
    ? `${location.currencySymbol}${(systemPayment?.proPrice || 17000).toLocaleString()}`
    : `$${(systemPayment?.proPriceUSD || 14.99).toLocaleString()}`;

  const planFeatures = [
    { name: "Ingredient Inventory", free: true, pro: true },
    { name: "Recipe Composer (Batch Costing)", free: true, pro: true },
    { name: "Manual Market Updates", free: true, pro: true },
    { name: "Plate Costing (Cost % Analysis)", free: false, pro: true },
    { name: "AI Procurement Strategy Audit", free: false, pro: true },
    { name: "Historical Price Trend Charts", free: false, pro: true },
    { name: "Regional Hub Detection", free: false, pro: true },
    { name: "Supply Alerts", free: false, pro: true },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings & Billing</h1>
        <p className="text-muted-foreground text-sm">Manage your business profile, subscription, and branding.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {isAdmin && (
            <div className="space-y-6">
              <Card className="border-2 border-primary/20 shadow-xl overflow-hidden bg-white">
                <CardHeader className="bg-primary/10 border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <ShieldCheck className="text-primary" size={24} />
                    Platform Admin: System Config
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <ImageIcon size={16} /> App Branding
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                              <HelpCircle size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-4 space-y-2">
                            <div className="text-xs font-bold">Branding Guide:</div>
                            <div className="text-[10px] leading-relaxed space-y-2">
                              <div><strong>1. Easy Upload:</strong> Use the "Choose Photo" button (up to 10MB).</div>
                              <div><strong>2. Public Folder:</strong> Reference by path (e.g., <code>/logo.png</code>).</div>
                              <div><strong>3. Base64:</strong> Directly paste string data.</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-dashed">
                        <Label className="flex items-center gap-2">
                          <UploadCloud size={14} className="text-primary" />
                          Built-in Photo Converter
                        </Label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="w-full text-xs h-10 bg-white cursor-pointer border rounded-md p-1"
                        />
                        <div className="text-[10px] text-muted-foreground">Supports high-res photos up to 10MB.</div>
                      </div>

                      <div className="space-y-3">
                        <Label>Direct URL / Path / String</Label>
                        <Input 
                          placeholder="e.g. /logo.png or data:image/..."
                          value={adminConfig?.appLogoUrl || ''} 
                          onChange={(e) => setAdminConfig({...adminConfig, appLogoUrl: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Globe size={16} /> Pricing & Keys
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Regional Price (₦)</Label><Input type="number" value={adminConfig?.proPrice || 0} onChange={(e) => setAdminConfig({...adminConfig, proPrice: parseFloat(e.target.value) || 0})}/></div>
                      <div className="space-y-2"><Label>International Price ($)</Label><Input type="number" step="0.01" value={adminConfig?.proPriceUSD || 0} onChange={(e) => setAdminConfig({...adminConfig, proPriceUSD: parseFloat(e.target.value) || 0})}/></div>
                      <div className="space-y-2"><Label>Paystack Public Key</Label><Input value={adminConfig?.paystackPublicKey || ''} onChange={(e) => setAdminConfig({...adminConfig, paystackPublicKey: e.target.value})}/></div>
                      <div className="space-y-2"><Label>International Gateway Key</Label><Input value={adminConfig?.globalStripePublicKey || ''} onChange={(e) => setAdminConfig({...adminConfig, globalStripePublicKey: e.target.value})}/></div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Building2 size={16} /> Bank Details (Regional)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Bank Name</Label><Input value={adminConfig?.bankName || ''} onChange={(e) => setAdminConfig({...adminConfig, bankName: e.target.value})}/></div>
                      <div className="space-y-2"><Label>Account Number</Label><Input value={adminConfig?.accountNumber || ''} onChange={(e) => setAdminConfig({...adminConfig, accountNumber: e.target.value})}/></div>
                      <div className="space-y-2"><Label>Account Name</Label><Input value={adminConfig?.accountName || ''} onChange={(e) => setAdminConfig({...adminConfig, accountName: e.target.value})}/></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-4 border-t flex justify-end">
                  <Button onClick={handleAdminSave} className="bg-primary gap-2"><Save size={18} />Save System Settings</Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-accent/20 shadow-xl overflow-hidden bg-white">
                <CardHeader className="bg-accent/10 border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Megaphone className="text-primary" size={24} />
                    Platform Admin: Market Alert Broadcast
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Alert Message</Label>
                    <Input 
                      placeholder="e.g. URGENT: Market supply delays detected!"
                      value={adminAlert?.message || ''}
                      onChange={(e) => setAdminAlert({...adminAlert, message: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Alert Type</Label>
                      <select 
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={adminAlert?.type || 'info'}
                        onChange={(e) => setAdminAlert({...adminAlert, type: e.target.value as any})}
                      >
                        <option value="info">Information</option>
                        <option value="warning">General Warning</option>
                        <option value="market">Market News</option>
                        <option value="urgent">Urgent Alert</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 pt-8">
                      <Switch 
                        checked={adminAlert?.active || false}
                        onCheckedChange={(checked) => setAdminAlert({...adminAlert, active: checked})}
                      />
                      <Label>Broadcast Active</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-4 border-t flex justify-end">
                  <Button onClick={handleAlertSave} variant="secondary" className="gap-2">
                    <Megaphone size={18} />
                    Broadcast to All Users
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <ImageIcon className="text-primary" size={24} />
                App Branding
              </CardTitle>
              <div className="text-sm text-muted-foreground">Visual identity of Kitchen Prof.</div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <BrandedLogo 
                  url={currentLogoUrl} 
                  size={128} 
                  className="rounded-3xl border-4 border-muted" 
                />
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <div className="font-bold text-lg">Identity Control</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      Branding is managed centrally by the platform administrator to ensure a consistent experience across all regions.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Crown className="text-primary" size={24} />
                    Plan Comparison
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">Compare features between Free and Pro packages.</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left p-4 font-bold">Feature</th>
                      <th className="text-center p-4 font-bold">Free</th>
                      <th className="text-center p-4 font-bold text-primary">Pro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {planFeatures.map((feature, idx) => (
                      <tr key={idx} className="hover:bg-muted/5">
                        <td className="p-4 text-muted-foreground font-medium">{feature.name}</td>
                        <td className="p-4 text-center">
                          {feature.free ? (
                            <CheckCircle2 className="mx-auto text-primary" size={18} />
                          ) : (
                            <XCircle className="mx-auto text-muted-foreground/30" size={18} />
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {feature.pro ? (
                            <CheckCircle2 className="mx-auto text-primary" size={18} />
                          ) : (
                            <XCircle className="mx-auto text-muted-foreground/30" size={18} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="text-primary" size={20} />
                    Current Plan
                  </CardTitle>
                </div>
                <Badge className={subscription?.plan === 'pro' ? 'bg-primary' : 'bg-muted text-muted-foreground'}>
                  {(subscription?.plan || 'free').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hub Location</span>
                  <span className="text-sm font-bold">{location.city}, {location.country}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Billing Status</span>
                  <span className="text-sm font-bold text-green-600">Active</span>
                </div>
                
                {subscription?.plan === 'free' && (
                  <div className="pt-4 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full h-14 bg-primary hover:bg-primary/90 rounded-xl shadow-lg group flex flex-col items-center gap-0 leading-tight">
                          <div className="flex items-center gap-2 text-lg">
                            <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            Upgrade to Pro
                          </div>
                          <div className="text-[10px] opacity-90 font-bold uppercase tracking-widest mt-1">{proDisplayPrice} / month</div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                            <Sparkles className="text-primary" />
                            Pro Activation
                          </DialogTitle>
                          <DialogDescription>
                            Confirm your payment details below to unlock professional margin tools.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                          <div className="space-y-3">
                            <div className="text-sm text-muted-foreground">Select your preferred payment method for the <strong>{location.country}</strong> hub.</div>
                            
                            {isAfricanRegion ? (
                              <div className="space-y-3">
                                {paystackConfig && (
                                  <PaystackActivateButton 
                                    config={paystackConfig} 
                                    onSuccess={onSuccess} 
                                    onClose={onClose} 
                                  />
                                )}
                                <div className="relative w-full py-2">
                                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                  <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white px-2 text-muted-foreground">Or Local Bank Transfer</span></div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-2xl border-2 border-primary/10 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Bank Name</span>
                                    <span className="text-sm font-bold">{systemPayment?.bankName || 'Hub Bank'}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Account Number</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-mono font-bold">{systemPayment?.accountNumber || '0000000000'}</span>
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(systemPayment?.accountNumber || '0000000000', "Account Number")}>
                                        <Copy size={12} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <Button 
                                  onClick={handleGlobalCreditCard}
                                  className="w-full h-12 gap-2 bg-black text-white hover:bg-black/90 shadow-lg"
                                >
                                  <CreditCard size={18} />
                                  Credit Card
                                </Button>
                                <Button variant="outline" className="w-full h-12 gap-2 border-dashed">
                                  <Globe size={18} />
                                  International Wire
                                </Button>
                                <div className="text-[10px] text-center text-muted-foreground italic">
                                  Payments are processed via secure international gateway nodes.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck size={20} />
                Secure Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm opacity-90 leading-relaxed">
                Payments are processed through regional secure nodes (Paystack/Stripe). Kitchen Prof does not store sensitive card data.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
