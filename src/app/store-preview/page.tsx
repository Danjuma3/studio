
"use client";

import { useInventory } from '../lib/store';
import { getSafeLogoUrl } from '../lib/branding';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Star, 
  Share2, 
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandedLogo } from '@/components/BrandedLogo';

export default function StorePreviewPage() {
  const { systemPayment, location } = useInventory();
  const currentLogoUrl = getSafeLogoUrl(systemPayment?.appLogoUrl);

  const StoreLayout = ({ platform }: { platform: 'ios' | 'android' }) => (
    <div className={`w-full max-w-sm mx-auto border-[8px] border-black rounded-[3rem] overflow-hidden bg-white shadow-2xl h-[700px] flex flex-col relative`}>
      {/* Status Bar Mock */}
      <div className="h-10 bg-white flex items-center justify-between px-8 pt-2">
        <div className="text-[10px] font-bold">9:41</div>
        <div className="flex gap-1 items-center">
          <div className="w-4 h-2 rounded-[1px] border border-black" />
          <div className="w-1 h-1 rounded-full bg-black" />
        </div>
      </div>

      {/* Store Navigation */}
      <div className="px-4 py-2 flex items-center justify-between border-b bg-white">
        <ChevronLeft size={20} className="text-blue-500" />
        <span className="text-xs font-bold">{platform === 'ios' ? 'App Store' : 'Google Play'}</span>
        <Share2 size={18} className="text-blue-500" />
      </div>

      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        {/* Header Info */}
        <div className="p-5 flex gap-5">
          <BrandedLogo 
            url={currentLogoUrl} 
            size={96} 
            className="rounded-2xl shadow-lg border" 
          />
          <div className="flex-1">
            <h1 className="text-xl font-headline font-black leading-tight text-gray-900">Kitchen Profit Professional</h1>
            <p className="text-xs text-blue-500 font-medium mt-1">Managing margins for food business</p>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" className="bg-blue-500 text-white rounded-full px-6 h-7 text-[10px] font-bold">
                GET
              </Button>
              <Badge variant="outline" className="text-[8px] h-4 py-0 font-bold border-gray-300">4+</Badge>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-around border-y py-3 px-2">
          <div className="text-center border-r flex-1">
            <div className="text-[10px] font-bold flex items-center justify-center gap-0.5">
              4.9 <Star size={8} fill="currentColor" />
            </div>
            <div className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Ratings</div>
          </div>
          <div className="text-center border-r flex-1">
            <div className="text-[10px] font-bold">#1</div>
            <div className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Food/Biz</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-[10px] font-bold">48 MB</div>
            <div className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Size</div>
          </div>
        </div>

        {/* Screenshot Gallery */}
        <div className="p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Screenshots</p>
          <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[140px] h-[260px] bg-muted rounded-xl border relative overflow-hidden shadow-sm">
                <Image 
                  src={`https://picsum.photos/seed/kp-screen-${i}/300/600`} 
                  alt="Screenshot" 
                  fill 
                  className="object-cover" 
                  unoptimized 
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-black/40 backdrop-blur-md">
                   <div className="text-[8px] text-white font-bold leading-tight">
                     {i === 1 ? 'Global Market Sync' : i === 2 ? 'AI Profit Audit' : 'Recipe Costing'}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="p-4 border-t space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold">Description</h2>
            <ChevronRight size={14} className="text-gray-300" />
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            Kitchen Profit Professional is the world's most intelligent food cost control platform. Built for the volatile modern market, our AI-driven system detects your regional hub in {location.city} and synchronizes global commodity prices to protect your margins.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Store Listing Preview</h1>
          <p className="text-muted-foreground">See how your professional branding looks on global mobile marketplaces.</p>
        </div>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/support">
            <ChevronLeft size={18} className="mr-2" /> Back to Admin
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="ios" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="bg-muted p-1 rounded-full h-12 px-2">
            <TabsTrigger value="ios" className="rounded-full px-8 flex gap-2">
              <Smartphone size={16} /> iOS App Store
            </TabsTrigger>
            <TabsTrigger value="android" className="rounded-full px-8 flex gap-2">
              <Smartphone size={16} /> Google Play
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="ios" className="animate-in zoom-in-95 duration-300">
          <StoreLayout platform="ios" />
        </TabsContent>

        <TabsContent value="android" className="animate-in zoom-in-95 duration-300">
          <StoreLayout platform="android" />
        </TabsContent>
      </Tabs>

      <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-primary/5 border border-dashed border-primary/20 text-center space-y-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <Info size={24} />
        </div>
        <div>
          <h3 className="font-bold">Pro Tip: Icon Geometry</h3>
          <p className="text-sm text-muted-foreground mt-1">
            For best results on mobile stores, ensure your logo (App Logo in Settings) is center-weighted. Modern stores automatically apply rounded corners or "squircle" masks to your icon.
          </p>
        </div>
      </div>
    </div>
  );
}
