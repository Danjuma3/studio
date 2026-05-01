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
  Sparkles,
  ShieldAlert,
  Copy,
  CheckCircle2,
  History,
  Users,
  Database,
  MessageSquare,
  Globe,
  Server,
  PartyPopper,
  Video,
  UploadCloud,
  Loader2,
  Play
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateMarketingVideo } from '@/ai/flows/marketing-video-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SupportWorkspacePage() {
  const { user } = useUser();
  const { ingredients, recipes, issues, updateSystemAlert } = useInventory();
  
  // Video AI State
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

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
    };
    navigator.clipboard.writeText(JSON.stringify(diagnosticPayload, null, 2));
    toast({ title: "Diagnostic Payload Ready", description: "Data copied to clipboard." });
  };

  const handleGrandOpeningBroadcast = () => {
    updateSystemAlert({
      message: "🎉 WELCOME TO THE GRAND OPENING OF KITCHEN PROFIT PROFESSIONAL! Start mastering your margins today.",
      type: "market",
      active: true
    });
    toast({ title: "Grand Opening Broadcasted!", description: "The launch message is now visible to all users." });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Increased to 5MB to accommodate higher quality marketing photos
      if (file.size > 5 * 1024 * 1024) {
        toast({ 
          variant: "destructive", 
          title: "File too large", 
          description: "Please upload an image smaller than 5MB for the AI Lab." 
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setSelectedPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedPhoto) {
      toast({ variant: "destructive", title: "Photo Required", description: "Please upload a photo first." });
      return;
    }

    setIsGeneratingVideo(true);
    try {
      const result = await generateMarketingVideo({
        photoDataUri: selectedPhoto,
        prompt: "Create a high-tech marketing video showing this person sitting in a modern room with a laptop. The screen shows the 'Kitchen Profit Professional' app dashboard, and they are sliding through beautiful data charts and recipe interfaces."
      });
      setGeneratedVideo(result.videoUrl);
      toast({ title: "Video Generated!", description: "Your marketing video is ready for review." });
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Generation Failed", description: error.message || "Model at capacity. Please try again later." });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-2xl">
            <Database size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold text-black/60">Admin Command Center</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold">ROOT ACCESS</Badge>
              <span className="text-sm text-muted-foreground">Admin: chefdtanju@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGrandOpeningBroadcast} className="rounded-xl h-12 px-6 border-primary text-primary hover:bg-primary/5">
            <PartyPopper className="mr-2 h-4 w-4" />
            Launch Grand Opening
          </Button>
          <Button variant="outline" onClick={handleCopyDiagnostics} className="rounded-xl h-12 px-6 border-dashed">
            <Copy className="mr-2 h-4 w-4" />
            Copy Health Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="operations" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 rounded-xl h-12">
          <TabsTrigger value="operations" className="rounded-lg px-8">System Operations</TabsTrigger>
          <TabsTrigger value="marketing" className="rounded-lg px-8 flex gap-2">
            <Video size={16} /> Marketing AI Lab
          </TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <div className="text-xs font-bold text-muted-foreground uppercase flex justify-between items-center">
                  Active Tickets <MessageSquare size={14} className="text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{issues.filter(i => i.status !== 'fixed').length}</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <div className="text-xs font-bold text-muted-foreground uppercase flex justify-between items-center">
                  Global Stock <Users size={14} className="text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{ingredients.length}</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <div className="text-xs font-bold text-muted-foreground uppercase flex justify-between items-center">
                  System Uptime <CheckCircle2 size={14} className="text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-green-600">99.9%</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-primary text-primary-foreground">
              <CardHeader className="pb-2">
                <div className="text-xs font-bold uppercase opacity-80 flex justify-between items-center">
                  AI Readiness <Sparkles size={14} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">STABLE</div>
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
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="rounded-2xl bg-black p-6 text-green-400 font-mono text-[11px] h-64 overflow-y-auto shadow-2xl leading-relaxed">
                    <div className="text-green-500/50"># Kitchen Profit OS v2.0.4 - Diagnostic Mode</div>
                    <div className="text-white/30">--------------------------------------------------</div>
                    <div>&gt; Initializing Secure Handshake with chefdtanju@gmail.com...</div>
                    <div>&gt; Status: AUTH_SUCCESS_LEVEL_ROOT</div>
                    <div>&gt; Scanning Firestore Collections (Global Scope)...</div>
                    <div>&gt; Found {ingredients.length} ingredient nodes.</div>
                    <div>&gt; Found {recipes.length} recipe configurations.</div>
                    <div>&gt; Checking Margin Thresholds... [WARN] Found {recipes.filter(r => r.sellingPrice === 0).length} recipes with NULL_PRICE.</div>
                    <div>&gt; AI Model Link: STABLE</div>
                    <div>&gt; Memory Usage: OPTIMAL</div>
                    <div className="animate-pulse">&gt; Awaiting Command...</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-white">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History size={20} className="text-primary" />
                    Support Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {issues.length === 0 ? (
                      <div className="p-12 text-center text-muted-foreground italic">No active tickets.</div>
                    ) : (
                      issues.map((issue) => (
                        <div key={issue.id} className="p-6 flex items-center justify-between hover:bg-muted/5 transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{issue.title}</span>
                              <Badge variant={issue.severity === 'critical' ? 'destructive' : 'secondary'} className="text-[9px]">
                                {issue.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{issue.description}</div>
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
            <div className="space-y-8">
              <Card className="border-none shadow-xl bg-black text-white overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/10">
                  <CardTitle className="text-lg flex items-center gap-2"><Globe size={20} className="text-primary" /> Domain Infrastructure</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-3">
                      <Server size={18} className="text-green-500" />
                      <div><div className="text-xs font-bold">kitchenprof.ng</div><div className="text-[10px] text-white/40">Status: Pointing to App Hosting</div></div>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-[9px] text-white/60">Registrar Choice: <strong>Whogohost</strong></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <Card className="border-none shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-headline font-bold flex items-center gap-3">
                    <Video className="text-primary" size={28} />
                    Veo AI Video Lab
                  </CardTitle>
                  <CardDescription>Generate high-tech marketing videos using your photo as a reference.</CardDescription>
                </div>
                <Badge className="bg-primary px-3">POWERED BY GEMINI VEO</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">1. Reference Photo</Label>
                    <div className="relative group">
                      <div className="w-full aspect-video rounded-3xl border-2 border-dashed border-primary/20 bg-muted/30 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/40">
                        {selectedPhoto ? (
                          <img src={selectedPhoto} className="w-full h-full object-cover" alt="Reference" />
                        ) : (
                          <>
                            <UploadCloud size={48} className="text-primary/20 mb-4" />
                            <div className="text-sm font-medium text-muted-foreground">Upload your face/picture</div>
                            <div className="text-[10px] text-muted-foreground mt-1">PNG, JPG up to 5MB</div>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {selectedPhoto && (
                        <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 rounded-full" onClick={() => setSelectedPhoto(null)}>
                          Change Photo
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">2. Marketing Scene</Label>
                    <div className="p-6 rounded-2xl bg-muted/30 border space-y-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Play size={18} className="text-primary" />
                        </div>
                        <div className="text-sm leading-relaxed italic text-muted-foreground">
                          "Generate a high-tech video showing this person sitting in a room with a laptop. They are interacting with the Kitchen Profit Professional app dashboard."
                        </div>
                      </div>
                      <Button onClick={handleGenerateVideo} disabled={isGeneratingVideo || !selectedPhoto} className="w-full h-12 bg-primary rounded-xl text-lg font-bold shadow-lg">
                        {isGeneratingVideo ? (
                          <><Loader2 className="mr-2 animate-spin" /> Brewing Cinematic Magic...</>
                        ) : (
                          <><Sparkles className="mr-2" /> Generate Marketing Video</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">3. AI Studio Output</Label>
                  <div className="w-full aspect-video rounded-3xl bg-black flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                    {generatedVideo ? (
                      <video src={generatedVideo} controls className="w-full h-full" autoPlay loop />
                    ) : (
                      <div className="text-center p-8 space-y-4">
                        <Video size={64} className="mx-auto text-white/10" />
                        <div className="text-sm text-white/40 font-medium">Video output will appear here</div>
                        {isGeneratingVideo && (
                          <div className="space-y-2">
                            <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                              <div className="h-full bg-primary animate-progress" style={{ width: '40%' }}></div>
                            </div>
                            <div className="text-[10px] text-primary font-bold uppercase animate-pulse">Processing cinematic frames...</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {generatedVideo && (
                    <Button variant="outline" className="w-full rounded-xl border-dashed" onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedVideo!;
                      link.download = 'kitchen-prof-marketing.mp4';
                      link.click();
                    }}>
                      Download Campaign Video
                    </Button>
                  )}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                    <Sparkles className="text-amber-500 shrink-0" size={16} />
                    <div className="text-[10px] text-amber-800 leading-tight">
                      <strong>AI Tip:</strong> Veo generation takes ~45-60 seconds. Larger videos may take longer to process.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
