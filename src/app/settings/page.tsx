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
  FileCode,
  FileImage,
  ChefHat,
  CreditCard,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
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
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { getSafeLogoUrl } from '@/app/lib/branding';

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
      amount: systemPayment.proPrice * 100,
      publicKey: systemPayment.paystackPublicKey,
    };
  }, [mounted, user, systemPayment, paymentReference]);

  const handleAdminSave = () => {
    updateSystemPaymentConfig(adminConfig);
    toast({
      title: "Settings Updated",
      description: "Global system configuration has been updated successfully.",
    });
  };

  const handleAlertSave = () => {
    updateSystemAlert(adminAlert);
    toast({
      title: "Alert Broadcasted",
      description: "The global market alert has been updated for all users.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Increased to 2MB for branding logos
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please choose an image smaller than 2MB for optimal branding.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminConfig({ ...adminConfig, appLogoUrl: reader.result as string });
        toast({
          title: "Photo Converted",
          description: "Your photo has been converted. Click 'Save Global Settings' to apply.",
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
      description: "Your Pro features have been unlocked. Reference: " + reference.reference,
    });
  };

  const handleGlobalCreditCard = () => {
    // Simulated global payment success
    toast({
      title: "Processing Global Credit Card",
      description: "Connecting to global payment hub...",
    });
    setTimeout(() => {
      upgradePlan('pro');
      setIsUpgradeOpen(false);
      toast({
        title: "International Plan Active",
        description: "Your professional global margins are now unlocked.",
      });
    }, 2000);
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

  const currentLogoUrl = getSafeLogoUrl(systemPayment?.appLogoUrl);
  const isAfricanRegion = location.currency === 'NGN';
  const proDisplayPrice = isAfricanRegion 
    ? `${location.currencySymbol}${systemPayment.proPrice.toLocaleString()}`
    : `$${systemPayment.proPriceUSD.toLocaleString()}`;

  if (!mounted) return null;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings & Billing</h1>
        <p className="text-muted-foreground">Manage your business profile, global subscription, and branding.</p>
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
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <ImageIcon size={16} /> App Branding
                      </h3>
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
                              <div><strong>1. Easy Upload:</strong> Use the "Choose Photo" button to convert a local file automatically.</div>
                              <div><strong>2. Public Folder:</strong> Reference by filename (e.g., <code>/logo.png</code>) if hosting locally.</div>
                              <div><strong>3. Base64:</strong> Paste a raw string and the app will auto-prefix it for you.</div>
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
                        <p className="text-[10px] text-muted-foreground">Automatically turns any photo into a branding string.</p>
                      </div>

                      <div className="space-y-3">
                        <Label>Direct URL / Path / String</Label>
                        <Input 
                          placeholder="e.g. /logo.png or data:image/..."
                          value={adminConfig.appLogoUrl || ''} 
                          onChange={(e) => setAdminConfig({...adminConfig, appLogoUrl: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Globe size={16} /> Global Pricing & Keys
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Regional Price (₦)</Label><Input type="number" value={adminConfig.proPrice} onChange={(e) => setAdminConfig({...adminConfig, proPrice: parseFloat(e.target.value) || 0})}/></div>
                      <div className="space-y-2"><Label>Global Price ($)</Label><Input type="number" step="0.01" value={adminConfig.proPriceUSD} onChange={(e) => setAdminConfig({...adminConfig, proPriceUSD: parseFloat(e.target.value) || 0})}/></div>
                      <div className="space-y-2"><Label>Paystack Public Key</Label><Input value={adminConfig.paystackPublicKey} onChange={(e) => setAdminConfig({...adminConfig, paystackPublicKey: e.target.value})}/></div>
                      <div className="space-y-2"><Label>Global Gateway Key</Label><Input value={adminConfig.globalStripePublicKey} onChange={(e) => setAdminConfig({...adminConfig, globalStripePublicKey: e.target.value})}/></div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Building2 size={16} /> Bank Details (Regional)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Bank Name</Label><Input value={adminConfig.bankName} onChange={(e) => setAdminConfig({...adminConfig, bankName: e.target.value})}/></div>
                      <div className="space-y-2"><Label>Account Number</Label><Input value={adminConfig.accountNumber} onChange={(e) => setAdminConfig({...adminConfig, accountNumber: e.target.value})}/></div>
                      <div className="space-y-2"><Label>Account Name</Label><Input value={adminConfig.accountName} onChange={(e) => setAdminConfig({...adminConfig, accountName: e.target.value})}/></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-4 border-t flex justify-end">
                  <Button onClick={handleAdminSave} className="bg-primary gap-2"><Save size={18} />Save Global Settings</Button>
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
                    <Label>Global Alert Message</Label>
                    <Input 
                      placeholder="e.g. URGENT: Global shipping delays detected!"
                      value={adminAlert.message}
                      onChange={(e) => setAdminAlert({...adminAlert, message: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Alert Type</Label>
                      <select 
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={adminAlert.type}
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
                        checked={adminAlert.active}
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
              <CardDescription>Visual identity of Kitchen Profit.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-muted shadow-inner bg-muted/20 flex items-center justify-center">
                  {currentLogoUrl ? (
                    <Image 
                      src={currentLogoUrl} 
                      alt="Current Logo" 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <ChefHat size={48} className="text-primary/20" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg">Identity Control</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Branding is managed centrally by the platform administrator to ensure a consistent global experience.
                    </p>
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
                    Global Subscription
                  </CardTitle>
                  <CardDescription>Manage your access to professional margin tools.</CardDescription>
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
                    Plan status: <span className="font-medium text-foreground">Active ({location.country} Hub)</span>
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
                          <span className="text-[10px] opacity-90 font-bold uppercase tracking-widest mt-1">{proDisplayPrice} / month</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                            <Sparkles className="text-primary" />
                            Global Pro Activation
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">Select your preferred payment method for the <strong>{location.country}</strong> hub.</p>
                            
                            {isAfricanRegion ? (
                              <div className="space-y-3">
                                <PaystackActivateButton 
                                  config={paystackConfig} 
                                  onSuccess={onSuccess} 
                                  onClose={onClose} 
                                />
                                <div className="relative w-full py-2">
                                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                  <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white px-2 text-muted-foreground">Or Local Bank Transfer</span></div>
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
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <Button 
                                  onClick={handleGlobalCreditCard}
                                  className="w-full h-12 gap-2 bg-black text-white hover:bg-black/90 shadow-lg"
                                >
                                  <CreditCard size={18} />
                                  Global Credit Card
                                </Button>
                                <Button variant="outline" className="w-full h-12 gap-2 border-dashed">
                                  <Globe size={18} />
                                  International Wire
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground italic">
                                  Global payments processed via international gateway nodes.
                                </p>
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
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck size={20} />
                Global Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90 leading-relaxed">
                Payments are processed through regional secure nodes (Paystack/Stripe). Kitchen Profit International does not store sensitive card data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
