
"use client";

import Image from 'next/image';
import './globals.css';
import { AppNavigation } from '@/components/Navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { useInventory } from './lib/store';
import { getSafeLogoUrl } from './lib/branding';
import { ChefHat } from 'lucide-react';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { systemPayment } = useInventory();
  const currentLogoUrl = getSafeLogoUrl(systemPayment?.appLogoUrl);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppNavigation />
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-16 flex items-center gap-4 border-b px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30 pt-[safe-area-inset-top]">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1 flex items-center md:hidden">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden mr-2 flex items-center justify-center bg-white/40 backdrop-blur-md border border-white/60 shadow-sm p-1.5">
                {currentLogoUrl ? (
                  <Image 
                    src={currentLogoUrl} 
                    alt="Kitchen Profit" 
                    fill 
                    className="object-contain p-1 opacity-80"
                    priority
                    unoptimized 
                  />
                ) : (
                  <ChefHat className="text-primary w-5 h-5 opacity-60" />
                )}
              </div>
              <span className="font-brand font-bold text-primary text-sm tracking-tight truncate uppercase">Kitchen Profit Professional</span>
            </div>
            <div className="flex-1 hidden md:block">
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Buchi's Kitchen</p>
                <p className="text-xs text-primary font-medium tracking-wide">Managing margins for food business</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-md border-2 border-white">
                BK
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full pb-[calc(1rem+safe-area-inset-bottom)]">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent/30 selection:text-primary overflow-x-hidden safe-area-inset">
        <FirebaseClientProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
