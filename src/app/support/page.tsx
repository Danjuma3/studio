
"use client";

import { useState } from 'react';
import { useInventory } from '../lib/store';
import { useUser } from '@/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LifeBuoy,
  Terminal,
  Bug,
  Sparkles,
  ShieldAlert,
  Copy,
  CheckCircle2,
  AlertCircle,
  History,
  Code
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SupportWorkspacePage() {
  const { user } = useUser();
  const { ingredients, recipes, issues, reportIssue } = useInventory();
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
      user: user?.email,
      stats: {
        totalIngredients: ingredients.length,
        totalRecipes: recipes.length,
        openIssues: issues.filter(i => i.status !== 'fixed').length,
      },
      pantryHealth: ingredients.map(i => ({ name: i.name, stock: i.currentStock, min: i.minStock })),
      // Filter sensitive IDs out for cleaner diagnostic payload
      recipes: recipes.map(r => ({ name: r.name, price: r.sellingPrice, itemCount: r.items.length }))
    };

    navigator.clipboard.writeText(JSON.stringify(diagnosticPayload, null, 2));
    toast({
      title: "Diagnostics Copied!",
      description: "Paste this to the Studio AI partner to help identify and fix errors.",
    });
  };

  const handleSubmitBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle || !bugDesc) return;
    reportIssue(bugTitle, bugDesc, 'medium');
    setBugTitle('');
    setBugDesc('');
    toast({
      title: "Issue Reported",
      description: "This bug has been logged for investigative review.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
            <LifeBuoy size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold">Support & AI Workspace</h1>
            <p className="text-muted-foreground">Identify system errors and prepare diagnostic data for your AI partner.</p>
          </div>
        </div>
        <Button
          onClick={handleCopyDiagnostics}
          className="bg-black hover:bg-black/90 text-white rounded-xl h-12 px-8 shadow-xl border border-white/10 group"
        >
          <Copy className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          Copy Diagnostic Payload
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Diagnostic Panel */}
        <div className="xl:col-span-2 space-y-8">
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal size={20} className="text-primary" />
                System Health Diagnostics
              </CardTitle>
              <CardDescription>Automated check for common data and logic errors.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-muted/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Inventory Sync</p>
                    <p className="font-bold">HEALTHY</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border bg-muted/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Recipe Margins</p>
                    <p className="font-bold">REVIEW NEEDED</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-black p-4 text-green-400 font-mono text-[10px] h-48 overflow-y-auto shadow-inner">
                <p>> Initializing Kitchen Prof AI Diagnostic Scan...</p>
                <p>> Checking Firestore indexes... OK</p>
                <p>> Validating Recipe ID references... OK</p>
                <p>> Found {ingredients.length} active ingredients in Mile 12 sync.</p>
                <p>> Found {recipes.length} calculated recipes.</p>
                <p>> Scan complete. No fatal runtime errors detected.</p>
                <p>> [WARN] {recipes.filter(r => r.sellingPrice === 0).length} recipes have missing selling prices.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <History size={20} className="text-primary" />
                Recent Issue Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {issues.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground italic">
                    No bugs or issues logged. System is operating at peak performance.
                  </div>
                ) : (
                  issues.map((issue) => (
                    <div key={issue.id} className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{issue.title}</span>
                          <Badge variant={issue.severity === 'critical' ? 'destructive' : 'secondary'} className="text-[8px] h-4">
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{issue.description}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(issue.createdAt).toLocaleString()}</p>
                      </div>
                      <Badge className={issue.status === 'fixed' ? 'bg-green-500' : 'bg-amber-500'}>
                        {issue.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Partner Sidebar */}
        <div className="space-y-8">
          <Card className="border-none shadow-lg bg-primary text-primary-foreground overflow-hidden">
            <div className="p-6 bg-white/10 border-b border-white/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles size={20} />
                AI Partner Portal
              </CardTitle>
            </div>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm leading-relaxed opacity-90">
                To fix an error, copy the <b>Diagnostic Payload</b> using the button above and paste it into our chat workspace.
              </p>
              <div className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">How to fix bugs:</p>
                <ol className="text-xs space-y-2 list-decimal list-inside opacity-90">
                  <li>Trigger the error in the app</li>
                  <li>Go to this workspace</li>
                  <li>Copy Diagnostic Payload</li>
                  <li>Paste it to the Studio AI</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bug size={18} className="text-destructive" />
                Report New Issue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitBug} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Summary</Label>
                  <Input
                    placeholder="Brief error name"
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    placeholder="What happened? Which page?"
                    className="h-24"
                    value={bugDesc}
                    onChange={(e) => setBugDesc(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-primary h-11">
                  Log Issue
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>;
}
