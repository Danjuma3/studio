
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
  Info
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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Switch } from '@/components/ui/switch';

// Helper to ensure a valid URL is always passed to the Image component
function getSafeLogoUrl(url?: string): string {
  const fallback = 'https://picsum.photos/seed/kitchen-prof-logo/512/512';
  
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    const placeholder = PlaceHolderImages.find(img => img.id === 'app-logo');
    return placeholder?.imageUrl || fallback;
  }
  
  const trimmed = url.trim();

  // Handle standard paths and already-prefixed Base64
  if (trimmed.startsWith('/') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Heuristic: If it's a very long string with no spaces, it's likely a raw Base64 that needs a prefix
  if (trimmed.length > 100 && !trimmed.includes(' ')) {
    return `data:image/png;base64,${trimmed}`;
  }
  
  // Validate as a standard URL
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    return fallback;
  }
}

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
    updateSystemAlert
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

  if (!mounted) return null;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings & Billing</h1>
        <p className="text-muted-foreground">Manage your business profile, subscription, and branding.</p>
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
                            <p className="text-xs font-bold">How to use your own photo:</p>
                            <div className="text-[10px] leading-relaxed space-y-2">
                              <p><strong>1. Public Folder:</strong> Reference by filename (e.g., <code>/my-logo.png</code>).</p>
                              <p><strong>2. Base64:</strong> Use an "Image to Base64" converter. Paste the string and the app will fix it.</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="space-y-2">
                      <Label>App Logo URL / Path / Base64</Label>
                      <div className="flex flex-col gap-2">
                        <Input 
                          placeholder="e.g. data:image/png;base64,..."
                          value={adminConfig.appLogoUrl || ''} 
                          onChange={(e) => setAdminConfig({...adminConfig, appLogoUrl: e.target.value})}
                        />
                        <div className="flex flex-wrap items-center gap-4">
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <UploadCloud size={10} /> 
                            Path: /filename.png
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <FileCode size={10} /> 
                            Supports Base64 Strings
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Building2 size={16} /> Payment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Bank Name</Label><Input value={adminConfig.bankName} onChange={(e) => setAdminConfig({...adminConfig, bankName: e.target.value})}/></div>
                      <div className="space-y-2"><Label>Account Number</Label><Input value={adminConfig.accountNumber} onChange={(e) => setAdminConfig({...adminConfig, accountNumber: e.target.value})}/></div>
                      <div className="space-y-2"><Label>Account Name</Label><Input value={adminConfig.accountName} onChange={(e) => setAdminConfig({...adminConfig, accountName: e.target.value})}/></div>
                      <div className="space-y-2"><Label>Pro Price (₦)</Label><Input type="number" value={adminConfig.proPrice} onChange={(e) => setAdminConfig({...adminConfig, proPrice: parseFloat(e.target.value) || 0})}/></div>
                    </div>
                    <div className="space-y-2"><Label>Paystack Public Key</Label><Input value={adminConfig.paystackPublicKey} onChange={(e) => setAdminConfig({...adminConfig, paystackPublicKey: e.target.value})}/></div>
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
                      placeholder="e.g. URGENT: Beef prices up at Oko-Oba abattoir!"
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
              <CardDescription>Visual identity of Kitchen Prof.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-muted shadow-inner bg-muted/20">
                  <Image 
                    src={getSafeLogoUrl(systemPayment?.appLogoUrl)} 
                    alt="Current Logo" 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg">Identity Control</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isAdmin 
                        ? "You are managing the branding dynamically. Your updates will affect all user dashboards instantly." 
                        : "Branding is managed centrally by the platform administrator."}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border border-dashed flex items-center gap-3">
                    <HelpCircle className="text-primary" size={20} />
                    <p className="text-xs text-muted-foreground">
                      Base64 strings are auto-detected. Paste the string and the app will handle the formatting.
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
                    Current Plan
                  </CardTitle>
                  <CardDescription>Control your restaurant's access level.</CardDescription>
                </div>
                <Badge className={subscription.plan === 'pro' ? 'bg-primary' : 'bg-muted text-muted-foreground'}>
                  {subscription.plan.toUpperCase() PLAN}
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
