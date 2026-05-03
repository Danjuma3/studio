
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, PackageSearch, Calculator, Zap, ShieldCheck } from 'lucide-react';
import { BrandedLogo } from '@/components/BrandedLogo';
import { useInventory } from '../lib/store';
import { getSafeLogoUrl } from '../lib/branding';

export default function AboutPage() {
  const { systemPayment } = useInventory();
  const currentLogoUrl = getSafeLogoUrl(systemPayment?.appLogoUrl);

  return (
    <div className="space-y-12 max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <BrandedLogo 
            url={currentLogoUrl} 
            size={120} 
            className="rounded-[2.5rem] shadow-2xl border-4 border-white" 
          />
        </div>
        <h1 className="text-4xl font-headline font-bold">About Kitchen Prof</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          The ultimate intelligent companion for restaurant owners to master their margins and dominate the market.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
            <Zap className="text-primary" size={24} />
            Our Mission
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            In fast-paced and volatile food markets, pricing errors can destroy a restaurant in weeks. Kitchen Prof was built to bridge the gap between chaotic market prices and your kitchen's profitability. We empower chefs and managers with data-driven clarity.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
            <ShieldCheck className="text-primary" size={24} />
            Why It Matters
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Most restaurants lose 15-20% of their potential profit through unoptimized procurement and inaccurate costing. Kitchen Prof automates the math so you can focus on the food, ensuring your business remains "Live & Profitable" every single day.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline font-bold text-center">Core Functions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <PackageSearch className="text-primary mb-2" size={32} />
              <CardTitle className="text-lg font-bold">Stock Control</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Real-time tracking of pantry levels with intelligent "Low Stock" alerts based on your usage patterns.
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <Calculator className="text-primary mb-2" size={32} />
              <CardTitle className="text-lg font-bold">Plate Costing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Instant analysis of food cost percentages. Know exactly which recipes are healthy and which need price adjustments.
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <TrendingUp className="text-primary mb-2" size={32} />
              <CardTitle className="text-lg font-bold">AI Profit Audit</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Automated procurement strategies that compare bulk vs. retail prices to find hidden savings in your supply chain.
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="p-8 rounded-[2rem] bg-muted/30 border text-center space-y-4">
        <h3 className="text-xl font-headline font-bold">Official Communication</h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          For legal inquiries, partnership opportunities, or technical support, please reach out to our official desk at <a href="mailto:legal@kitchenprof.ng" className="text-primary font-bold hover:underline">legal@kitchenprof.ng</a>.
        </p>
      </div>
    </div>
  );
}
