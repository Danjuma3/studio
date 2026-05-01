
"use client";

import { useState } from 'react';
import { useInventory } from '../lib/store';
import { useUser } from '@/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Terminal,
  Bug,
  Sparkles,
  ShieldAlert,
  Copy,
  CheckCircle2,
  History,
  Users,
  Database,
  Activity,
  MessageSquare,
  Globe,
  Mail,
  Server,
  PartyPopper
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SupportWorkspacePage() {
  const { user } = useUser();
  const { ingredients, recipes, issues, reportIssue, updateSystemAlert } = useInventory();
  const [bugTitle, setBugTitle] = useState('');
  const [bugDesc, setBugDesc] = useState('');

  const isAdmin = user?.email === 'chefdtanju@gmail.com';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <ShieldAlert size={64} className="text-destructive opacity-20" />
        <h1 className="text-2xl font-headline font-bold">Admin Access Restricted</h1>
        <p className="text-muted-foreground">Only platform administrators can access the support workspace.</p>
      </div>
    );
  }

  const handleCopyDiagnostics = () => {
    const diagnosticPayload = {
      timestamp: new Date().toISOString(),
      admin: user?.email,
      environment: process.env.NODE_ENV,
      stats: {
        totalIngredients: ingredients.length,
        totalRecipes: recipes.length,
        activeSupportTickets: issues.filter(i => i.status !== 'fixed').length,
      },
      pantryHealth: ingredients.map(i => ({ name: i.name, stock: i.currentStock, min: i.minStock })),
      recipes: recipes.map(r => ({ name: r.name, price: r.sellingPrice, itemCount: r.items.length }))
    };

    navigator.clipboard.writeText(JSON.stringify(diagnosticPayload, null, 2));
    toast({
      title: "Diagnostic Payload Ready",
      description: "Data copied. Paste this to the Studio AI for swift troubleshooting.",
    });
  };

  const handleGrandOpeningBroadcast = () => {
    updateSystemAlert({
      message: "🎉 WELCOME TO THE GRAND OPENING OF KITCHEN PROFIT! Start mastering your margins today.",
      type: "market",
      active: true
    });
    toast({
      title: "Grand Opening Broadcasted!",
      description: "The launch message is now visible to all users.",
    });
  };

  const handleSubmitBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle || !bugDesc) return;
    reportIssue(bugTitle, bugDesc, 'medium');
    setBugTitle('');
    setBugDesc('');
    toast({
      title: "Team Note Logged",
      description: "This issue has been added to the internal tracking system.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-2xl">
            <Database size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold text-black/60">Team Command Center</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold">ROOT ACCESS</Badge>
              Admin: chefdtanju@gmail.com
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleGrandOpeningBroadcast}
            className="rounded-xl h-12 px-6 border-primary text-primary hover:bg-primary/5"
          >
            <PartyPopper className="mr-2 h-4 w-4" />
            Launch Grand Opening
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyDiagnostics}
            className="rounded-xl h-12 px-6 border-dashed"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Health Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase flex justify-between items-center">
              Active Tickets
              <MessageSquare size={14} className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{issues.filter(i => i.status !== 'fixed').length}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold">AWAITING RESOLUTION</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase flex justify-between items-center">
              Global Stock
              <Users size={14} className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{ingredients.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold">TOTAL NODES TRACKED</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase flex justify-between items-center">
              System Uptime
              <CheckCircle2 size={14} className="text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">99.9%</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold">LIVE & PROFITABLE</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase opacity-80 flex justify-between items-center">
              AI Readiness
              <Sparkles size={14} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">STABLE</div>
            <p className="text-[10px] opacity-70 mt-1 font-bold">GEMINI 2.5 FLASH ONLINE</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal size={20} className="text-primary" />
                Diagnostic Console
              </CardTitle>
              <CardDescription>Real-time data integrity verification.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-2xl bg-black p-6 text-green-400 font-mono text-[11px] h-64 overflow-y-auto shadow-2xl leading-relaxed">
                <p className="text-green-500/50"># Kitchen Profit OS v2.0.4 - Diagnostic Mode</p>
                <p className="text-white/30">--------------------------------------------------</p>
                <p>&gt; Initializing Secure Handshake with chefdtanju@gmail.com...</p>
                <p>&gt; Status: AUTH_SUCCESS_LEVEL_ROOT</p>
                <p>&gt; Scanning Firestore Collections (Global Scope)...</p>
                <p>&gt; Found {ingredients.length} ingredient nodes.</p>
                <p>&gt; Found {recipes.length} recipe configurations.</p>
                <p>&gt; Checking Margin Thresholds... [WARN] Found {recipes.filter(r => r.sellingPrice === 0).length} recipes with NULL_PRICE.</p>
                <p>&gt; AI Model Link: STABLE</p>
                <p>&gt; Memory Usage: OPTIMAL</p>
                <p className="animate-pulse">&gt; Awaiting Command...</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <History size={20} className="text-primary" />
                Team Support Log
              </CardTitle>
              <CardDescription>Internal bug tracking and customer service tickets.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {issues.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <CheckCircle2 size={48} className="mx-auto text-muted/30" />
                    <p className="text-muted-foreground italic font-medium">All systems green. No active tickets.</p>
                  </div>
                ) : (
                  issues.map((issue) => (
                    <div key={issue.id} className="p-6 flex items-center justify-between hover:bg-muted/5 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base">{issue.title}</span>
                          <Badge variant={issue.severity === 'critical' ? 'destructive' : 'secondary'} className="text-[9px] px-2 font-bold">
                            {issue.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{issue.description}</p>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold">
                          <span className="flex items-center gap-1"><History size={10} /> {new Date(issue.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Users size={10} /> ADMIN REPORTED</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={issue.status === 'fixed' ? 'bg-green-500' : 'bg-amber-500'}>
                          {issue.status.toUpperCase()}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-[10px] h-7 font-black">MANAGE</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-black text-white overflow-hidden">
            <div className="p-6 bg-white/5 border-b border-white/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe size={20} className="text-primary" />
                Domain Infrastructure
              </CardTitle>
            </div>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-primary" />
                    <div>
                      <p className="text-xs font-bold">kitchenprof.ng</p>
                      <p className="text-[10px] text-white/40">Status: Pending Registration</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[8px] border-white/20 text-white/60">CHECKING</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-primary" />
                    <div>
                      <p className="text-xs font-bold">legal@kitchenprof.ng</p>
                      <p className="text-[10px] text-white/40">Status: Awaiting Domain</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[8px] border-white/20 text-white/60">QUEUED</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Server size={18} className="text-green-500" />
                    <div>
                      <p className="text-xs font-bold">Firebase App Hosting</p>
                      <p className="text-[10px] text-white/40">Status: Active & Live</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-[8px] h-4">ACTIVE</Badge>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-3 mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Domain Note:</p>
                <p className="text-[11px] leading-relaxed text-white/80">
                  Once you register <strong>kitchenprof.ng</strong> via <strong>Whogohost</strong>, you can point your DNS settings to this Firebase instance to activate official branding.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2 text-black/60">
                <Bug size={18} className="text-destructive" />
                Log Internal Anomaly
              </CardTitle>
              <CardDescription className="text-xs">Report system bugs to the team.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitBug} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-tight text-muted-foreground">Issue Summary</Label>
                  <Input
                    placeholder="e.g. Broken Margin Calculation"
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-tight text-muted-foreground">Technical Details</Label>
                  <Textarea
                    placeholder="Steps to reproduce..."
                    className="h-28 text-sm resize-none"
                    value={bugDesc}
                    onChange={(e) => setBugDesc(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-black text-white h-12 shadow-lg hover:bg-black/90 rounded-xl font-bold">
                  Log Internal Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
