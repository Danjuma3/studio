
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, TrendingUp, PackageSearch, Calculator, Zap, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl text-white mb-4 shadow-xl">
          <ChefHat size={48} />
        </div>
        <h1 className="text-4xl font-headline font-bold">About Kitchen Prof</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          The ultimate intelligent companion for Lagos restaurant owners to master their margins and dominate the market.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
            <Zap className="text-primary" size={24} />
            Our Mission
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            In the fast-paced and volatile food market of Lagos, pricing errors can destroy a restaurant in weeks. Kitchen Prof was built to bridge the gap between the chaos of Mile 12 market prices and your kitchen's profitability. We empower chefs and managers with data-driven clarity.
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
              <CardTitle className="text-lg">Stock Control</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Real-time tracking of pantry levels with intelligent "Low Stock" alerts based on your weekly usage patterns.
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <Calculator className="text-primary mb-2" size={32} />
              <CardTitle className="text-lg">Plate Costing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Instant analysis of food cost percentages. Know exactly which recipes are healthy and which need price adjustments.
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <TrendingUp className="text-primary mb-2" size={32} />
              <CardTitle className="text-lg">AI Profit Audit</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Automated procurement strategies that compare bulk vs. retail prices to find hidden savings in your supply chain.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
