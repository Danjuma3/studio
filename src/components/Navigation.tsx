
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
  User,
  ShieldAlert,
  ChefHat,
  LifeBuoy
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
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';
import { useInventory } from '@/app/lib/store';
import { getSafeLogoUrl } from '@/app/lib/branding';

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
  const { systemPayment } = useInventory();
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = () => {
    if (auth) signOut(auth);
  };

  const isAdmin = user?.email === 'chefdtanju@gmail.com';

  if (!user && pathname === '/login') return null;

  const currentLogoUrl = getSafeLogoUrl(systemPayment?.appLogoUrl);

  return (
    <Sidebar variant="sidebar" className="bg-sidebar border-r">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3 mb-4 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-xl shadow-md group-hover:scale-105 transition-transform bg-primary/10 flex items-center justify-center">
            {currentLogoUrl ? (
              <Image
                src={currentLogoUrl}
                alt="Kitchen Profit Logo"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <ChefHat size={24} className="text-primary" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="font-brand font-black text-sm text-primary leading-[1.1] tracking-tighter truncate uppercase">Kitchen Profit Professional</h1>
            <p className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-tighter font-semibold">Managing margins for food business</p>
          </div>
        </Link>
        {isAdmin && (
          <div className="px-2 pb-2">
            <Badge className="w-full justify-center gap-1.5 bg-black/5 text-black/60 hover:bg-black/5 border-black/10 py-1">
              <ShieldAlert size={12} />
              PLATFORM ADMIN
            </Badge>
          </div>
        )}
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

          {isAdmin && (
            <SidebarMenuItem className="mt-2">
              <SidebarMenuButton
                asChild
                isActive={pathname === '/support'}
                className={cn(
                  "flex items-center gap-3 py-6 px-4 rounded-xl transition-all duration-200 border-2 border-dashed border-primary/20",
                  pathname === '/support'
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "hover:bg-primary/5 text-primary"
                )}
              >
                <Link href="/support">
                  <LifeBuoy size={20} />
                  <span className="font-bold">Support & AI Workspace</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

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
               <p className="text-[10px] font-bold truncate text-black/60">{user.email}</p>
               <button onClick={handleLogout} className="text-[9px] text-black/60 hover:underline flex items-center gap-1 font-bold">
                 <LogOut size={10} className="text-black/60" /> LOGOUT
               </button>
             </div>
          </div>
        ) : (
          <SidebarMenuButton asChild className="bg-primary text-white hover:bg-primary/90">
            <Link href="/login"><User size={16} /> Login</Link>
          </SidebarMenuButton>
        )}
        <div className="text-[10px] text-muted-foreground text-center pt-2">
          &copy; {new Date().getFullYear()} Kitchen Profit Professional
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
