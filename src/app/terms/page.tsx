"use client";

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Terms & Regulations</h1>
        <p className="text-muted-foreground mt-2">Last updated: May 2024</p>
      </div>

      <ScrollArea className="h-[600px] rounded-xl border bg-white p-8 shadow-sm">
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing and using Kitchen Prof, you agree to comply with and be bound by these Terms and Conditions. This application is designed for restaurant management and business optimization purposes within the Nigerian legal framework.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">2. AI and Data Accuracy Disclaimer</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kitchen Prof utilizes Generative AI to provide cost optimization insights. While we strive for accuracy, these suggestions are estimates based on provided data and general market trends. Kitchen Prof is not liable for business decisions, financial losses, or pricing errors resulting from AI-generated recommendations. Users must verify all market data before making large procurement commitments.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">3. Local Storage and Data Privacy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In this version, Kitchen Prof stores your inventory and recipe data locally on your device's browser (Local Storage). You are responsible for maintaining the security of your device. We comply with the Nigeria Data Protection Regulation (NDPR) regarding the handling of business information provided during the use of this service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">4. Market Price Syncing</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Market price updates (e.g., Mile 12, Lagos Island) are provided as community-driven or aggregated estimates. Kitchen Prof does not guarantee the availability of goods at the specific prices shown, as market conditions in Lagos fluctuate hourly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">5. Subscription and Billing</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pro features are billed monthly. Cancellation of a subscription will result in the loss of access to AI-driven audits at the end of the current billing cycle. No refunds are provided for partial months of service.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-xl font-bold">6. Prohibited Use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users may not use Kitchen Prof for any illegal activity, including but not limited to price-fixing cartels or fraudulent reporting. We reserve the right to terminate access for users who violate these ethical standards.
            </p>
          </section>
        </div>
      </ScrollArea>

      <div className="p-6 rounded-2xl bg-muted/30 border text-center">
        <p className="text-sm font-medium">
          Questions about our terms? Contact our support team at <span className="text-primary font-bold">legal@kitchenprof.ng</span>
        </p>
      </div>
    </div>
  );
}
