
import type {Metadata} from 'next';
import Image from 'next/image';
import './globals.css';
import { AppNavigation } from '@/components/Navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const metadata: Metadata = {
  title: 'Kitchen Prof - Food Cost Control & Analysis',
  description: 'The ultimate intelligent companion for Lagos restaurant owners to master their margins and dominate the market.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent/30 selection:text-primary overflow-x-hidden">
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full bg-background">
            <AppNavigation />
            <SidebarInset className="flex flex-col flex-1">
              <header className="h-16 flex items-center gap-4 border-b px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1 flex items-center md:hidden">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden mr-2">
                    {logo && (
                      <Image 
                        src={logo.imageUrl} 
                        alt="Kitchen Prof" 
                        fill 
                        className="object-cover"
                        data-ai-hint={logo.imageHint}
                      />
                    )}
                  </div>
                  <span className="font-headline font-bold text-primary">Kitchen Prof</span>
                </div>
                <div className="flex-1 hidden md:block">
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold">Buchi's Kitchen</p>
                    <p className="text-xs text-primary font-medium tracking-wide">@buchi_kitchen_lagos</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-md border-2 border-white">
                    BK
                  </div>
                </div>
              </header>
              <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
