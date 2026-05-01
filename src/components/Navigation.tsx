
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Calculator, 
  TrendingUp,
  Settings,
  ShieldCheck,
  CookingPot,
  Store,
  Info,
  FileText,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter
} from '@/components/ui/sidebar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Stock Taking', href: '/stock', icon: PackageSearch },
  { name: 'Recipe Composer', href: '/recipes', icon: CookingPot },
  { name: 'Cost Percentage', href: '/costing', icon: Calculator },
  { name: 'Profit Calculator', href: '/profit', icon: TrendingUp },
  { name: 'Market Updates', href: '/market', icon: Store },
  { name: 'Manager Tools', href: '/manager', icon: ShieldCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const secondaryNav = [
  { name: 'About App', href: '/about', icon: Info },
  { name: 'Terms & Rules', href: '/terms', icon: FileText },
];

export function AppNavigation() {
  const pathname = usePathname();
  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = () => {
    if (auth) signOut(auth);
  };

  if (!user && pathname === '/login') return null;

  return (
    <Sidebar variant="sidebar" className="bg-sidebar border-r">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3 mb-4 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-xl shadow-md group-hover:scale-105 transition-transform">
            {logo ? (
              <Image 
                src={logo.imageUrl} 
                alt="Kitchen Prof Logo" 
                fill 
                className="object-cover"
                data-ai-hint={logo.imageHint}
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-white">
                KP
              </div>
            )}
          </div>
          <div>
            <h1 className="font-headline font-bold text-lg text-primary leading-none">Kitchen Prof</h1>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">food cost control/Analysis</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          <div className="px-3 mb-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Main Operations</p>
          </div>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.href}
                className={cn(
                  "flex items-center gap-3 py-6 px-4 rounded-xl transition-all duration-200",
                  pathname === item.href 
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <div className="px-3 mt-6 mb-2 border-t pt-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Legal & Info</p>
          </div>
          {secondaryNav.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.href}
                className={cn(
                  "flex items-center gap-3 py-5 px-4 rounded-xl transition-all duration-200",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon size={18} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 flex flex-col gap-2">
        {user ? (
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-xl">
             <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
               {user.email?.[0].toUpperCase() || 'U'}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-[10px] font-bold truncate">{user.email}</p>
               <button onClick={handleLogout} className="text-[9px] text-destructive hover:underline flex items-center gap-1">
                 <LogOut size={10} /> Logout
               </button>
             </div>
          </div>
        ) : (
          <SidebarMenuButton asChild className="bg-primary text-white hover:bg-primary/90">
            <Link href="/login"><User size={16} /> Login</Link>
          </SidebarMenuButton>
        )}
        <div className="text-[10px] text-muted-foreground text-center pt-2">
          &copy; {new Date().getFullYear()} Kitchen Prof Lagos
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
